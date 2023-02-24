from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid

from db import db
import marshmallow as ma

# from models.registration import Registrations, RegistrationsSchema, registrations_schema, registration_schema
# from models.pasture import Pastures, PasturesSchema, pasture_schema, pastures_schema



class Wool(db.Model):
    __tablename__= "Wool"
    wool_id = db.Column(db.Integer(), primary_key=True)
    staple_length = db.Column(db.String())
    micron = db.Column(db.String(), nullable = False, unique = True)
    fleece_color = db.Column(db.String()) 
    weight = db.Column(db.String())
    shear_date = db.Column(db.String())
    shear_cost = db.Column(db.String())
    fleece_price = db.Column(db.String())
    sold = db.Column(db.Boolean())
    active = db.Column(db.Boolean(), nullable=False, default=True)

    flocks = db.relationship('Sheeps', back_populates='fleece_name')
    # pasture_id = db.Column(db.ForeignKey('Pastures.pasture_id'), nullable=True)
    # area_name = db.relationship('Pastures', back_populates='flocks')
    
    def __init__(self, wool_id, staple_length, micron, fleece_color, shear_date, weight, shear_cost, fleece_price, sold, active):
        self.wool_id = wool_id
        self.staple_length = staple_length
        self.micron = micron
        self.fleece_color = fleece_color  
        self.shear_date = shear_date
        self.weight = weight
        self.shear_cost = shear_cost
        self.fleece_price = fleece_price
        self.sold = sold
       
        self.active = active
   

class WoolSchema(ma.Schema):
   
    class Meta:
        fields = ['wool_id', 'staple_length', 'micron', 'fleece_color', 'shear_date', 'weight', 'shear_cost', 'fleece_price', 'sold', 'active', 'flocks']
    flocks = ma.fields.Nested('SheepsSchema', only=['ear_tag_id'], many=True)
  
wool_schema = WoolSchema()
wools_schema = WoolSchema(many=True)