from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid
from db import db
import marshmallow as ma

class PicReferences(db.Model):
    __tablename__ = 'PicRefrences'
    pic_id = db.Column(UUID(as_uuid=True), primary_key=True, unique=True, nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('AppUsers.user_id'), nullable=False)
    original_name = db.Column(db.String(), nullable = False)
    ext = db.Column(db.String(), nullable = False)

    def __init__(self, pic_id, user_id, original_name, ext):
        self.pic_id = pic_id
        self.user_id = user_id
        self.original_name = original_name
        self.ext = ext
   
class PicReferencesSchema(ma.Schema):
    class Meta:
        fields = ['pic_id', 'user_id', 'original_name', 'ext']
    
pic_schema = PicReferencesSchema()
pics_schema = PicReferencesSchema(many=True)