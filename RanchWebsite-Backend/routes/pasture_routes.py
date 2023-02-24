import controllers
from flask import request, Response, Blueprint

pastures = Blueprint('pastures', __name__)

@pastures.route("/pasture/add", methods=["POST"])
def pasture_add() -> Response:
    return controllers.pasture_add(request)

@pastures.route("/pasture/get", methods=["GET"])
def get_pastures() -> Response:
    return controllers.get_pastures(request)

@pastures.route("/pasture/update", methods=["POST"])
def pasture_update() -> Response:
    return controllers.pasture_update(request)

@pastures.route("/pasture/delete/<pasture_id>", methods=["DELETE"])
def pasture_delete(pasture_id) -> Response:
    return controllers.pasture_delete(request, pasture_id)

@pastures.route("/pasture/get/<pasture_id>", methods=["GET"])
def get_pasture_by_id(pasture_id) -> Response:
    return controllers.get_pasture_by_id(request, pasture_id)