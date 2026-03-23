from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..config.database import db
from ..models.models import Post

bp = Blueprint('posts', __name__)

@bp.route('/', methods=['GET'])
@jwt_required()
def get_posts():
    user_id = get_jwt_identity()
    posts = Post.query.filter_by(user_id=user_id).all()
    return jsonify({'success': True, 'data': [{'id': p.id, 'title': p.title, 'content': p.content, 'published': p.published} for p in posts]})

@bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.json
    post = Post(title=data['title'], content=data.get('content'), published=data.get('published', False), user_id=user_id)
    db.session.add(post)
    db.session.commit()
    return jsonify({'success': True, 'data': {'id': post.id, 'title': post.title}}), 201

@bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.filter_by(id=post_id, user_id=user_id).first()
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    data = request.json
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    post.published = data.get('published', post.published)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Post updated'})

@bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.filter_by(id=post_id, user_id=user_id).first()
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    db.session.delete(post)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Post deleted'})
