import controllers
from flask import request, Response, Blueprint

registrations = Blueprint('registrations', __name__)

@registrations.route("/registration/add", methods=["POST"])
def registration_add() -> Response:
    return controllers.registration_add(request)

@registrations.route("/registration/get", methods=["GET"])
def get_registrations() -> Response:
    return controllers.get_registrations(request)

@registrations.route("/registration/update", methods=["POST"])
def registration_update() -> Response:
    return controllers.registration_update(request)

@registrations.route("/registration/delete/<registration_id>", methods=["DELETE"])
def registration_delete(registration_id) -> Response:
    return controllers.registration_delete(request, registration_id)

@registrations.route("/registration/get/<registration_id>", methods=["GET"])
def get_registration_by_id(registration_id) -> Response:
    return controllers.get_registration_by_id(request, registration_id)