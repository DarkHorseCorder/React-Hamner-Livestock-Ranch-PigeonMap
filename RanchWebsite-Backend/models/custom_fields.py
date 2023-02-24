from flask import jsonify
import flask
from db import db
import uuid
from sqlalchemy.dialects.postgresql import UUID
import marshmallow as ma

class CustomFields(db.Model):
    __tablename__ = "CustomFields"
    custom_field_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4())
    org_id = db.Column(UUID(as_uuid=True), db.ForeignKey("Originzations.org_id"), nullable=False)
    name = db.Column(db.String(), nullable=False)
    field_type = db.Column(db.String(), nullable=False)
    values = db.Column(db.String(), nullable=False)

    def __init__(self, custom_field_id, org_id, name, field_type, values):
        self.custom_field_id = custom_field_id
        self.org_id = org_id
        self.name = name
        self.field_type = field_type
        self.values = values

class CustomFieldsSchema(ma.Schema):
    class Meta:
        fields = ["custom_field_id","org_id","name","field_type","values"]

custom_field_schema = CustomFieldsSchema()
custom_fields_schema = CustomFieldsSchema(many=True)