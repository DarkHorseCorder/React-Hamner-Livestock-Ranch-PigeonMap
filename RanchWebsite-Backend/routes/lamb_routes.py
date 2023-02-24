import controllers
from flask import request, Response, Blueprint

lambs = Blueprint('lambs', __name__)

@lambs.route("/lamb/add", methods=["POST"])
def lamb_add() -> Response:
    return controllers.lamb_add(request)

@lambs.route("/lambs/get", methods=["GET"])
def get_lambs() -> Response:
    return controllers.get_lambs(request)

@lambs.route("/lamb/update", methods=["POST"])
def lamb_update() -> Response:
    return controllers.lamb_update(request)

@lambs.route("/lamb/delete/<lamb_id>", methods=["DELETE"])
def lamb_delete(lamb_id) -> Response:
    return controllers.lamb_delete(request, lamb_id)

@lambs.route("/lamb/get/<lamb_id>", methods=["GET"])
def get_lamb_by_id(lamb_id) -> Response:
    return controllers.get_lamb_by_id(request, lamb_id)