from bcrypt import gensalt, hashpw, checkpw
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
from dataclasses import dataclass

db = SQLAlchemy()

class Movie(db.Model):

    __tablename__ = 'movies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    runtime_in_minutes = db.Column(db.Integer)

    def __init__(self, name, runtime):
        self.name = name
        self.runtime_in_minutes = runtime

class Seat(db.Model):

    __tablename__ = 'seats'
    id = db.Column(db.Integer, primary_key=True)
    theatre_id = db.Column(db.Integer)
    row = db.Column(db.String)
    column = db.Column(db.String)

    def __init__(self, theatre_id, row, column):
        self.theatre_id = theatre_id
        self.row = row
        self.column = column

class Show(db.Model):

    __tablename__ = 'shows'
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer)
    theatre_id = db.Column(db.Integer)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    at = db.Column(db.Time)

    def __init__(self, movie_id, theatre_id, start_date, num_run_days, at):
        self.movie_id = movie_id
        self.theatre_id = theatre_id
        self.start_date = start_date
        self.end_date = start_date + timedelta(days=num_run_days)
        self.at = at

@dataclass
class Theatre(db.Model):

    __tablename__ = 'theatres'
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String)
    address: str = db.Column(db.String)

    def __init__(self, name, address):
        self.name = name
        self.address = address

class Ticket(db.Model):

    __tablename__ = 'tickets'
    id = db.Column(db.Integer, primary_key=True)
    seat_id = db.Column(db.Integer)
    show_id = db.Column(db.Integer)

    def __init__(self, seat_id, show_id):
        self.seat_id = seat_id
        self.show_id = show_id


class User(db.Model):

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    hashed_password = db.Column(db.String)

    def __init__(self, username, password):
        self.username = username
        self.hashed_password = hashpw(password, gensalt())

    def check_password(self, password):
        return checkpw(password, self.hashed_password)