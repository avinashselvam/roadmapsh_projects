from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"

db = SQLAlchemy(app)

class Article(db.Model):

    __tablename__ = 'articles'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    content = db.Column(db.String)
    created_at = db.Column(db.DateTime)

    def __init__(self, title, content):
        self.title = title
        self.content = content
        self.created_at = datetime.now()

with app.app_context():
    db.create_all()

@app.get("/articles")
def get_list_of_all_articles():
    articles = db.session.execute(db.select(Article).order_by(Article.created_at)).scalars().all()
    return [article.id for article in articles], 200

@app.post("/articles")
def add_new_article():
    new_article = Article(request.form.get('title'), request.form.get('content'))
    db.session.add(new_article)
    db.session.commit()
    return {"message": "product added successfully"}, 201

@app.get("/articles/<int:id>")
def get_article(id):
    required_article = db.get_or_404(Article, id)
    print(required_article)
    return {"title": required_article.title, "content": required_article.content}

@app.patch("/articles/<int:id>")
def update_article(id):
    pass

@app.delete("/articles/<int:id>")
def delete_article(id):
    required_article = db.get_or_404(Article, id)
    db.session.delete(required_article)
    db.session.commit()
    return {"message": "product deleted successfully"}, 200

app.run("0.0.0.0", port=5000)