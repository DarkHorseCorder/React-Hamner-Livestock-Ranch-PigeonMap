import controllers
from flask import request, Response, Blueprint

wool = Blueprint('wool', __name__)

@wool.route("/wool/add", methods=["POST"])
def wool_add() -> Response:
    return controllers.wool_add(request)

@wool.route("/wool/get/<wool_id>", methods=["GET"])
def get_wool_by_id(wool_id):
    return controllers.get_wool_by_id(request, wool_id)

@wool.route("/wool/get", methods=["GET"])
def get_wool() -> Response:
    return controllers.get_wool(request)

@wool.route("/wool/update", methods=["POST"])
def wool_update() -> Response:
    return controllers.wool_update(request)

@wool.route("/wool/delete/<wool_id>", methods=["DELETE"])
def wool_delete(wool_id):
    return controllers.wool_delete(request, wool_id)

# @wool.route("/deactivate/<wool_id>", methods=["GET"])
# def wool_deactivate(wool_id):
#         return controllers.wool_deactivate(request, wool_id)
