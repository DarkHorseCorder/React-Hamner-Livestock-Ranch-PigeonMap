import base64
import uuid
from flask import jsonify
import flask
from flask_bcrypt import check_password_hash, generate_password_hash
from db import db
from models.app_users import AppUsers
from models.auth_tokens import AuthTokens, auth_token_schema
from datetime import datetime, timedelta
from models.pw_reset_token import PWResetTokens
from util.send_email import send_email

def auth_token_add(req:flask.Request) -> flask.Response:
    if req.content_type == "application/json":
        post_data = req.get_json()
        email = post_data.get("email")
        password = post_data.get("password")
        if email == None:
            return jsonify("ERROR: email missing"), 400
        if password == None:
            return jsonify("ERROR: password missing"), 400

        now_datetime = datetime.utcnow()
        expiration_datetime = datetime.utcnow() + timedelta(hours=12)
        user_data = db.session.query(AppUsers)\
            .filter(AppUsers.email == email)\
            .filter(AppUsers.active).first()

        if user_data:
            if user_data.Organizations.active == False:
                return jsonify("Your account has been deactivated. Please contact your account executive."), 403

            is_password_valid = check_password_hash(user_data.password, password)
            if is_password_valid == False:
                return jsonify("Invalid email/password"), 401

            auth_data = db.session.query(AuthTokens).filter(AuthTokens.user_id == user_data.user_id).first()
            if auth_data is None:
                auth_data = AuthTokens(user_data.user_id, expiration_datetime)
                db.session.add(auth_data)
            else:
                # auth_record = db.session.query(AuthTokens).filter(AuthTokens.auth_token == auth_token).filter(AuthTokens.expiration > datetime.utcnow()).first()
                print(auth_data.expiration)
                # 2021-05-11 05:11:13.899410
                # old_expiration_datetime = datetime.strptime(auth_data.expiration, '%Y-%m-%d %H:%M:%S.%f')
                if now_datetime < auth_data.expiration:
                    # Auth Expired
                    db.session.delete(auth_data)
                    auth_data = AuthTokens(user_data.user_id, expiration_datetime)
                    db.session.add(auth_data)
                else:
                    auth_data.expiration = expiration_datetime
        else: 
            return jsonify("Invalid email/password"), 401

        db.session.commit()

        return jsonify(auth_token_schema.dump(auth_data))
    else:
        return jsonify("ERROR: request must be made in JSON format"), 404


def auth_token_remove(req:flask.Request) -> flask.Response:
    if req.content_type == "application/json":
        post_data = req.get_json()
        user_id = post_data.get("user_id")
        auth_token = post_data.get("auth_token")
        if (user_id == None or user_id == '') and (auth_token == None or auth_token == ''):
            return jsonify("Cannot log out a user with no user_id or auth_token"), 200
        # print("AUTH TOKEN: " + auth_token)
        if auth_token and auth_token != "not required":
            auth_data = db.session.query(AuthTokens).filter(AuthTokens.auth_token == auth_token).first()
        else:
            auth_data = db.session.query(AuthTokens).filter(AuthTokens.user_id == user_id).first()
        
        if auth_data:
            db.session.delete(auth_data)
            db.session.commit()
    
        return jsonify("User logged out"), 200
    else:
        return jsonify("ERROR: request must be in JSON format")


def forgot_password_change(req:flask.Request) -> flask.Response:
    # req will now be a json object with the requested data
    req = req.get_json()
    token = req["token"]
    pw_reset_token = db.session.query(PWResetTokens).filter(PWResetTokens.user_id == req["user_id"]).filter(PWResetTokens.token == token).filter(PWResetTokens.expiration > datetime.utcnow()).first()
    
    if not pw_reset_token:
        return jsonify("Expired password reset link."), 401

    user_db = db.session.query(AppUsers).filter(AppUsers.user_id == req["user_id"]).first()
    if not req["new_password"] or len(req["new_password"]) < 1:
        return jsonify("Cannot set to blank password."), 400

    user_db.password = generate_password_hash(req["new_password"]).decode("utf8")
    db.session.commit()
    try:
        send_email(user_db.email, "Geotagger Password Change", "We've successfully updated your password for GeoTagger. If this wasn't you, please contact us.")
    except Exception as e:
        print(e)
    return flask.make_response(flask.jsonify({"message": "password changed"}), 200)


def pw_change_request(req:flask.Request) -> flask.Response:
    # protect user roles
    post_data = req.get_json()
    email = post_data.get('email')
    # TEMPLATE_ID='d-961220b709474aaba564bffa65a38c58'
    print(email)
    try:

        user = db.session.query(AppUsers).filter(AppUsers.email == email).filter(AppUsers.active == True).first()
        if user: 
            reset_pw_link, token, expiration = get_reset_link(req, user.user_id)
            token_record = PWResetTokens(user.user_id, expiration, token)
            print(token_record)
            db.session.add(token_record)
            db.session.commit()
            send_email(email, "Password Update Request", '''<div style="background-color:white;color:#3e5c76;"><h1>Hello '''+user.first_name.capitalize()+ ''',</h1><p>You requested a password reset for your GeoTagger.io account.
            </p><p>Click the link below or copy it into your browser to reset your password</p></div>'''"<p>"+reset_pw_link+"</p>")
        else:
            return jsonify("user not found"), 404
        return jsonify("email sent"), 201

    except Exception as inst:
        return jsonify(inst.args[0],inst), 400

def get_reset_link(req:flask.Request, user_id) -> flask.Response:
    expiration_datetime = datetime.utcnow() + timedelta(minutes=30)
    expiration_string = expiration_datetime.strftime("%Y-%m-%dT%H:%M:%S")
    token = str(uuid.uuid4())
    link_string = f"user_id={user_id}|expires={expiration_string}|token={token}"
    encoded_string = base64.b64encode(link_string.encode('ascii')).decode('ascii')
    link = f"http://127.0.0.1:3000/login/password/change/{encoded_string}/"
    return link, token, expiration_string