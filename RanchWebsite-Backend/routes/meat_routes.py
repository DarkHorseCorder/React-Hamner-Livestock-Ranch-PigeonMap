import controllers
from flask import request, Response, Blueprint

meat = Blueprint('meat', __name__)

@meat.route("/meat/add", methods=["POST"])
def meat_add() -> Response:
    return controllers.meat_add(request)

@meat.route("/meat/get/<meat_id>", methods=["GET"])
def get_meat_by_id(meat_id):
    return controllers.get_meat_by_id(request, meat_id)

@meat.route("/meat/get", methods=["GET"])
def get_meat() -> Response:
    return controllers.get_meat(request)

@meat.route("/meat/update", methods=["POST"])
def meat_update() -> Response:
    return controllers.meat_update(request)

@meat.route("/meat/delete/<meat_id>", methods=["DELETE"])
def meat_delete(meat_id):
    return controllers.meat_delete(request, meat_id)

# @meat.route("/deactivate/<meat_id>", methods=["GET"])
# def meat_deactivate(meat_id):
#         return controllers.meat_deactivate(request, meat_id)
