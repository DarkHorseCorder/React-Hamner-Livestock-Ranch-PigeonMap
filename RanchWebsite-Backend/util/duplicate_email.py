from db import db
from models.app_users import AppUsers
from flask import jsonify

def duplicate_email_check(email):

    user_data = db.session.query(AppUsers)\
        .filter(AppUsers.email == email)\
        .filter(AppUsers.active).first()

    if user_data:
        return jsonify({"message" : "Duplicate Email"}), 401

    else:
        return jsonify({"message" : "Email available"}), 200