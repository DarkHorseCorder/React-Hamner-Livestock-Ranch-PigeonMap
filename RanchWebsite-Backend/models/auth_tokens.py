from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from db import db
import marshmallow as ma
from .app_users import AppUsersSchema

class AuthTokens(db.Model):
    __tablename__='AuthTokens'
    auth_token = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('AppUsers.user_id'), nullable=False)
    expiration = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, expiration):
        self.user_id = user_id
        self.expiration = expiration

class AuthTokensSchema(ma.Schema):
    class Meta:
        fields = ['auth_token', 'user', 'expiration']
    user = ma.fields.Nested(AppUsersSchema(only=("role", "first_name", "user_id", "org_id")))

auth_token_schema = AuthTokensSchema()

