from app import db

class Seat(db.Model):

    __tablename__ = 'seats'
    id = db.Column(db.Integer, primary_key=True)
    theatre_id = db.Column(db.Integer)
    row = db.Column(db.String)
    column = db.Column(db.String)