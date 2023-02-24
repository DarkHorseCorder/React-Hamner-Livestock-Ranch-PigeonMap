from flask import jsonify
import flask
from db import db
from models.contact_info import ContactInfo, contact_info_schema, contacts_schema
from lib.authenticate import authenticate, authenticate_return_auth
from util.validate_uuid4 import validate_uuid4

@authenticate
def contact_add(req:flask.Request) -> flask.Response:
    post_data = req.get_json()
    user_id = post_data.get('user_id')
    contact_type = post_data.get('contact_type')
    contact_value = post_data.get('contact_value')
    

    check = db.session.query(ContactInfo).filter(ContactInfo.contact_type == contact_type).filter(ContactInfo.user_id == user_id).one()
    if check != None:
        return jsonify("ERROR: ContactInfo type already exists.")
    else:
        try:
            record = ContactInfo(user_id, contact_type, contact_value)
            db.session.add(record)
            db.session.commit()
        except: 
            return jsonify('ERROR: IDK')

    return jsonify("Contact Type Created"), 201

@authenticate_return_auth
def read_contacts(req:flask.Request, user_id=None, auth_info=None) -> flask.Response:
    
    contacts = db.session.query(ContactInfo).filter(ContactInfo.user_id == user_id).first()
    if contacts == None or []:
        return jsonify("No data for user.")
    return contacts_schema.dump(contacts)
    

@authenticate
def contact_update(req:flask.Request) -> flask.Response:
    post_data = req.get_json()
    user_id = post_data.get('user_id')
    contact_type = post_data.get('contact_value')
    contact_value = post_data.get('contact_value')
    
    if user_id and contact_value == None:
        return jsonify('ERROR: Primary Values missing')
    
    contact_data = db.session.query(ContactInfo).filter(ContactInfo.user_id == user_id).first()

    if contact_data:
        contact_data.user_id = user_id
        if contact_value:
            contact_data.contact_value = contact_value
        if contact_type:
            contact_data.contact_type = contact_type

        db.session.commit

        return jsonify(contact_info_schema.dump(contact_data)), 200

    else:
        return jsonify('ERROR: Primary Values Not Found'), 404

@authenticate
def contact_delete(req:flask.Request, user_id, contact_type) -> flask.Response:
    if validate_uuid4(user_id)== False:
        return jsonify("Invalid user ID"),404
    
    contact = db.session.query(ContactInfo).filter(ContactInfo.user_id == user_id)
    contact_removal = []
    for info in contact:
        if info[1] == contact_type:
            contact_removal.append[info]
        else:
            continue
        if contact_removal != []:
            for item in contact_removal:
                db.session.delete(item)
            db.session.commit()
            return jsonify(f'{contact_type} for {user_id} deleted')
        
        return jsonify(f'{contact_type} not found for{user_id}')
    