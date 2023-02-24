from db import db
# from datetime import datetime
from flask import jsonify
import flask
from flask import Flask, request, Response, jsonify

from models.meat import Meat, MeatSchema, meat_schema, meats_schema



def meat_add(request):
    post_data = request.json

    if not post_data:
      post_data = request.post
    
    meat_id = post_data.get('meat_id')
    carcass_date_processed = post_data.get('carcass_date_processed')
    lambchops = post_data.get('lambchops')
    burgers = post_data.get('burgers')
    process_cost = post_data.get('process_cost')
    date_processed = post_data.get('date_processed')
    price_per_package = post_data.get('price_per_package')
    price_per_carcass = post_data.get('price_per_carcass')

    # association = post_data.get('association')
    # registration_id = post_data.get('registration_id')
    active = post_data.get('active')

    add_meat(meat_id, carcass_date_processed, lambchops, burgers, process_cost, date_processed, price_per_package, price_per_carcass, active)

    return jsonify("Meat created"), 201


def add_meat(meat_id, carcass_date_processed, lambchops, burgers, process_cost, date_processed, price_per_package, price_per_carcass, active): 
    new_meat = Meat(meat_id, carcass_date_processed, lambchops, burgers, process_cost, date_processed, price_per_package, price_per_carcass, active)
    
    db.session.add(new_meat)
    db.session.commit()


def get_meat(request):
    results = db.session.query(Meat).filter(Meat.active == True).all()

    if results:
      return jsonify(meats_schema.dump(results)), 200
    
    else:
      return jsonify('No Meat Found'), 404

def get_meat_by_id(req:flask.Request, meat_id) -> flask.Response:
    meat_id = meat_id.strip()
    if meat_id == False:
      return jsonify("That meat must have been sold"), 404
    meat_data = {}
    meat_data = db.session.query(Meat).filter(Meat.meat_id == meat_id).first()
    if meat_data:
      return jsonify(meat_schema.dump(meat_data))

    return jsonify(f'There is no meat with that meat id {meat_id} '), 404

def meat_update(request):
    post_data = request.get_json()
    meat_id = post_data.get("meat_id")
    if meat_id == None:
        return jsonify("ERROR: meat_id missing"), 400
    carcass_date_processed = post_data.get('carcass_date_processed')
    lambchops = post_data.get('lambchops')
    burgers = post_data.get('burgers')
    process_cost = post_data.get('process_cost')
    date_processed = post_data.get('date_processed')
    price_per_package = post_data.get('price_per_package')

    price_per_carcass = post_data.get('price_per_carcass')


    active = post_data.get('active')

    if active == None:
      active = True
      
      meat_data = None

      if meat_id != None:
        meat_data = db.session.query(Meat).filter(Meat.meat_id == meat_id).first()

      if meat_data:
        meat_id = meat_data.meat_id

        if carcass_date_processed is not None:
          meat_data.carcass_date_processed = carcass_date_processed

        if lambchops is not None:
          meat_data.lambchops = lambchops
        
        if burgers is not None:
          meat_data.burgers = burgers

        if date_processed is not None:
          meat_data.date_processed = date_processed

        if process_cost is not None:
          meat_data.process_cost = process_cost
        
        if price_per_package is not None:
          meat_data.price_per_package = price_per_package

        if price_per_carcass is not None:
          meat_data.price_per_carcass = price_per_carcass


        if active is not None:
          meat_data.active = active      

        db.session.commit()

        return jsonify('meat Information Updated'), 200
      else:
        return jsonify("Meat Not Found"), 404
    else:
      return jsonify("ERROR: request must be in JSON format"), 400



def meat_delete(req:flask.Request, meat_id) -> flask.Response:
  if meat_id == False:
      return jsonify("Invalid meat ID"), 404

  meat_data = db.session.query(Meat).filter(Meat.meat_id == meat_id).first()
  if meat_data:
    db.session.delete(meat_data)
    db.session.commit()

    return jsonify(f'Sheep with meat_id {meat_id} deleted'), 200

    
  return jsonify(f'Sheep with meat_id {meat_id} not found'), 404


  