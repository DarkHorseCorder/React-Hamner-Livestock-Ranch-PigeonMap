from datetime import datetime
from flask_bcrypt import generate_password_hash
from flask import jsonify
import flask
from db import db
from models.app_users import AppUsers, user_schema, users_schema
from lib.authenticate import authenticate_return_auth
from models.auth_tokens import AuthTokens
from models.organizations import Organizations
from util.foundation_utils import strip_phone
from util.validate_uuid4 import validate_uuid4

@authenticate_return_auth
def user_activate(req:flask.Request, user_id, auth_info) -> flask.Response:
    if validate_uuid4(user_id) == False:
        return jsonify("Invalid user ID"), 404

    user_data = {}

    if auth_info.user.role == 'super-admin':
        user_data = db.session.query(AppUsers).filter(AppUsers.user_id == user_id).first()
    else:    
        user_data = db.session.query(AppUsers).filter(AppUsers.user_id == user_id).filter(AppUsers.org_id == auth_info.user.org_id).first()
    
    if user_data:
        user_data.active = True
        db.session.commit()
        return jsonify(user_schema.dump(user_data))

    return jsonify(f'User with user_id {user_id} not found'), 404

    return("Request must be in JSON format"), 400


@authenticate_return_auth
def user_add(req:flask.Request, auth_info) -> flask.Response:
    post_data = req.get_json()
    first_name = post_data.get('first_name')
    last_name = post_data.get('last_name')
    email = post_data.get('email')
    password = post_data.get('password')
    phone = post_data.get('phone')
    active = post_data.get('active')
    org_id = post_data.get('org_id')
    role = post_data.get('role')
    print(role)
    if (role == None or role in ['super-admin', 'admin', 'user']):
        role = 'user'
        
        if auth_info.user.role != 'super-admin':
            if role == 'super-admin':
                role = 'user'
            org_id = auth_info.user.org_id
        
        organizations = db.session.query(Organizations).filter(Organizations.org_id == org_id).first()
        if not organizations:
            return jsonify(f"Unable to add User. Organizations with id {org_id} not found"), 404
        if not organizations.active:
            return jsonify(f"Unable to add User. Organizations is inactive."), 403
        if active == None:
            active = True

        hashed_password = generate_password_hash(password).decode("utf8")
        stripped_phone = strip_phone(phone)
        record = AppUsers(first_name, last_name, email, hashed_password, stripped_phone, org_id, role, active)

        db.session.add(record)
        db.session.commit()

        return jsonify("User created"), 201
    else:
        return jsonify("ERROR: user role not in list"), 400


@authenticate_return_auth
def user_deactivate(req:flask.Request, user_id, auth_info) -> flask.Response:
    if validate_uuid4(user_id) == False:
        return jsonify("Invalid user ID"), 404

    user_data = {}
    if str(user_id) == str(auth_info.user.user_id):
        return jsonify('ERROR: cannot deactivate your own user'), 405
    if auth_info.user.role == 'super-admin':
        user_data = db.session.query(AppUsers).filter(AppUsers.user_id == user_id).first()
    else:    
        user_data = db.session.query(AppUsers).filter(AppUsers.user_id == user_id).filter(AppUsers.org_id == auth_info.user.org_id).first()
    
    if user_data:
        user_data.active = False
        db.session.commit()

        # Remove all auth records for anyone from that company
        auth_records = db.session.query(AuthTokens).filter(AuthTokens.user_id == user_id).all()
        
        for auth_record in auth_records:
            db.session.delete(auth_record)

        db.session.commit()


        return jsonify(user_schema.dump(user_data))

        return jsonify(f'User with user_id {user_id} not found'), 404
    
    return("Request must be in JSON format"), 400


@authenticate_return_auth
def user_delete(req:flask.Request, user_id, auth_info) -> flask.Response:
    if validate_uuid4(user_id) == False:
        return jsonify("Invalid user ID"), 404
    
    if auth_info.user.user_id == user_id:
        return jsonify("Forbidden: User cannot delete themselves"), 403

    user_data = db.session.query(AppUsers).filter(AppUsers.user_id == user_id).first()
    if auth_info.user.role == 'user' or (auth_info.user.role == 'admin' and auth_info.user.org_id != user_data.org_id):
        return jsonify("Unauthorized"), 403
    
    if user_data:
        db.session.delete(user_data)
        db.session.commit()
        return jsonify(f'User with user_id {user_id} deleted'), 200

    
    return jsonify(f'User with user_id {user_id} not found'), 404


@authenticate_return_auth
def user_get_by_id(req:flask.Request, user_id, auth_info) -> flask.Response:
    user_id = user_id.strip()
    if validate_uuid4(user_id) == False:
        return jsonify("Invalid user ID"), 404

    user_data = {}
    
    if auth_info.user.role != 'super-admin':
        user_data = db.session.query(AppUsers).filter(AppUsers.user_id == user_id).filter(AppUsers.org_id == auth_info.user.org_id).first()
    else:
        user_data = db.session.query(AppUsers).filter(AppUsers.user_id == user_id).first()
    if user_data:
        return jsonify(user_schema.dump(user_data))

    return jsonify(f'User with user_id {user_id} not found'), 404


