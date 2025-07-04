from app.models import Todo
from app.extensions import ma
from marshmallow_sqlalchemy import auto_field
from marshmallow import fields, validate

class TodoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Todo
        load_instance = True
    
    uid = auto_field()
    title = auto_field(validate=validate.Length(min=1))
    content = auto_field(validate=validate.Length(min=1))
    status = auto_field()
    date = fields.DateTime(format="%Y-%m-%d %H:%M")