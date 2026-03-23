from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..config.database import db
from ..models.models import User

bp = Blueprint('users', __name__)

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({'success': True, 'data': {'id': user.id, 'email': user.email, 'name': user.name}})

@bp.route('/me', methods=['PUT'])
@jwt_required()
def update_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.json
    if 'name' in data:
        user.name = data['name']
    db.session.commit()
    return jsonify({'success': True, 'message': 'User updated'})
