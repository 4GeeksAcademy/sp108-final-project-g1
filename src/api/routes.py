"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from datetime import datetime
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Bookings, Huts, HutFavorites, HutAlbum, Location, Review
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
    access_token = create_access_token(
        identity=email, additional_claims=claims)
    response_body['message'] = 'User logged OK'
    response_body['access_token'] = access_token
    return response_body, 200


@api.route('/register', methods=['POST'])
def register():
    response_body = {}
    data = request.json
    user=Users()
    user.email = data.get('email', None).lower()
    user.password = data.get('password', None)
    if user.password == None:
        response_body['message'] = 'Falta Password'
        response_body['result'] = {}
        return response_body, 403
    if user.email == None:
        response_body['message'] = 'Falta Email'
        response_body['result'] = {}
        return response_body, 403
    user.password = bcrypt.generate_password_hash(user.password).decode("utf-8")
    user.is_active = True
    user.is_admin = data.get('is_admin', False)
    db.session.add(user)
    db.session.commit()
    claims = {'user_id': user.serialize()['id'],
              'is_admin': user.serialize()['is_admin']}
    access_token = create_access_token(
        identity=user.email, additional_claims=claims)
    response_body['access_token'] = access_token

    response_body['results'] = user.serialize()
    response_body['message'] = 'Usuario registrado'
    return response_body, 201
    

@api.route('/users', methods=['GET'])
def users():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = "RECIBIDO"
        rows = db.session.execute(
            db.select(Users).where(Users.is_active)).scalars()
        response_body['results'] = [row.serialize()
                                   for row in rows]
        return response_body, 200

    
