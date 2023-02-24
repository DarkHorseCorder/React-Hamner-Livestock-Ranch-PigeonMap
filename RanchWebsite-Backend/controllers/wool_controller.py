from db import db
# from datetime import datetime
from flask import jsonify
import flask
from flask import Flask, request, Response, jsonify

from models.wool import Wool, WoolSchema, wool_schema, wools_schema



def wool_add(request):
    post_data = request.json

    if not post_data:
      post_data = request.post
    
    wool_id = post_data.get('wool_id')
    staple_length = post_data.get('staple_length')
    micron = post_data.get('micron')
    fleece_color = post_data.get('fleece_color')
    weight = post_data.get('weight')
    shear_date = post_data.get('shear_date')
    shear_cost = post_data.get('shear_cost')
    fleece_price = post_data.get('fleece_price')
    sold = post_data.get('sold')

    # association = post_data.get('association')
    # registration_id = post_data.get('registration_id')
    active = post_data.get('active')

    add_wool(wool_id, staple_length, micron, fleece_color, weight, shear_date, shear_cost, fleece_price, sold, active)

    return jsonify("Fleece created"), 201


def add_wool(wool_id, staple_length, micron, fleece_color, weight, shear_date, shear_cost, fleece_price, sold, active): 
    new_wool = Wool(wool_id, staple_length, micron, fleece_color, weight, shear_date, shear_cost, fleece_price, sold, active)
    
    db.session.add(new_wool)
    db.session.commit()


def get_wool(request):
    results = db.session.query(Wool).filter(Wool.active == True).all()

    if results:
      return jsonify(wools_schema.dump(results)), 200
    
    else:
      return jsonify('No fleece Found'), 404

def get_wool_by_id(req:flask.Request, wool_id) -> flask.Response:
    wool_id = wool_id.strip()
    if wool_id == False:
      return jsonify("That fleece must have been sold"), 404
    wool_data = {}
    wool_data = db.session.query(Wool).filter(Wool.wool_id == wool_id).first()
    if wool_data:
      return jsonify(wool_schema.dump(wool_data))

    return jsonify(f'There is no fleece with that wool id {wool_id} '), 404

def wool_update(request):
    post_data = request.get_json()
    wool_id = post_data.get("wool_id")
    if wool_id == None:
        return jsonify("ERROR: wool_id missing"), 400
    staple_length = post_data.get('staple_length')
    micron = post_data.get('micron')
    fleece_color = post_data.get('fleece_color')
    weight = post_data.get('weight')
    shear_date = post_data.get('shear_date')
    shear_cost = post_data.get('shear_cost')

    fleece_price = post_data.get('fleece_price')
    sold = post_data.get('sold')

    active = post_data.get('active')

    if active == None:
      active = True
      
      wool_data = None

      if wool_id != None:
        wool_data = db.session.query(Wool).filter(Wool.wool_id == wool_id).first()

      if wool_data:
        wool_id = wool_data.wool_id

        if staple_length is not None:
          wool_data.staple_length = staple_length

        if micron is not None:
          wool_data.micron = micron
        
        if fleece_color is not None:
          wool_data.fleece_color = fleece_color

        if shear_date is not None:
          wool_data.shear_date = shear_date

        if weight is not None:
          wool_data.weight = weight
        
        if shear_cost is not None:
          wool_data.shear_cost = shear_cost

        if fleece_price is not None:
          wool_data.fleece_price = fleece_price

        if sold is not None:
          wool_data.sold = sold

        if active is not None:
          wool_data.active = active      

        db.session.commit()

        return jsonify('wool Information Updated'), 200
      else:
        return jsonify("Fleece Not Found"), 404
    else:
      return jsonify("ERROR: request must be in JSON format"), 400



def wool_delete(req:flask.Request, wool_id) -> flask.Response:
  if wool_id == False:
      return jsonify("Invalid wool ID"), 404

  wool_data = db.session.query(Wool).filter(Wool.wool_id == wool_id).first()
  if wool_data:
    db.session.delete(wool_data)
    db.session.commit()

    return jsonify(f'Sheep with wool_id {wool_id} deleted'), 200

    
  return jsonify(f'Sheep with wool_id {wool_id} not found'), 404


  