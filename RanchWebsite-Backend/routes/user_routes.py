import controllers
from flask import request, Response, Blueprint

users = Blueprint('users', __name__)

@users.route("/user/add", methods=["POST"])
def user_add() -> Response:
    return controllers.user_add(request)

@users.route("/user/update", methods=["POST"])
def user_update() -> Response:
    return controllers.user_update(request)

@users.route("/user/get", methods=["GET"])
def users_get_all() -> Response:
    return controllers.users_get_all(request)

@users.route("/user/get/<user_id>", methods=["GET"])
def user_get_by_id(user_id) -> Response:
    return controllers.user_get_by_id(request, user_id)

@users.route("/user/get/me", methods=["GET"])
def user_get_from_auth_token() -> Response:
    return controllers.user_get_from_auth_token(request)

@users.route("/user/get/organization/<org_id>", methods=["GET"])
def users_get_by_org_id(org_id) -> Response:
    return controllers.users_get_by_org_id(request, org_id)

@users.route("/user/delete/<user_id>", methods=["DELETE"])
def user_delete(user_id) -> Response:
    return controllers.user_delete(request, user_id)

@users.route("/user/activate/<user_id>", methods=["PUT"])
def user_activate(user_id) -> Response:
    return controllers.user_activate(request, user_id)

@users.route("/user/deactivate/<user_id>", methods=["PUT"])
def user_deactivate(user_id) -> Response:
        return controllers.user_deactivate(request, user_id)

@users.route("/user/search/<search_term>")
def users_get_by_search(search_term, internal_call=False, p_auth_info=None) -> Response:
    return controllers.users_get_by_search(request, search_term, internal_call, p_auth_info)