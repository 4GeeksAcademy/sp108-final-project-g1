"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Bookings, Huts, Hut_favorites, Huts_album, Location, Review
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_bcrypt import Bcrypt


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API
bcrypt = Bcrypt()


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    email = data.get("email", None).lower()
    password = request.json.get("password", None)
    # Buscar el email y el password en la BBDD y verificar si is_active es True.
    user = db.session.execute(db.select(Users).where(Users.email == email,
                                                     Users.is_active == True)).scalar()                                                   
    if not user:
        response_body['message'] = 'Bad email'
        return response_body, 401
    # Ahora comparar la password de la linea 30 con el user.password que tiene la password hasheada
    if not bcrypt.check_password_hash(user.password, password):
        response_body['message'] = 'Bad password'
        return response_body, 401
    claims = {'user_id': user.serialize()['id'],
              'is_admin': user.serialize()['is_admin']}
    print(claims)
    access_token = create_access_token(
        identity=email, additional_claims=claims)
    response_body['message'] = 'User logged OK'
    response_body['access_token'] = access_token
    return response_body, 200




@api.route('/users', methods=['GET', 'POST'])
def get_users():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = "RECIBIDO"
        rows = db.session.execute(
            db.select(Users).where(Users.is_active)).scalars()
        response_body['result'] = [row.serialize()
                                for row in rows]
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        password = data.get('password', None)
        if password == None:
            response_body['message'] = 'Falta Password'
            response_body['result'] = {}
            return response_body,403
        user = Users()
        user.password = bcrypt.generate_password_hash(password).decode("utf-8")
        user.first_name = data.get('first_name', None)
        user.last_name = data.get('last_name', None)
        user.email = data.get('email', 'user@email.com').lower()
        user.phone_number = data.get('phone_number', None)
        user.is_active = True
        user.is_admin = data.get('is_admin', False)
        db.session.add(user)
        db.session.commit()
        response_body['results'] = user.serialize()
        response_body['message'] = 'Respuesta del POST de Users'
    return response_body, 201


