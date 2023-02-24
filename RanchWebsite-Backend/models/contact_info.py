from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from db import db
import marshmallow as ma
from models.app_users import AppUsers

class ContactInfo(db.Model):
    __tablename__= 'ContactInfo'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('AppUsers.user_id', ondelete='CASCADE'))
    contact_type = db.Column(db.String())
    contact_value= db.Column(db.String())

    def __init__(self, user_id, contact_type, contact_values):
        self.user_id = user_id
        self.contact_type = contact_type
        self.contact_value = contact_values

class ContactInfoSchema(ma.Schema):
    class Meta:
        fields = ['user_id','contact_type','contact_value']
    
contact_info_schema = ContactInfoSchema()
contacts_schema = ContactInfoSchema(many=True)