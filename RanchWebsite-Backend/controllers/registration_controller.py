from db import db
from flask import jsonify
import flask

from flask import Flask, request, Response, jsonify

from models.registration import Registrations, registration_schema, registrations_schema



def registration_add(request):
    post_data = request.json

    if not post_data:
      post_data = request.post
    
    registration_id = post_data.get('registration_id')
  
    association = post_data.get('association')
   
    active = post_data.get('active')

    add_registration(registration_id, association, active)

    return jsonify("registration created"), 201
  


def add_registration(registration_id,  association,  active): 
    new_registration = Registrations(registration_id, association,  active)
    
    db.session.add(new_registration)
    db.session.commit()

def get_registrations(request):
    results = db.session.query(Registrations).filter(Registrations.active == True).all()

    if results:
      return jsonify(registrations_schema.dump(results)), 200
    
    else:
      return jsonify('No registration Found'), 404

def get_registration_by_id(request, registration_id):
    results = db.session.query(Registrations).filter(Registrations.active == True).filter(Registrations.registration_id==registration_id).first()

    if results:
      return jsonify(registration_schema.dump(results)), 200
    
    else:
      return jsonify('No registration Found'), 404

def registration_update(request):
    post_data = request.get_json()
    registration_id = post_data.get("registration_id")
    if registration_id == None:
        return jsonify("ERROR: registration_id missing"), 400
   
    association = post_data.get('association')
    
    active = post_data.get('active')

    # ear_tag_id = post_data.get('ear_tag_id')

    if active == None:
      active = True
      
      registration_data = None

      if registration_id != None:
        registration_data = db.session.query(Registrations).filter(Registrations.registration_id == registration_id).first()

      if registration_data:
        registration_id = registration_data.registration_id
        
        if association is not None:
          registration_data.association = association
       
        if active is not None:
          registration_data.active = active
        
        # if ear_tag_id is not None:
        #   registration_data.ear_tag_id = ear_tag_id

        # if ear_tag_id !=None or ear_tag_id != '':
        #     registration_data.ear_tag_id = ear_tag_id

        db.session.commit()

        return jsonify('registration Information Updated'), 200
      else:
        return jsonify("registration Not Found"), 404
    else:
      return jsonify("ERROR: request must be in JSON format"), 400



def registration_delete(req:flask.Request, registration_id) -> flask.Response:
  if registration_id == False:
      return jsonify("Invalid Registration ID"), 404

  registration_data = db.session.query(Registrations).filter(Registrations.registration_id == registration_id).first()
  if registration_data:
    db.session.delete(registration_data)
    db.session.commit()
    return jsonify(f'Registration with registration_id {registration_id} deleted'), 200


  return jsonify(f'Registration with registration_id {registration_id} not found'), 404

