from flask import Blueprint, abort, jsonify, request
from app.models import Todo
from app.schemas import TodoSchema
from app import db

todo_schema = TodoSchema()
todos_schema = TodoSchema(many=True)

api_bp = Blueprint('api', __name__)

def get_todo_or_abort(uid):
    todo = Todo.query.get(uid)
    if not todo:
        abort(404, description="Item not found")
    return todo
 
@api_bp.route('/ping')
def ping():
    return jsonify({"message":"API running"}), 200

@api_bp.route('/todos', methods=['GET'])
def get_all_todos():
    todos = Todo.query.all()
    return jsonify(todos_schema.dump(todos))


@api_bp.route('/todos/<int:uid>', methods=['GET'])
def get_todo(uid):
    todo = get_todo_or_abort(uid)
    return jsonify(todo_schema.dump(todo))


@api_bp.route('/todos', methods=['POST'])
def create_todo():
    data = request.get_json()
    
    errors = todo_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    
    new_todo = Todo(**data)
    db.session.add(new_todo)
    db.session.commit()
    
    return jsonify(todo_schema.dump(new_todo)), 201

@api_bp.route('/todos/<int:uid>', methods=['PATCH'])
def update_todo(uid):
    todo = get_todo_or_abort(uid)
    
    data = request.get_json()
    errors = todo_schema.validate(data, partial=True)
    
    if errors:
        return jsonify(errors), 400
    
    for key, value in data.items():
        setattr(todo, key, value)
    
    db.session.commit()
    
    return jsonify(todo_schema.dump(todo))

# Specialised endpoint for status toggle
@api_bp.route('/todos/<int:uid>/toggle', methods=['PATCH'])
def toggle_status(uid):
    todo = get_todo_or_abort(uid)
    
    todo.status = not todo.status
    db.session.commit()
    
    return jsonify(todo_schema.dump(todo)), 200

@api_bp.route('/todos/<int:uid>', methods=['DELETE'])
def delete_todo(uid):
    todo = get_todo_or_abort(uid)
    
    db.session.delete(todo)
    db.session.commit()
    
    return jsonify({"message":f"Item uid: {uid} deleted"})