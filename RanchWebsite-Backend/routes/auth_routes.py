import controllers
from flask import request, Response, Blueprint

auth = Blueprint('auth', __name__)

@auth.route("/user/auth", methods=["POST"])
def auth_token_add() -> Response:
    return controllers.auth_token_add(request)

@auth.route("/user/logout", methods=["PUT"])
def auth_token_remove() -> Response:
    return controllers.auth_token_remove(request)

@auth.route("/user/pw_change_request", methods=["POST"])
def pw_change_request() -> Response:
    return controllers.forgot_password.pw_change_request(request)

@auth.route("/user/forgot_password_change", methods=["POST"])
def forgot_password_change() -> Response:
    return controllers.forgot_password.forgot_password_change(request)