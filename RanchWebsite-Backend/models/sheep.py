from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid

from db import db
import marshmallow as ma

from models.registration import Registrations, RegistrationsSchema, registrations_schema, registration_schema
from models.pasture import Pastures, PasturesSchema, pasture_schema, pastures_schema
from models.meat import Meat, MeatSchema, meat_schema, meats_schema
from models.wool import Wool, WoolSchema, wool_schema, wools_schema
from models.lambs import Lambs, LambsSchema, lamb_schema, lambs_schema


class Sheeps(db.Model):
    __tablename__= "Sheeps"
    ear_tag_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), nullable = False)
    scrapie_tag = db.Column(db.String(), nullable = False, unique = True)
    sex = db.Column(db.String())
    sheep_sheep_color = db.Column(db.String())
    weight = db.Column(db.String())
    raised = db.Column(db.String())
    owner = db.Column(db.String())
    birthdate = db.Column(db.String())
    vaccines = db.Column(db.String())

 
    active = db.Column(db.Boolean(), nullable=False, default=True)

    registration_id = db.Column(db.ForeignKey('Registrations.registration_id'), nullable=True)
    registry_name = db.relationship('Registrations', back_populates='flocks')

    pasture_id = db.Column(db.ForeignKey('Pastures.pasture_id'), nullable=True)
    area_name = db.relationship('Pastures', back_populates='flocks')

    meat_id = db.Column(db.ForeignKey('Meat.meat_id'), nullable=True)
    carcass_name = db.relationship('Meat', back_populates='flocks')

    wool_id = db.Column(db.ForeignKey('Wool.wool_id'), nullable=True)
    fleece_name = db.relationship('Wool', back_populates='flocks')


    lamb_id = db.Column(db.ForeignKey('Lambs.lamb_id'), nullable=True)
    lamb_info = db.relationship('Lambs', back_populates='flocks')
    
    def __init__(self, ear_tag_id, name, scrapie_tag, sex, sheep_color, weight, raised, owner, birthdate, vaccines, active):
        self.ear_tag_id = ear_tag_id
        self.name = name
        self.scrapie_tag = scrapie_tag
        self.sex = sex
        self.sheep_color = sheep_color  
        self.weight = weight
        self.raised = raised
        self.owner = owner
        self.birthdate = birthdate
        self.vaccines = vaccines

       
        self.active = active
   

class SheepsSchema(ma.Schema):
   
    class Meta:
        fields = ['ear_tag_id', 'name', 'scrapie_tag', 'sex', 'sheep_color', 'weight', 'raised', 'owner', 'birthdate', 'vaccines', 'active', 'registry_name', 'area_name', 'carcass_name', 'fleece_name', 'lamb_info']
    registry_name = ma.fields.Nested(RegistrationsSchema(only=("registration_id", "association", "active")))
    area_name = ma.fields.Nested(PasturesSchema(only=("pasture_id", "pasture_name", "description", "date_moved_into_pasture", "date_moved_out_of_pasture", "active")))
    carcass_name = ma.fields.Nested(MeatSchema(only=("meat_id", "carcass_date_processed", "lambchops", "burgers", "process_cost", "date_processed", "price_per_package", "price_per_carcass",  "active")))
    fleece_name = ma.fields.Nested(WoolSchema(only=("wool_id", "staple_length", "micron", "fleece_color", "shear_date", "weight", "shear_cost", "fleece_price", "sold",  "active")))
    lamb_info = ma.fields.Nested(LambsSchema(only=("lamb_id", "birth_weight", "birthdate", "time_of_birth", "vaccines", "tail_dock", "twin", "active")))
   
    # registry_name = ma.fields.Nested(RegistrationsSchema(only=("registration_id", "association", "active")), many=True)
  
sheep_schema = SheepsSchema()
sheeps_schema = SheepsSchema(many=True)