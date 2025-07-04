from app.models import Todo
from app.extensions import ma
from marshmallow_sqlalchemy import auto_field
from marshmallow import fields

class TodoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Todo
        load_instance = True
    
    uid = auto_field()
    title = auto_field()
    content = auto_field()
    status = auto_field()
    date = fields.DateTime(format="%Y-%m-%d %H:%M")