from flask import jsonify
import flask
from db import db
from datetime import datetime
from models.app_users import AppUsers
from models.activate_email_tokens import ActivateEmailTokens, ActivateEmailTokensSchema
from lib.authenticate import authenticate_return_auth
from util.send_email import send_email

@authenticate_return_auth
def email_activate(req:flask.Request, auth_info) -> flask.Response:
    user_id = auth_info.user_id
    email = (db.session.query(AppUsers).filter(AppUsers.user_id == user_id).fetchone()).email
    token = db.session.query(ActivateEmailTokens).filter(ActivateEmailTokens.user_id == user_id).one()
    if token:
        if token.expiration <= datetime.utcnow():
            return jsonify("Token Expired")
    else:
        return jsonify("User not found"), 404

    send_email(email, "Thank you for activating your account!", f"{token.token}")
    

    return jsonify("email sent!")