from flask import Flask, jsonify
from dotenv import load_dotenv
from app.extensions import db, migrate, ma, socketio
from flask_cors import CORS
# from .config import Config
import os

load_dotenv()
from app.models import *
class Config:
    FLASK_APP = 'app'
    SECRET_KEY = os.getenv('SECRET_KEY','FALLBACK_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL','sqlite:///todo.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    ma.init_app(app)
    socketio.init_app(app, async_mode='threading')
    migrate.init_app(app, db)
    CORS(app)
    
    with app.app_context():
        db.create_all()
        
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            "error": "Not Found",
            "message": e.description or "The requested resource was not found"
        }), 404
        
    from .blueprints.main import main_bp
    from .api import api_bp
    
    app.register_blueprint(main_bp, url_prefix='/')
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app
    