from app import db

class Theatre(db.Model):

    __tablename__ = 'theatres'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    address = db.Column(db.String)

    def __init__(self, name, address):
        self.name = name
        self.address = address