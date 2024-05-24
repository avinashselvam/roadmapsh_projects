from flask import Flask, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///url_shortener.db"

db = SQLAlchemy(app)

class URL(db.Model):

    __tablename__ = 'urls'
    id = db.Column(db.Integer, primary_key=True)
    long_url = db.Column(db.String)
    short_url = db.Column(db.String)
    created_at = db.Column(db.DateTime)

    def __init__(self, long_url, short_url):
        self.long_url = long_url
        self.short_url = short_url
        self.created_at = datetime.now()

with app.app_context():
    db.create_all()

class Utils:

    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    mapping_to_base62 = {str(idx): char for idx, char in enumerate(chars)}
    mapping_to_decimal = {char: str(idx) for idx, char in enumerate(chars)}

    def get_base62(decimal):
        base62 = []
        while decimal > 0:
            base62.append(Utils.mapping_to_base62[decimal%62])
            decimal //= 62
        return "".join(base62)

    def get_decimal(base62):
        decimal = []
        for i in range(len(base62)-1, -1, -1):
            decimal.append(Utils.mapping_to_decimal[base62[i]])
        return "".join(decimal)

    def compute_shortened_url(idx):
        base62 = Utils.get_base62(idx)
        return "http://127.0.0.1:5000/" + base62

@app.post("/shorten")
def make_short_url():
    data = request.get_json()
    long_url = data['long_url']
    num_rows_in_db = db.session.query(URL).count()
    short_url = Utils.compute_shortened_url(num_rows_in_db)
    new_url_entry = URL(long_url, short_url)
    db.session.add(new_url_entry)
    db.session.commit()
    return {"success": True, "long_url": long_url, "short_url": short_url}, 201

@app.get("/<short_url>")
def send_redirection(short_url):
    idx = Utils.get_decimal(short_url)
    required_url = db.session.query(URL).get(idx)
    long_url = required_url.long_url
    if not (long_url.startswith("http://") or long_url.startswith("https://")):
        long_url = "http://" + long_url
    return redirect(long_url)

