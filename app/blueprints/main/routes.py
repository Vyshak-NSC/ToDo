from . import main_bp
from flask import render_template
from app import limiter

@main_bp.route('/')
@limiter.limit("5 per minute")
def index():
    return render_template('index.html')