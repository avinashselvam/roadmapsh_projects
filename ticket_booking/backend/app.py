from flask_cors import CORS
from flask import Flask, request
from models import db, Theatre, Movie, User, Show, Seat, Ticket
from datetime import date, time

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ticket_booking_system.db"

def init_db_with_movies_theatres_seats():

    if db.session.query(Theatre).count() > 0:
        return

    # lets add 5 theatres
    theatres = [
        Theatre("PVR Nexus", "Koramangala"),
        Theatre("PVR Orion", "Yeshwanthpur"),
        Theatre("PVR Phoenix", "Whitefield"),
        Theatre("Cinepolis Gopalan Cinemas", "Old Madras Road"),
        Theatre("PVR Vega City", "Bannerghatta Road"),
    ]
    db.session.add_all(theatres)

    # lets add 5 movies
    movies = [
        Movie("Furiosa: A Mad Max Sage", 162),
        Movie("Hit Man", 154),
        Movie("The First Omen", 127),
        Movie("Bad Boys: Ride or Die", 177),
        Movie("Inside Out 2", 140),
    ]
    db.session.add_all(movies)

    # assuming all theatres have same seating arrangement
    seats = []
    for theatre in theatres:
        for row in "ABCDEFGHIJKL":
            for col in range(1, 21):
                seats.append(Seat(theatre.id, row, str(col)))
    db.session.add_all(seats)

    # all movies run on all theatres at different times
    shows = []
    for theatre in theatres:
        for i, movie in enumerate(movies):
            shows.append(Show(movie.id, theatre.id, date(2024, 6, 5), 3, time(9 + 2*i, 25)))
    db.session.add_all(shows)

    db.session.commit()

with app.app_context():
    db.init_app(app)
    db.create_all()
    init_db_with_movies_theatres_seats()

CORS(app)

def make_response(success, message, data):
    return {
        "succes": success,
        "message": message,
        "data": data
    }
        
@app.get("/theatres")
def get_list_of_theatres():
    data = db.session.query(Theatre).all()
    return make_response(True, "fetched theatres successfully", data), 200

@app.get("/movies")
def get_list_of_movies():
    return make_response(True, "fetched movies successfully", db.session.query(Movie).all()), 200

@app.get("/shows")
def get_list_of_shows():

    # filter based on what the user has selected
    theatre_id = request.args.get('theatre_id', None)
    movie_id = request.args.get('movie_id', None)

    if (theatre_id is None) and (movie_id is None):
        data = db.session.query(Show).all()
    elif movie_id is None:
        data = db.session.query(Show).filter(Show.theatre_id == theatre_id).all()
    elif theatre_id is None:
        data = db.session.query(Show).filter(Show.movie_id == movie_id).all()
    else:
        data = None
    
    if data is None:
        response = make_response(False, "both filter mentioned", data), 400
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
    unbooked_seats = all_seats.filter(~Seat.id.in_(booked_seats))

    return make_response(True, f"fetched unbooked seats for show {show_id}", unbooked_seats), 200

@app.put("/tickets")
def book_ticket():
    
    payload = request.get_json()
    show_id = payload['show_id']
    seat_id = payload['seat_id']
    try:
        db.session.add(Ticket(seat_id, show_id))
        db.session.commit()
        response = make_response(True, "ticket successfully booked", None), 201
    except Exception as E:
        print('failed to book ticket', E)
        response = make_response(False, "unable to book the ticket", None), 500
    return response