@api.route('/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def user(id):
    response_body = {}
    claims = get_jwt()
    user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
    if not user:
        response_body['message'] = f'Usuario {id} no encontrado'
        response_body['results'] = {}
        return response_body, 403
    if request.method == 'GET':
        response_body['message'] = f'Usuario {id} encontrado'
        response_body['results'] = user.serialize()
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
        user.phone_number = data.get('phone_number', None)
        db.session.commit()
        response_body['message'] = f'Usuario {id} modificado'
        response_body['results'] = user.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        if claims['user_id'] != id:
            response_body['message'] = f'El usuario{claims['user_id']} no tiene permiso a cancelar el {id}'
        user.is_active = False
        db.session.commit()
        response_body['message'] = f'Usuario {id} eliminado'
        response_body['results'] = None
        return response_body, 200
    


@api.route('/bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    response_body = {}
    claims = get_jwt()
    user_id = claims['user_id']
    is_admin = claims.get('is_admin', False)
    if is_admin:
        bookings = Bookings.query.all()
    else:
        bookings = Bookings.query.filter_by(user_id=user_id, status_reserved='active').all() 

    response_body['message'] = 'Lista de reservas'
    response_body['results'] = [booking.serialize() for booking in bookings]
    return response_body, 200


@api.route('/bookings', methods=['POST'])
@jwt_required()
def post_bookings():
    response_body = {}
    claims = get_jwt()
    user_id = claims['user_id']
    data = request.json
    booking = Bookings()
    booking.start_date = data.get('start_date', None)
    booking.end_date = data.get('end_date', None)
    booking.hut_id = data.get('hut_id')
    overlapping_booking = Bookings.query.filter(
        Bookings.hut_id == booking.hut_id,
        Bookings.status_reserved == 'active',
        Bookings.start_date <= booking.end_date,
        Bookings.end_date >= booking.start_date
    ).first()
    if overlapping_booking:
        return "La cabaña ya esta ocupada", 409
    if data['start_date'] >= data['end_date']:
        response_body['message'] = 'La fecha de fin debe ser posterior a la de inicio'
        return response_body, 400
    hut = db.session.get(Huts, data['hut_id'])
    if not hut:
        response_body['message'] = 'Cabaña no encontrada'
        return response_body, 404
    booking.user_id = user_id
    booking.hut_id = data.get('hut_id')
    booking.start_date = data.get('start_date', None)
    booking.end_date = data.get('end_date', None)
    booking.total_price = data.get('total_price', None)
    booking.status_reserved = data.get('status_reserved', 'active')
    booking.guests = data.get('guests', None)
    booking.special_requests = data.get('special_requests', None)
    booking.created_at = data.get('created_at', None)
    booking.payment_date = data.get('payment_date', None)
    booking.transaction_payment = data.get('transation_payment', 'Card')
    booking.status_payment = data.get('status_payment', True)
    db.session.add(booking)
    db.session.commit()
    response_body['message'] = 'Respuesta del post de Bookings'
    response_body['results'] = booking.serialize()
    return response_body, 201


@api.route('/bookings/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_bookings(id):
    response_body = {}
    claims = get_jwt()
    user_id = claims['user_id']
    is_admin = claims['is_admin']
    booking = Bookings.query.get(id)
    if not booking:
        response_body['message'] = 'La reserva no se ha encontrado'
        return response_body, 403
    if user_id != booking.user_id and not is_admin:
        response_body['message'] = 'Usuario no autorizado'
        return response_body, 409
    booking.status_reserved = 'cancelled'
    db.session.commit()
    response_body['message'] = 'Reserva cancelada exitosamente'
    response_body['results'] = booking.serialize()
    return response_body, 200

    
@api.route('/hut-favorites', methods=['GET'])
@jwt_required()
def get_hut_favorites():
    response_body = {}
    claims = get_jwt()
    user_id = claims['user_id']
    hut_favorites = HutFavorites.query.filter_by(user_id = user_id).all()
    response_body['message'] = 'Lista de favoritos'
    response_body['results'] = [hut_favorite.serialize() for hut_favorite in hut_favorites]
    return response_body, 200


@api.route('/hut-favorites', methods=['POST'])
@jwt_required()
def get_huts_favorites():
    response_body = {}
    claims = get_jwt()
    user_id = claims['user_id']
    data = request.json
    hut_id = data.get('hut_id')
    hut = db.session.execute(db.select(Huts).where(Huts.id == hut_id)).scalar()
    if not hut:
        response_body['message'] = f'La cabaña con ID {hut_id} no existe'
        return response_body, 404
    existing_favorite = db.session.execute(db.select(HutFavorites).where(
            (HutFavorites.user_id == user_id) & 
            (HutFavorites.hut_id == hut_id))).scalar()
    if existing_favorite:
        response_body['message'] = 'Esta cabaña ya está en tus favoritos'
        return response_body, 409
    hut_favorites = HutFavorites()
    hut_favorites.hut_id = data.get('hut_id', None)
    hut_favorites.user_id = user_id
    db.session.add(hut_favorites)
    db.session.commit()
    response_body['message'] = 'Añadido en favoritos'
    response_body['results'] = hut_favorites.serialize()
    return response_body, 200


@api.route('/hut-favorites/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_hut_favorite(id):
    response_body = {}
    claims = get_jwt()
    hut_favorite = db.session.execute(db.select(HutFavorites).where(HutFavorites.id == id)).scalar()
    if not hut_favorite:
        response_body['message'] = f'El favorito con id {id} no existe'
        return response_body, 404
    if hut_favorite.user_id != claims['user_id']:
        response_body['message'] = 'No tienes permiso para eliminar este favorito'
        return response_body, 403
    
    db.session.delete(hut_favorite)
    db.session.commit()
    response_body['message'] = f'El usuario {claims['user_id']} ha eliminado Cabaña {id} de favoritos'
    return response_body, 200


@api.route('/huts', methods=['GET'])
def get_huts():
    response_body = {}
    response_body['message'] = "Las cabañas se han cargado correctamente."
    rows = db.session.execute(db.select(Huts)).scalars()
    response_body['results'] = [row.serialize() for row in rows]
    return response_body, 200








