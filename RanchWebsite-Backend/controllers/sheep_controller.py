from db import db
# from datetime import datetime
from flask import jsonify
import flask
from flask import Flask, request, Response, jsonify

from models.sheep import Sheeps, sheeps_schema, sheep_schema



def sheep_add(request):
    post_data = request.json

    if not post_data:
      post_data = request.post
    
    ear_tag_id = post_data.get('ear_tag_id')
    name = post_data.get('name')
    scrapie_tag = post_data.get('scrapie_tag')
    sex = post_data.get('sex')
    sheep_color = post_data.get('sheep_color')
    weight = post_data.get('weight')
    raised = post_data.get('raised')
    owner = post_data.get('owner')
   
    birthdate = post_data.get('birthdate')
    vaccines = post_data.get('vaccines')

    # association = post_data.get('association')
    # registration_id = post_data.get('registration_id')
    active = post_data.get('active')

    add_sheep(ear_tag_id, name, scrapie_tag, sex, sheep_color, weight, raised, owner, birthdate, vaccines,  active)

    return jsonify("sheep created"), 201


def add_sheep(ear_tag_id, name, scrapie_tag, sex, sheep_color, weight, raised, owner, birthdate, vaccines,  active): 
    new_sheep = Sheeps(ear_tag_id, name, scrapie_tag, sex, sheep_color, weight, raised, owner, birthdate, vaccines,  active)
    
    db.session.add(new_sheep)
    db.session.commit()


def get_sheeps(request):
    results = db.session.query(Sheeps).filter(Sheeps.active == True).all()

    if results:
      return jsonify(sheeps_schema.dump(results)), 200
    
    else:
      return jsonify('No sheep Found'), 404

def get_sheep_by_id(req:flask.Request, ear_tag_id) -> flask.Response:
    ear_tag_id = ear_tag_id.strip()
    if ear_tag_id == False:
      return jsonify("That sheep must have escaped the flock"), 404
    sheep_data = {}
    sheep_data = db.session.query(Sheeps).filter(Sheeps.ear_tag_id == ear_tag_id).first()
    if sheep_data:
      return jsonify(sheep_schema.dump(sheep_data))

    return jsonify(f'There is no sheep with ear tag {ear_tag_id} '), 404
    # post_data = request.get_json()
    # results = db.session.query(Sheeps).filter(Sheeps.active == True).filter(Sheeps.ear_tag_id==ear_tag_id).first()

    # if results:
    #   return jsonify(sheep_schema.dump(results)), 200
    
    # else:
    #   return jsonify('No sheep Found'), 404

def sheep_update(request):
    post_data = request.get_json()
    ear_tag_id = post_data.get("ear_tag_id")
    if ear_tag_id == None:
        return jsonify("ERROR: ear_tag_id missing"), 400
    name = post_data.get('name')
    scrapie_tag = post_data.get('scrapie_tag')
    sex = post_data.get('sex')
    sheep_color = post_data.get('sheep_color')
    weight = post_data.get('weight')
    raised = post_data.get('raised')
    owner = post_data.get('owner')

    birthdate = post_data.get('birthdate')
    vaccines = post_data.get('vaccines')
    active = post_data.get('active')

    registration_id = post_data.get('registration_id')
    pasture_id = post_data.get('pasture_id')
    meat_id = post_data.get('meat_id')
    wool_id = post_data.get('wool_id')
    lamb_id = post_data.get('lamb_id')


    if active == None:
      active = True
      
      sheep_data = None

      if ear_tag_id != None:
        sheep_data = db.session.query(Sheeps).filter(Sheeps.ear_tag_id == ear_tag_id).first()

      if sheep_data:
        ear_tag_id = sheep_data.ear_tag_id
        if name:
          sheep_data.name = name

        if scrapie_tag is not None:
          sheep_data.scrapie_tag = scrapie_tag

        if sex is not None:
          sheep_data.sex = sex
        
        if sheep_color is not None:
          sheep_data.sheep_color = sheep_color
        
        if weight is not None:
          sheep_data.weight = weight
        
        if raised is not None:
          sheep_data.raised = raised
   
        if owner is not None:
          sheep_data.owner = owner

        if birthdate is not None:
          sheep_data.birthdate = birthdate
        if vaccines is not None:
          sheep_data.vaccines = vaccines


        if active is not None:
          sheep_data.active = active
        
        if registration_id is not None:
          sheep_data.registration_id = registration_id

        if registration_id !=None or registration_id != '':
            sheep_data.registration_id = registration_id

        if pasture_id is not None:
          sheep_data.pasture_id = pasture_id

        if pasture_id !=None or pasture_id != '':
            sheep_data.pasture_id = pasture_id   

        if meat_id is not None:
          sheep_data.meat_id = meat_id

        if meat_id !=None or meat_id != '':
            sheep_data.meat_id = meat_id  

        if wool_id is not None:
          sheep_data.wool_id = wool_id
     

        if lamb_id is not None:
          sheep_data.lamb_id = lamb_id

        if lamb_id !=None or lamb_id != '':
            sheep_data.lamb_id = lamb_id     

        db.session.commit()

        return jsonify('sheep Information Updated'), 200
      else:
        return jsonify("sheep Not Found"), 404
    else:
      return jsonify("ERROR: request must be in JSON format"), 400



def sheep_delete(req:flask.Request, ear_tag_id) -> flask.Response:
  if ear_tag_id == False:
      return jsonify("Invalid ear tag ID"), 404

  sheep_data = db.session.query(Sheeps).filter(Sheeps.ear_tag_id == ear_tag_id).first()
  if sheep_data:
    db.session.delete(sheep_data)
    db.session.commit()

    return jsonify(f'Sheep with ear_tag_id {ear_tag_id} deleted'), 200

    
  return jsonify(f'Sheep with ear_tag_id {ear_tag_id} not found'), 404


  