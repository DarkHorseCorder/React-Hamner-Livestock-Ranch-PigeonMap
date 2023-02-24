from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from db import db
import marshmallow as ma
from .organizations import OrganizationsSchema

class AppUsers(db.Model):
    __tablename__= "AppUsers"
    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    first_name = db.Column(db.String(), nullable = False)
    last_name = db.Column(db.String(), nullable = False)
    email = db.Column(db.String(), nullable = False, unique = True)
    phone = db.Column(db.String())
    password = db.Column(db.String(), nullable = False)
    active = db.Column(db.Boolean(), nullable=False, default=False)
    org_id = db.Column(UUID(as_uuid=True), db.ForeignKey('Organizations.org_id'), nullable=False)
    organization = db.relationship('Organizations', backref=db.backref('AppUsers', lazy=True))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(db.String(), default='user', nullable=False)
    auth = db.relationship('AuthTokens', backref = 'user')

    def __init__(self, first_name, last_name, email, password, phone, org_id, role, active):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.phone = phone
        self.org_id = org_id
        self.role = role
        self.active = active
   
   
class AppUsersSchema(ma.Schema):
    class Meta:
        fields = ['user_id','first_name', 'last_name', 'email', 'password', 'phone', 'created_date', 'org_id', 'organization', 'role', 'active']
    organization = ma.fields.Nested(OrganizationsSchema(only=("org_id", "name","active")))
    
user_schema = AppUsersSchema()
users_schema = AppUsersSchema(many=True)