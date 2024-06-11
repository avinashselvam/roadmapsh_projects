from app import db
from bcrypt import gensalt, hashpw, checkpw

class User(db.Model):

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    hashed_password = db.Column(db.String)

    def __init__(self, username, password):
        self.username = username
        self.hashed_password = hashpw(password, gensalt())

    def check_password(self, password):
        print(password, self.hashed_password)
        return checkpw(password, self.hashed_password)
