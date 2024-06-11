from app import db

class Show(db.Model):

    __tablename__ = 'shows'
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer)
    theatre_id = db.Column(db.Integer)
    start_date = db.Column(db.Timestamp)
    end_date = db.Column(db.Timestamp)
    at = db.Column(db.Timestamp)