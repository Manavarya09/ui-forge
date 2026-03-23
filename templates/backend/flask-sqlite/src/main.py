from flask import Flask
from flask_cors import CORS
from .config.database import init_db, db
from .routes import auth, posts, users
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydb.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'your-jwt-secret')

CORS(app)
init_db(app)

@app.route('/health')
def health():
    from datetime import datetime
    return {'status': 'ok', 'timestamp': datetime.now().isoformat()}

app.register_blueprint(auth.bp, url_prefix='/api/auth')
app.register_blueprint(posts.bp, url_prefix='/api/posts')
app.register_blueprint(users.bp, url_prefix='/api/users')
