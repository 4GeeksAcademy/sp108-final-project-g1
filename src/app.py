"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from api.utils import APIException
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
import cloudinary
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración CORS exhaustiva - Versión mejorada
cors = CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://crispy-parakeet-wrxrxxg9jp9gc995x-3000.app.github.dev",
            "https://crispy-parakeet-wrxrxxg9jp9gc995x-3001.app.github.dev"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
        "supports_credentials": True,
        "expose_headers": ["Authorization", "Content-Type"],
        "max_age": 86400  # Aumentado a 24 horas
    }
})

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        # Headers adicionales para CORS
        origin = request.headers.get('Origin')
        if origin in [
            "https://crispy-parakeet-wrxrxxg9jp9gc995x-3000.app.github.dev",
            "https://crispy-parakeet-wrxrxxg9jp9gc995x-3001.app.github.dev"
        ]:
            response.headers.add("Access-Control-Allow-Origin", origin)
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Max-Age", "86400")
        return response

@app.after_request
def add_cors_headers(response):
    # Asegurar que los headers CORS estén en todas las respuestas
    origin = request.headers.get('Origin')
    if origin in [
        "https://crispy-parakeet-wrxrxxg9jp9gc995x-3000.app.github.dev",
        "https://crispy-parakeet-wrxrxxg9jp9gc995x-3001.app.github.dev"
    ]:
        response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Expose-Headers', 'Authorization, Content-Type')
    return response

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Other configuration
setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix='/api')

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

cloudinary.config(
    cloud_name=os.getenv('VITE_CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('VITE_CLOUDINARY_API_KEY'),
    api_secret=os.getenv('VITE_CLOUDINARY_API_SECRET'),
    secure=True
)

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)