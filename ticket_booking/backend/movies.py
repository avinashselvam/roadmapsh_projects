from app import db

class Movie(db.Model):

    __tablename__ = 'movies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    runtime_in_minutes = db.Column(db.Integer)

    def __init__(self, name, runtime):
        self.name = name
        self.runtime_in_minutes = runtime