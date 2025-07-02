import os

class Config:
    FLASK_APP = 'app'
    SECRET_KEY = os.getenv('SECRET_KEY','FALLBACK_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL','sqlite:///todo.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False