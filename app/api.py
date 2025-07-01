from flask import Blueprint, abort, jsonify, request
from app.models import Todo
from app.schemas import TodoSchema
from app import db, socketio

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
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    
    paginated_todos = Todo.query.order_by(Todo.date.desc()).paginate(page=page, per_page=per_page)

    return jsonify({
        "todos": todos_schema.dump(paginated_todos.items),
        "page": paginated_todos.page,
        "per_page":paginated_todos.per_page,
        "total":paginated_todos.total,
        "pages":paginated_todos.pages
    })

@api_bp.route('/todos/<int:uid>', methods=['GET'])
def get_todo(uid):
    todo = get_todo_or_abort(uid)
    return jsonify(todo_schema.dump(todo))


@api_bp.route('/todos', methods=['POST'])
def create_todo():
    if not request.is_json:
        return jsonify({"error": "Request content-type must be application/json"}), 400

    data = request.get_json()
    if not data:
        return jsonify({"error":"No data provided"}),400
    
    errors = todo_schema.validate(data)
    if errors:
        return jsonify({
            "error": "Validation failed",
            "details": errors
        }), 400
    
    new_todo = Todo(**data)
    db.session.add(new_todo)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":f"Database error: {e}"}),500

    return jsonify(todo_schema.dump(new_todo)), 201

@api_bp.route('/todos/<int:uid>', methods=['PATCH'])
def update_todo(uid):
    todo = get_todo_or_abort(uid)
    
    data = request.get_json()
    if not data:
        return jsonify({"error":"No data provided"}),400
    errors = todo_schema.validate(data, partial=True)
    
    if errors:
        return jsonify({
            "error": "Validation failed",
            "details": errors
        }), 400
    
    for key, value in data.items():
        setattr(todo, key, value)
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":f"Database error: {e}"}),500

    return jsonify(todo_schema.dump(todo))

# Specialised endpoint for status toggle
@api_bp.route('/todos/<int:uid>/toggle', methods=['PATCH'])
def toggle_status(uid):
    todo = get_todo_or_abort(uid)
    
    todo.status = not todo.status
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":f"Database error: {e}"}),500

    socketio.emit('todo_update', {'action':'updated'})
    return jsonify(todo_schema.dump(todo)), 200

@api_bp.route('/todos/<int:uid>', methods=['DELETE'])
def delete_todo(uid):
    todo = get_todo_or_abort(uid)
    
    db.session.delete(todo)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":f"Database error: {e}"}),500

    return jsonify({"success": True, "uid": uid}), 200
