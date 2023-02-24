from flask import jsonify
import flask
from db import db
import uuid
from sqlalchemy.dialects.postgresql import UUID
import marshmallow as ma

class ObjectsCustomFields(db.Models):
    obj_type = db.Column(db.String(), primary_key=True)
    org_id = db.Column(UUID(as_uuid=True), db.ForeignKey("Organizations.org_id"), primary_key=True)
    custom_field_id = db.Column(UUID(as_uuid=True), db.ForeignKey("CustomFields.custom_field_id"), primary_key=True)
    is_required = db.Column(db.Integer, nullable=False)

    def __init__(self, obj_type, org_id, custom_field_id, is_required):
        self.obj_type = obj_type
        self.org_id = org_id
        self.custom_field_id = custom_field_id
        self.is_required = is_required

class ObjectsCustomFieldsSchema(ma.Schema):
    class Meta:
        fields = ["obj_type","org_id","custom_field_id","is_required"]

objects_custom_field_schema = ObjectsCustomFieldsSchema()
objects_custom_fields_schema = ObjectsCustomFieldsSchema(many=True)
