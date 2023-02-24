from flask import jsonify
import flask
from db import db
from models.organizations import Organizations, organizations_schema
from models.app_users import AppUsers, user_schema
from lib.authenticate import authenticate_return_auth
import controllers

@authenticate_return_auth
def get_objects_by_search(req:flask.Request, search_term, auth_info) -> flask.Response:
    user_data = db.session.query(AppUsers).filter(AppUsers.user_id == auth_info.user.user_id).first()
    if auth_info.user.role in ['user', 'admin'] and (auth_info.user.org_id != user_data.org_id or auth_info.user.role != user_data.role):
        return jsonify("Unauthorized"), 403
    
    search_results = {}
    search_results["organizations"] = controllers.organization_controller.organization_get_by_search(req, search_term, True, auth_info)
    search_results["users"] = controllers.user_controller.users_get_by_search(req, search_term, True, auth_info)
    return jsonify(search_results)