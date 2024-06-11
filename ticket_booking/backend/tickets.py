from app import db

class Ticket(db.Model):

    __tablename__ = 'tickets'
    id = db.Column(db.Integer, primary_key=True)
    seat_id = db.Column(db.Integer)
    show_id = db.Column(db.Integer)

    def __init__(self, seat_id, show_id):
        self.seat_id = seat_id
        self.show_id = show_id