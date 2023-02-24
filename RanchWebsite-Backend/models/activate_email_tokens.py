from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timedelta
from db import db
import marshmallow as ma

class ActivateEmailTokens(db.Model):
    __tablename__ = "ActivateEmailTokens"
    token = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4())
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('AppUsers.user_id'))
    expiration = db.Column(db.DateTime, default= (datetime.utcnow() + timedelta(days=1)))

    def __init__(self,user_id):
        self.user_id = user_id

class ActivateEmailTokensSchema(ma.Schema):
    class Meta:
        fields = ['token', 'user_id', 'expiration']

auth_token_schema = ActivateEmailTokensSchema()