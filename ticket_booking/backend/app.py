from flask_cors import CORS
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ticket_booking_system.db"

from theatres import Theatre
from movies import Movie
from users import User
from shows import Show
from seats import Seat
from tickets import Ticket

db = SQLAlchemy(app)

CORS(app)

def make_response(success, message, data):
    return {
        "succes": success,
        "message": message,
        "data": data
    }
        
@app.get("/theatres")
def get_list_of_theatres():
    return db.session.query(Theatre).all()

@app.get("/movies")
def get_list_of_movies():
    return db.session.query(Movie).all()

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



