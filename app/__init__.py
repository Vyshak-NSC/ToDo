from flask import Flask, jsonify
from dotenv import load_dotenv
from app.extensions import db, migrate, ma, socketio
from flask_cors import CORS

load_dotenv()
from app.models import *

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    db.init_app(app)
    ma.init_app(app)
    socketio.init_app(app, cors_allowed_origins='*')
    migrate.init_app(app, db)
    CORS(app)
    
    with app.app_context():
        db.create_all()
        
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error":e.description or "Resource not found"})
        
    from .blueprints.main import main_bp
    from .api import api_bp
    
    app.register_blueprint(main_bp, url_prefix='/')
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app
    