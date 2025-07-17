"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Huts

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

host = 'https://friendly-guide-g4v6q796wprf9q67-3001.app.github.dev/admin/'


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


@api.route('/huts', methods=['GET'])
def get_huts():
    response_body = {}
    response_body['message'] = "Las cabañas se han cargado correctamente."
    rows = db.session.execute(db.select(Huts)).scalars()
    response_body['result'] = [rows.serialize() for row in rows]
    return response_body, 200


@api.route('/huts/<int:huts.id>', methods=['POST'])
def post_huts():
    pass
    