from db import db
from flask import jsonify
import flask

from flask import Flask, request, Response, jsonify

from models.lambs import Lambs, lamb_schema, lambs_schema



def lamb_add(request):
    post_data = request.json

    if not post_data:
      post_data = request.post
    
    lamb_id = post_data.get('lamb_id')
  
    birth_weight = post_data.get('birth_weight')
    birthdate = post_data.get('birthdate')
    time_of_birth = post_data.get('time_of_birth')
    vaccines = post_data.get('vaccines')
    tail_dock = post_data.get('tail_dock')
    twin = post_data.get('twin')
   
    active = post_data.get('active')

    add_lamb(lamb_id, birth_weight, birthdate, time_of_birth, vaccines, tail_dock, twin, active)

    return jsonify("lamb created"), 201
  


def add_lamb(lamb_id, birth_weight, birthdate, time_of_birth, vaccines, tail_dock, twin,  active): 
    new_lamb = Lambs(lamb_id, birth_weight, birthdate, time_of_birth, vaccines, tail_dock, twin, active)
    
    db.session.add(new_lamb)
    db.session.commit()

def get_lambs(request):
    results = db.session.query(Lambs).filter(Lambs.active == True).all()

    if results:
      return jsonify(lambs_schema.dump(results)), 200
    
    else:
      return jsonify('No lamb Found'), 404

def get_lamb_by_id(request, lamb_id):
    results = db.session.query(Lambs).filter(Lambs.active == True).filter(Lambs.lamb_id==lamb_id).first()

    if results:
      return jsonify(lamb_schema.dump(results)), 200
    
    else:
      return jsonify('No lamb Found'), 404

def lamb_update(request):
    post_data = request.get_json()
    lamb_id = post_data.get("lamb_id")
    if lamb_id == None:
        return jsonify("ERROR: lamb_id missing"), 400
   
    birth_weight = post_data.get('birth_weight')
    birthdate = post_data.get('birthdate')
    time_of_birth = post_data.get('time_of_birth')
    vaccines = post_data.get('vaccines')
    tail_dock = post_data.get('tail_dock')
    twin = post_data.get('twin')

    active = post_data.get('active')

    # lamb_id = post_data.get('lamb_id')

    if active == None:
      active = True
      
      lamb_data = None

      if lamb_id != None:
        lamb_data = db.session.query(Lambs).filter(Lambs.lamb_id == lamb_id).first()

      if lamb_data:
        lamb_id = lamb_data.lamb_id

        if birth_weight is not None:
          lamb_data.birth_weight = birth_weight

        if birthdate is not None:
          lamb_data.birthdate = birthdate
        if time_of_birth is not None:
          lamb_data.time_of_birth = time_of_birth
        if vaccines is not None:
          lamb_data.vaccines = vaccines
        if tail_dock is not None:
          lamb_data.tail_dock = tail_dock
        if twin is not None:
          lamb_data.twin = twin
        if active is not None:
          lamb_data.active = active
        
        # if lamb_id is not None:
        #   lamb_data.lamb_id = lamb_id

        # if lamb_id !=None or lamb_id != '':
        #     lamb_data.lamb_id = lamb_id

        db.session.commit()

        return jsonify('lamb Information Updated'), 200
      else:
        return jsonify("lamb Not Found"), 404
    else:
      return jsonify("ERROR: request must be in JSON format"), 400



def lamb_delete(req:flask.Request, lamb_id) -> flask.Response:
  if lamb_id == False:
      return jsonify("Invalid Lamb ID"), 404

  lamb_data = db.session.query(Lambs).filter(Lambs.lamb_id == lamb_id).first()
  if lamb_data:
    db.session.delete(lamb_data)
    db.session.commit()
    return jsonify(f'Lamb with lamb_id {lamb_id} deleted'), 200


  return jsonify(f'Lamb with lamb_id {lamb_id} not found'), 404