@authenticate_return_auth
def user_get_from_auth_token(req:flask.Request, auth_info) -> flask.Response:
    user_data = db.session.query(AppUsers).filter(AppUsers.user_id == auth_info.user_id).first()
    
    if user_data:
        return jsonify(user_schema.dump(user_data))

    return jsonify(f'User not found'), 404


@authenticate_return_auth
def user_update(req:flask.Request, auth_info) -> flask.Response:
    post_data = req.get_json()
    user_id = post_data.get("user_id")
    if user_id == None:
        return jsonify("ERROR: user_id missing"), 400
    org_id = post_data.get("org_id")
    first_name = post_data.get("first_name")
    last_name = post_data.get('last_name')
    email = post_data.get('email')
    password = post_data.get('password')
    phone = post_data.get('phone')
    role = post_data.get('role')
    active = post_data.get('active')
    if active == None:
        active = True
        
        user_data = None
        if auth_info.user.role == 'super-admin':
            user_data = db.session.query(AppUsers).filter(AppUsers.user_id == user_id).first()
        elif auth_info.user.role == 'admin':
            user_data = db.session.query(AppUsers).filter(AppUsers.user_id == user_id).filter(AppUsers.org_id == auth_info.user.org_id).first()
        elif auth_info.user.role == 'user' and str(user_id) == str(auth_info.user.user_id):
            user_data = db.session.query(AppUsers).filter(AppUsers.user_id == auth_info.user.user_id).first()
        
        if user_data:
            user_data.user_id = user_id
            if org_id:
                user_data.org_id = org_id
            if first_name is not None:
                user_data.first_name = first_name
            if last_name is not None:
                user_data.last_name = last_name
            if email is not None:
                user_data.email = email
            if phone is not None:
                user_data.phone = strip_phone(phone)
            if role is not None:
                if auth_info.user.role == 'admin' and role != 'super-admin':
                    if role == 'user':
                        admins_in_org = db.session.query(AppUsers).filter(AppUsers.org_id == auth_info.user.org_id).all()
                        if not admins_in_org or len(admins_in_org) <= 1:
                            return jsonify("Cannot downgrade role of last admin in Organizations"), 403
                    user_data.role = role
                if auth_info.user.role == 'super-admin':
                    user_data.role = role
            if password is not None:
                user_data.password = generate_password_hash(password).decode("utf8")
            if active is not None:
                user_data.active = active

            db.session.commit()

            return jsonify(user_schema.dump(user_data)), 200
        else:
            return jsonify("User Not Found"), 404
    else:
        return jsonify("ERROR: request must be in JSON format"), 400


@authenticate_return_auth
def users_get_all(req:flask.Request, auth_info) -> flask.Response:
    all_users = []

    if auth_info.user.role != 'super-admin':
        all_users = db.session.query(AppUsers).filter(AppUsers.org_id == auth_info.user.org_id).order_by(AppUsers.last_name.asc()).order_by(AppUsers.first_name.asc()).all()
    else:
        all_users = db.session.query(AppUsers).order_by(AppUsers.last_name.asc()).order_by(AppUsers.first_name.asc()).all()
    
    return jsonify(users_schema.dump(all_users))


@authenticate_return_auth
def users_get_by_org_id(req:flask.Request, org_id, auth_info) -> flask.Response:
    if validate_uuid4(org_id) == False:
        return jsonify("Invalid org ID"), 404

    users_by_org = db.session.query(AppUsers).filter(AppUsers.org_id == org_id).all()
    return jsonify(users_schema.dump(users_by_org))


@authenticate_return_auth
def users_get_by_search(req:flask.Request, search_term, internal_call, p_auth_info, auth_info) -> flask.Response:
    search_term = search_term.lower()
    
    user_data = {}

    if auth_info.user.role == 'admin' or auth_info.user.role == 'user':
        user_data = db.session.query(AppUsers).join(Organizations).filter(Organizations.org_id == AppUsers.org_id)\
            .filter(AppUsers.org_id == auth_info.user.org_id) \
            .filter(db.or_( \
            db.func.lower(AppUsers.first_name).contains(search_term), \
            db.func.lower(AppUsers.last_name).contains(search_term), \
            AppUsers.phone.contains(search_term), \
            db.func.lower(Organizations.name).contains(search_term)
                )).order_by(AppUsers.last_name.asc()).order_by(AppUsers.first_name.asc()).all()
    else:
        user_data = db.session.query(AppUsers).join(Organizations).filter(Organizations.org_id == AppUsers.org_id)\
            .filter(db.or_( \
            db.func.lower(AppUsers.first_name).contains(search_term), \
            db.func.lower(AppUsers.last_name).contains(search_term), \
            AppUsers.phone.contains(search_term), \
            db.func.lower(Organizations.name).contains(search_term)
                )).order_by(AppUsers.last_name.asc()).order_by(AppUsers.first_name.asc()).all()
        
    if internal_call:
        return users_schema.dump(user_data)
    return jsonify(users_schema.dump(user_data))