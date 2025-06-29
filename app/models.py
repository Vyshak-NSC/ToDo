from .extensions import db
from datetime import datetime

class Todo(db.Model):
    uid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.String(200), nullable=False)
    status = db.Column(db.Boolean, default=False)
    date = db.Column(db.DateTime, default=datetime.now)
    