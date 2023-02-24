from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid
from db import db
import marshmallow as ma

class Pastures(db.Model):
    __tablename__= "Pastures"
    pasture_id = db.Column(db.Integer(), primary_key=True, nullable=False, default=True)
    pasture_name = db.Column(db.String())
    description = db.Column(db.String())
    date_moved_into_pasture = db.Column(db.String())
    date_moved_out_of_pasture = db.Column(db.String())

    active = db.Column(db.Boolean(), nullable=False, default=True)

    flocks = db.relationship('Sheeps', back_populates='area_name')


    def __init__(self, pasture_id, pasture_name, description, date_moved_into_pasture, date_moved_out_of_pasture, active):
        self.pasture_id = pasture_id
     
        self.pasture_name = pasture_name
        self.description = description
        self.date_moved_into_pasture = date_moved_into_pasture
        self.date_moved_out_of_pasture = date_moved_out_of_pasture

        self.active = active

class PasturesSchema(ma.Schema):

    class Meta:
        fields = ['pasture_id', 'pasture_name', 'description','date_moved_into_pasture', 'date_moved_out_of_pasture', 'active', 'flocks']
    flocks = ma.fields.Nested('SheepsSchema', only=['ear_tag_id'], many=True)
    #need the many=true for the eartag to show up on the pasture page. 
 
pasture_schema = PasturesSchema()
pastures_schema = PasturesSchema(many=True)

