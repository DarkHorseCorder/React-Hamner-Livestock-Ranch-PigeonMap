from db import db
from flask import jsonify
import flask

from flask import Flask, request, Response, jsonify

from models.pasture import Pastures, pasture_schema, pastures_schema



def pasture_add(request):
    post_data = request.json

    if not post_data:
      post_data = request.post
    
    pasture_id = post_data.get('pasture_id')
  
    pasture_name = post_data.get('pasture_name')
   
    description = post_data.get('description')

    date_moved_into_pasture = post_data.get('date_moved_into_pasture')
    date_moved_out_of_pasture = post_data.get('date_moved_out_of_pasture')

    active = post_data.get('active')

    add_pasture(pasture_id, pasture_name, description, date_moved_into_pasture, date_moved_out_of_pasture, active)

    return jsonify("pasture created"), 201
  


def add_pasture(pasture_id,  pasture_name, description, date_moved_into_pasture, date_moved_out_of_pasture, active): 
    new_pasture = Pastures(pasture_id, pasture_name, description, date_moved_into_pasture, date_moved_out_of_pasture, active)
    
    db.session.add(new_pasture)
    db.session.commit()

def get_pastures(request):
    results = db.session.query(Pastures).filter(Pastures.active == True).all()

    if results:
      return jsonify(pastures_schema.dump(results)), 200
    
    else:
      return jsonify('No pasture Found'), 404

def get_pasture_by_id(request, pasture_id):
    results = db.session.query(Pastures).filter(Pastures.active == True).filter(Pastures.pasture_id==pasture_id).first()

    if results:
      return jsonify(pasture_schema.dump(results)), 200
    
    else:
      return jsonify('No pasture Found'), 404

def pasture_update(request):
    post_data = request.get_json()
    pasture_id = post_data.get("pasture_id")
    if pasture_id == None:
        return jsonify("ERROR: pasture_id missing"), 400
   
    pasture_name = post_data.get('pasture_name')

    description = post_data.get('description')
    date_moved_into_pasture = post_data.get('date_moved_into_pasture')
    date_moved_out_of_pasture = post_data.get('date_moved_out_of_pasture')
    active = post_data.get('active')

    # ear_tag_id = post_data.get('ear_tag_id')

    if active == None:
      active = True
      
      pasture_data = None

      if pasture_id != None:
        pasture_data = db.session.query(Pastures).filter(Pastures.pasture_id == pasture_id).first()

      if pasture_data:
        pasture_id = pasture_data.pasture_id
        
        if pasture_name is not None:
          pasture_data.pasture_name = pasture_name

        if description is not None:
          pasture_data.description = description  
        
        if date_moved_into_pasture is not None:
          pasture_data.date_moved_into_pasture = date_moved_into_pasture 

        if date_moved_out_of_pasture is not None:
          pasture_data.date_moved_out_of_pasture = date_moved_out_of_pasture         
      
       
        if active is not None:
          pasture_data.active = active
        
        # if ear_tag_id is not None:
        #   pasture_data.ear_tag_id = ear_tag_id

        # if ear_tag_id !=None or ear_tag_id != '':
        #     pasture_data.ear_tag_id = ear_tag_id

        db.session.commit()

        return jsonify('pasture Information Updated'), 200
      else:
        return jsonify("pasture Not Found"), 404
    else:
      return jsonify("ERROR: request must be in JSON format"), 400



def pasture_delete(req:flask.Request, pasture_id) -> flask.Response:
  if pasture_id == False:
      return jsonify("Invalid Pasture ID"), 404

  pasture_data = db.session.query(Pastures).filter(Pastures.pasture_id == pasture_id).first()
  if pasture_data:
    db.session.delete(pasture_data)
    db.session.commit()
    return jsonify(f'Pasture with pasture_id {pasture_id} deleted'), 200


  return jsonify(f'Pasture with pasture_id {pasture_id} not found'), 404

