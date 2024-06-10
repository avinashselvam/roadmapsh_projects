from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from bcrypt import checkpw, hashpw, gensalt
import jwt
import os

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"

db = SQLAlchemy(app)

CORS(app)

class User(db.Model):

    __tablename__ = 'auth'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    hashed_password = db.Column(db.String)

    def __init__(self, username, password):
        self.username = username
        self.hashed_password = hashpw(password, gensalt())

    def check_password(self, password):
        print(password, self.hashed_password)
        return checkpw(password, self.hashed_password)

with app.app_context():
    db.create_all()

@app.put("/users")
def register_new_user():
    payload = request.get_json()
    username = payload.get('username')
    password = payload.get('password')

    print(f'got {username}, {password}')

    # check user exists
    user_exists = (db.session.query(User).with_entities(User.username).filter(User.username == username).count() == 1)
    if user_exists:
        return {"success": False, "message": "user already exists"}, 409 # conflict

    # if not create one
    db.session.add(User(username, password))
    db.session.commit()
    return {"success": True, "message": "registered successfully"}, 201 # create success

@app.post("/auth")
def login():
    payload = request.get_json()
    username = payload.get('username')
    password = payload.get('password')

    user = db.session.query(User).filter(User.username == username).scalar()

    if user is None:
        return {"success": False, "message": "user doesn't exist"}, 404 # not found
    else:
        is_correct_password = user.check_password(password)
        if is_correct_password:
            new_generated_token = jwt.encode({"username": username}, key=os.environ['SECRET'], algorithm='HS256')
            return {"success": True, "message": "login succesfull", "token": new_generated_token}, 200 # general success
        else:
            return {"success": False, "message": "incorrect password"}, 401 # unauthorised
        
@app.get("/authorised_content")
def get_authorised_content():
        auth_header = request.headers.get('Authorization')
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(
                token,
                key=os.environ['SECRET'],
                algorithms=['HS256']
            )
            username = payload["username"]
            response = {"success": True, "message": f"Congrats {username}. You may enter."}, 200
        except jwt.exceptions.InvalidTokenError as E:
            print('invalid token exception', E)
            response = {"success": False, "message": "You don't belong here."}, 401
        except Exception as E:
            print('generic exception', E)
            response = {"success": False, "message": "You don't belong here."}, 401
        print('auth content', response)
        return response

@app.get("/test")
def test():
    return "hi", 200





