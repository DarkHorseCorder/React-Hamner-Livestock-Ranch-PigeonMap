from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid

from db import db
import marshmallow as ma

# from models.registration import Registrations, RegistrationsSchema, registrations_schema, registration_schema
# from models.pasture import Pastures, PasturesSchema, pasture_schema, pastures_schema



class Meat(db.Model):
    __tablename__= "Meat"
    meat_id = db.Column(db.Integer(), primary_key=True)
    carcass_date_processed = db.Column(db.String())
    lambchops = db.Column(db.String())
    burgers = db.Column(db.String()) 
    date_processed = db.Column(db.String())
    process_cost = db.Column(db.String())
    price_per_package = db.Column(db.String())
    price_per_carcass = db.Column(db.String())
   
    active = db.Column(db.Boolean(), nullable=False, default=True)

    flocks = db.relationship('Sheeps', back_populates='carcass_name')
    
    def __init__(self, meat_id, carcass_date_processed, lambchops, burgers, process_cost, date_processed, price_per_package, price_per_carcass, active):
        self.meat_id = meat_id
        self.carcass_date_processed = carcass_date_processed
        self.lambchops = lambchops
        self.burgers = burgers  
        self.process_cost = process_cost
        self.date_processed = date_processed
        self.price_per_package = price_per_package
        self.price_per_carcass = price_per_carcass
       
        self.active = active
   

class MeatSchema(ma.Schema):
   
    class Meta:
        fields = ['meat_id', 'carcass_date_processed', 'lambchops', 'burgers', 'process_cost', 'date_processed', 'price_per_package', 'price_per_carcass', 'active', 'flocks']
    flocks = ma.fields.Nested('SheepsSchema', only=['ear_tag_id'], many=True)
  
meat_schema = MeatSchema()
meats_schema = MeatSchema(many=True)