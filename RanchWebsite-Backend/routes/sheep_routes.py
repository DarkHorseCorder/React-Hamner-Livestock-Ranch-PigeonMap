import controllers
from flask import request, Response, Blueprint

sheeps = Blueprint('sheeps', __name__)

@sheeps.route("/sheep/add", methods=["POST"])
def sheep_add() -> Response:
    return controllers.sheep_add(request)

@sheeps.route("/sheep/get/<ear_tag_id>", methods=["GET"])
def get_sheep_by_id(ear_tag_id):
    return controllers.get_sheep_by_id(request, ear_tag_id)

@sheeps.route("/sheep/get", methods=["GET"])
def get_sheeps() -> Response:
    return controllers.get_sheeps(request)

@sheeps.route("/sheep/update", methods=["POST"])
def sheep_update() -> Response:
    return controllers.sheep_update(request)

@sheeps.route("/sheep/delete/<ear_tag_id>", methods=["DELETE"])
def sheep_delete(ear_tag_id):
    return controllers.sheep_delete(request, ear_tag_id)

# @sheeps.route("/deactivate/<ear_tag_id>", methods=["GET"])
# def sheep_deactivate(ear_tag_id):
#         return controllers.sheep_deactivate(request, ear_tag_id)