@api.route('/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()   
def user(id):
    response_body = {}
    claims = get_jwt()
    user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
    if not user:
        response_body['message'] = f'Usuario {id} no encontrado'
        response_body['result'] = {}
        return response_body, 403
    if request.method == 'GET':
        response_body['message'] = f'Usuario {id} encontrado'
        response_body['result'] = user.serialize()
        return response_body, 200
    if request.method == 'PUT':
        if claims['user_id'] != id:
            response_body['message'] = f' El usuario {claims['user_id']} no tiene permiso para modificar los datos de {id}'
        data = request.json
        user.password = data.get('password', user.password)
        user.email = data.get('email', user.email)
        user.is_admin = data.get('is_admin', user.is_admin)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        db.session.commit()
        response_body['message'] = f'Usuario {id} modificado'
        response_body['results'] = user.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        user.is_active = False
        db.session.commit()
        response_body['message'] = f'Usuario {id} eliminado'
        response_body['results'] = None
        return response_body, 200
    
   
@api.route('/huts', methods=['GET'])
@jwt_required()
def get_huts():
    response_body = {}
    response_body['message'] = "Las cabañas se han cargado correctamente."
    rows = db.session.execute(db.select(Huts)).scalars()
    response_body['results'] = [row.serialize() for row in rows]
    return response_body, 200


@api.route('/huts', methods=['POST'])
@jwt_required() 
def post_huts():
    claims = get_jwt()
    response_body = {}
    if not claims.get('is_admin', False):
        response_body['message'] = 'El usuario no tiene permiso para añadir cabañas.'
        return response_body, 403
    data = request.json
    response_body = {}
    hut = Huts()
    hut.name = data.get('name', hut.name)
    hut.description = data.get('description', hut.description)
    hut.capacity = data.get('capacity', hut.capacity)
    hut.bedrooms = data.get('bedrooms', hut.bedrooms)
    hut.bathroom = data.get('bathroom', hut.bathroom)
    hut.price_per_night = data.get('price_per_night', hut.price_per_night)
    hut.location_id = data.get('location_id', hut.location_id)
    hut.is_active = data.get('is_active', hut.is_active)
    db.session.add(hut)
    db.session.commit()
    response_body['message'] = 'La cabaña se ha añadido correctamente.'
    response_body['results'] = hut.serialize()
    return response_body, 201


@api.route('/huts/<int:id>', methods=['PUT'])
@jwt_required()
def put_huts(id):
    response_body = {}
    data = request.json
    claims = get_jwt()
    if not claims.get('is_admin', False):
        response_body['message'] = "Se necesita permiso del administrador."
        return response_body, 403
    hut = db.session.get(Huts, id)
    if not hut:
        response_body['message'] = "Cabaña no encontrada."
        return response_body, 404
    if 'name' in data and data['name'] != hut.name:
        existing_name = db.session.execute(db.select(Huts).where(Huts.name == data['name'])).scalar()
        if existing_name:
            response_body['message'] = "El nombre ya existe."
            return response_body, 409
    hut.name = data.get('name', hut.name)
    hut.description = data.get('description', hut.description)
    hut.capacity = data.get('capacity', hut.capacity)
    hut.bedrooms = data.get('bedrooms', hut.bedrooms)
    hut.bathroom = data.get('bathroom', hut.bathroom)
    hut.price_per_night = data.get('price_per_night', hut.price_per_night)
    hut.location_id = data.get('location_id', hut.location_id)
    hut.is_active = data.get('is_active', hut.is_active)
    db.session.commit()
    response_body['message'] = 'Los datos de la cabaña se han actualizado correctamente.'
    response_body['results'] = hut.serialize()
    return response_body, 200


@api.route('/huts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_hut(id):
    response_body = {}
    claims = get_jwt()
    if not claims.get('is_admin', False):
        response_body['message'] = 'Se requiere permiso de administrador'
        return response_body, 403
    hut = db.session.get(Huts, id)
    if not hut:
        response_body['message'] = f'La cabaña con ID {id} no existe.'
        return response_body, 404
    db.session.execute(db.delete(Huts_album).where(Huts_album.hut_id == id))
    db.session.delete(hut)
    db.session.commit()
    response_body['message'] = f'La cabaña {hut.name} se ha eliminado correctamente.'
    return response_body, 200


@api.route('/huts_album', methods=['GET'])
@jwt_required()
def get_huts_album():
    response_body = {}
    response_body['message'] = "Las fotografías de las cabañas se han cargado satisfactoriamente."
    rows = db.session.execute(db.select(Huts_album)).scalars()
    response_body['results'] = [row.serialize() for row in rows]
    return response_body, 200


@api.route('/huts_album/<int:id>', methods=['GET'])
@jwt_required()
def get_current_hut_album(id):
    response_body = {}
    if not db.session.get(Huts, id):
        response_body['message'] = "La cabaña no existe."
        return response_body, 404
    response_body['message'] = "Las fotografías de las cabañas se han cargado satisfactoriamente."
    rows = db.session.execute(db.select(Huts_album).where(Huts_album.hut_id == id)).scalars()
    response_body['results'] = [row.serialize() for row in rows]
    return response_body, 200


@api.route('/huts_album', methods=['POST'])
@jwt_required()
def post_huts_album():
    response_body = {}
    data = request.json
    hut_id = data.get('hut_id')
    valid_types = ["bedroom", "bathroom", "living_room", "kitchen", "other_picture"]
    claims = get_jwt()
    if not claims.get('is_admin', False):
        response_body['message'] = "El usuario no tiene permiso para añadir fotografías."
        return response_body, 403
    if not hut_id:
        return {"message": "Se requiere hut_id"}, 400
    if 'type' in data and data['type'] not in valid_types:
        response_body['message'] = "Tipo no válido."
        return response_body, 400
    if not db.session.get(Huts, hut_id):
        return {"message": "La cabaña no existe"}, 404
    hut_album = Huts_album(
        hut_id=hut_id,
        type=data.get('type'),
        image_url=data['image_url']
    )
    db.session.add(hut_album)
    db.session.commit()
    response_body['message'] = "Las fotografías se han añadido satisfactoriamente."
    response_body['results'] = hut_album.serialize()
    return response_body, 201