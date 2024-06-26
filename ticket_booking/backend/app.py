from flask_cors import CORS
from flask import Flask, request
from models import db, Theatre, Movie, User, Show, Seat, Ticket
from datetime import date, time, datetime
import jwt
import os
import razorpay

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ticket_booking_system.db"
app.config['SECRET'] = os.environ['SECRET']

def protected(route):
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(" ")[1]
                jwt.decode(token, app.config['SECRET'], algorithms=['HS256'])
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                return make_response(False, "Invalid token sent", None), 401
        else:
            return make_response(False, "Auth header not present", None), 401
        return route(*args, **kwargs)
    return decorated_function

def init_db_with_movies_theatres_seats():

    if db.session.query(Theatre).count() > 0:
        return

    # lets add 5 theatres
    theatre_objects = [
        Theatre("PVR Nexus", "Koramangala"),
        Theatre("PVR Orion", "Yeshwanthpur"),
        Theatre("PVR Phoenix", "Whitefield"),
        Theatre("Cinepolis Gopalan Cinemas", "Old Madras Road"),
        Theatre("PVR Vega City", "Bannerghatta Road"),
    ]
    db.session.add_all(theatre_objects)
    theatres = db.session.query(Theatre).all()

    # lets add 5 movies
    movie_objects = [
        Movie("Furiosa: A Mad Max Sage", 162),
        Movie("Hit Man", 154),
        Movie("The First Omen", 127),
        Movie("Bad Boys: Ride or Die", 177),
        Movie("Inside Out 2", 140),
    ]
    db.session.add_all(movie_objects)
    movies = db.session.query(Movie).all()

    # assuming all theatres have same seating arrangement
    seat_objects = []
    for theatre in theatres:
        for row in "ABCDEFGHIJKL":
            for col in range(1, 21):
                seat_objects.append(Seat(theatre.id, row, str(col)))
    db.session.add_all(seat_objects)

    # all movies run on all theatres at different times
    shows_objects = []
    for theatre in theatres:
        for i, movie in enumerate(movies):
            shows_objects.append(Show(movie.id, theatre.id, date(2024, 6, 25), 3, time(9 + 2*i, 25)))
    db.session.add_all(shows_objects)

    db.session.commit()

with app.app_context():
    db.init_app(app)
    db.create_all()
    init_db_with_movies_theatres_seats()

CORS(app)

def make_response(success, message, data):
    return {
        "success": success,
        "message": message,
        "data": data
    }

@app.post("/auth")
def login_user():

    payload = request.get_json()

    username = payload['username']
    password = payload['password']

    user = db.session.query(User).filter(User.username == username).scalar()
    if user is None:
        return make_response(False, "user does not exist. try signing up", None), 404
    
    correct_password = user.check_password(password)
    if correct_password:
        token = jwt.encode({"username": username}, app.config['SECRET'], 'HS256')
        response = make_response(True, "logged in successfully", token), 200
    else:
        response = make_response(False, "wrong password", None), 401

    return response
    


@app.put("/users")
def signup_user():

    payload = request.get_json()

    username = payload['username']
    password = payload['password']

    user_exists = db.session.query(User).filter(User.username == username).count() > 0
    if user_exists:
        return make_response(False, "user already exists. try signing in", None), 409

    user = User(username, password)
    db.session.add(user)
    db.session.commit()

    return make_response(True, "signup successful", None), 201
        
@app.get("/theatres")
@protected
def get_list_of_theatres():
    data = db.session.query(Theatre).all()
    return make_response(True, "fetched theatres successfully", data), 200

@app.get("/movies")
def get_list_of_movies():
    return make_response(True, "fetched movies successfully", db.session.query(Movie).all()), 200

@app.get("/shows")
def get_list_of_shows():

    # TODO join with theatres and movies and fetch names

    # filter based on what the user has selected
    theatre_id = request.args.get('theatre_id', None)
    movie_id = request.args.get('movie_id', None)
    show_date = request.args.get('date', None)
    show_date = datetime.strptime(show_date, "%d/%m/%Y").date()

    if (theatre_id is None) and (movie_id is None):
        data = db.session.query(Show).all()
    elif movie_id is None:
        data = db.session.query(Show, Theatre, Movie). \
        filter(
            Show.theatre_id == theatre_id,
            Show.start_date <= show_date,
            show_date <= Show.end_date
        ). \
        join(Theatre, Show.theatre_id == Theatre.id). \
        join(Movie, Show.movie_id == Movie.id). \
        all()

        data = [row._asdict() for row in data]
    elif theatre_id is None:
        data = db.session.query(Show).filter(Show.movie_id == movie_id, Show.start_date <= show_date, show_date <= Show.end_date).all()
    else:
        data = None
    
    if data is None:
        response = make_response(False, "required args not passed", data), 400
    else:
        response = make_response(True, "fetched shows successfully", data), 200
    
    return response

@app.get("/seats")
def get_list_of_available_seats():

    show_id = request.args.get('show_id', None)

    if show_id is None:
        return make_response(False, "show id is a required parameter", None), 400

    show = db.session.query(Show).filter(Show.id == show_id).scalar()

    # all the seats from the theatre that aren't booked already (i.e present in tickets table)
    all_seats = db.session.query(Seat).filter(Seat.theatre_id == show.theatre_id)
    booked_seats = db.session.query(Ticket).filter(Ticket.show_id == show.id).with_entities(Ticket.seat_id)
    unbooked_seats = all_seats.filter(~Seat.id.in_(booked_seats)).all()

    return make_response(True, f"fetched unbooked seats for show {show_id}", unbooked_seats), 200

@app.put("/tickets")
def book_ticket():
    
    payload = request.get_json()

    show_id = payload['show_id']
    seat_id = payload['seat_id']
    username = payload['username']
    user_id = db.session.query(User).filter(User.username == username).with_entities(User.id).scalar()
    try:
        db.session.add(Ticket(seat_id, show_id, user_id))
        db.session.commit()
        response = make_response(True, f"ticket successfully booked by {user_id} for {show_id} at seat {seat_id}", None), 201
    except Exception as E:
        print('failed to book ticket', E)
        response = make_response(False, "unable to book the ticket", None), 500

    return response

@app.get("/tickets")
def get_ticket_bookings_of_user():

    user_id = request.args.get('user_id', None)
    
    if user_id is None:
        return make_response(False, "user_id is a required argument", None)
    
    data = db.session.query(Ticket, Show, Theatre, Movie, Seat).\
        filter(Ticket.user_id == int(user_id)).\
        join(Show, Ticket.show_id == Show.id).\
        join(Theatre, Show.theatre_id == Theatre.id).\
        join(Movie, Show.movie_id == Movie.id).\
        join(Seat, Ticket.seat_id == Seat.id).\
        all()
    
    data = [row._asdict() for row in data]

    return make_response(True, f"fetched tickets of {user_id}", data)

@app.get("/razorpay_orders")
def get_razorpay_order_id():

    amount = request.args.get('amount', None)

    if amount is None:
        return make_response(False, "amount arg required to create order", None), 400

    client = razorpay.Client(auth=(os.environ.get('RZP_KEY'), os.environ.get('RZP_SECRET')))

    resp = client.order.create({
        "amount": amount,
        "currency": "INR",
    })

    print(resp)

    return make_response(True, "order succesfully created on razorpay", None)




