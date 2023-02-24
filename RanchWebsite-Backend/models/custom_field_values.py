from flask import jsonify
import flask
from db import db
import uuid
from sqlalchemy.dialects.postgresql import UUID
import marshmallow as ma

class CustomFieldValues(db.Model):
    obj_type = db.Column(db.String(), primary_key=True)
    obj_id = db.Column(UUID(as_uuid=True), primary_key=True)
    custom_field_id = db.Column(UUID(as_uuid=True), db.ForeignKey("CustomFields.custom_field_id"), nullable=False)
    org_id = db.Column(UUID(as_uuid=True), db.ForeignKey("Organizations.org_id"), nullable=False)
    value = db.Column(UUID(as_uuid=True), db.String())

    def __init__(self, obj_type, obj_id, custom_field_id, org_id, value):
        self.obj_type = obj_type
        self.obj_id = obj_id
        self.custom_field_id = custom_field_id
        self.org_id = org_id
        self.value = value

class CustomFieldValuesSchema(ma.Schema):
    class Meta:
        fields = ["obj_type","obj_id","custom_field_id","org_id","value"]

custom_field_value_schema = CustomFieldValuesSchema()
custom_field_values_schema = CustomFieldValuesSchema(many=True)