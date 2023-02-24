import controllers
from flask import request, Response, Blueprint

images = Blueprint('images', __name__)

@images.route("/receive", methods=["POST"])
def pic_add() -> Response:
    return controllers.image_controller(request)