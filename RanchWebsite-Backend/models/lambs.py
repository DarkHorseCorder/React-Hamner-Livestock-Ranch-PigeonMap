from flask_marshmallow import Marshmallow
from sqlalchemy.dialects.postgresql import UUID
import uuid

from db import db
import marshmallow as ma

from models.registration import Registrations, RegistrationsSchema, registrations_schema, registration_schema
from models.pasture import Pastures, PasturesSchema, pasture_schema, pastures_schema
from models.meat import Meat, MeatSchema, meat_schema, meats_schema
from models.wool import Wool, WoolSchema, wool_schema, wools_schema


class Lambs(db.Model):
    __tablename__= "Lambs"
    lamb_id = db.Column(db.Integer(), primary_key=True)
    # name = db.Column(db.String(), nullable = False)
    # scrapie_tag = db.Column(db.String(), nullable = False, unique = True)
    # sex = db.Column(db.String())
    # color = db.Column(db.String())
    birth_weight = db.Column(db.String())
    # raised = db.Column(db.String())
    # owner = db.Column(db.String())
    birthdate = db.Column(db.String())
    time_of_birth = db.Column(db.String())
    vaccines = db.Column(db.String())
    tail_dock = db.Column(db.String())
    twin = db.Column(db.Boolean(), nullable=False, default=True)
 
    active = db.Column(db.Boolean(), nullable=False, default=True)

    flocks = db.relationship('Sheeps', back_populates='lamb_info')


    
   
    def __init__(self, lamb_id, birth_weight, birthdate, time_of_birth, vaccines, tail_dock, twin, active):
        self.lamb_id = lamb_id
        self.birth_weight = birth_weight
        self.birthdate = birthdate
        self.time_of_birth = time_of_birth
        self.vaccines = vaccines  
        self.tail_dock = tail_dock
        self.twin = twin

        self.active = active
   

class LambsSchema(ma.Schema):
   
    class Meta:
        fields = ['lamb_id', 'birth_weight', 'birthdate', 'time_of_birth', 'vaccines', 'tail_dock', 'twin', 'active', 'flocks']
    flocks = ma.fields.Nested('SheepsSchema', only=['ear_tag_id'], many=True)
    # registry_name = ma.fields.Nested(RegistrationsSchema(only=("registration_id", "association", "active")), many=True)
  
lamb_schema = LambsSchema()
lambs_schema = LambsSchema(many=True)