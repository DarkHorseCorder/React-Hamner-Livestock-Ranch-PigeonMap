from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid
from db import db
import marshmallow as ma
from .app_users import AppUsersSchema

class PWResetTokens(db.Model):
    __tablename__= 'PWResetTokens'
    token = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('AppUsers.user_id'), nullable=False)
    expiration = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, expiration, token):
        self.user_id = user_id
        self.expiration = expiration
        self.token = token

class PWResetTokenSchema(ma.Schema):
    class Meta:
        fields = ['token', 'user_id', 'expiration']

pw_reset_token_schema = PWResetTokenSchema()