import controllers
from flask import request, Response, Blueprint

orgs = Blueprint('orgs', __name__)

@orgs.route("/organization/add", methods=["POST"])
def organization_add() -> Response:
    return controllers.organization_add(request)

@orgs.route("/organization/update", methods=["POST"])
def organization_update() -> Response:
    return controllers.organization_update(request)

@orgs.route("/organization/get")
def organizations_get_all() -> Response:
    return controllers.organizations_get(request)

@orgs.route("/organization/get/<org_id>")
def organization_get_by_id(org_id) -> Response:
    return controllers.organization_get_by_id(request, org_id)

@orgs.route("/organization/delete/<org_id>", methods=["DELETE"])
def organization_delete_by_id(org_id) -> Response:
    return controllers.organization_delete_by_id(request, org_id)

@orgs.route("/organization/activate/<org_id>", methods=["PUT"])
def organization_activate_by_id(org_id) -> Response:
    return controllers.organization_activate_by_id(request, org_id)

@orgs.route("/organization/deactivate/<org_id>", methods=["PUT"])
def organization_deactivate_by_id(org_id) -> Response:
    return controllers.organization_deactivate_by_id(request, org_id)
    
@orgs.route("/organization/search/<search_term>")
def organization_get_by_search(search_term, internal_call=False, p_auth_info=None) -> Response:
     return controllers.organization_get_by_search(request, search_term, internal_call, p_auth_info)