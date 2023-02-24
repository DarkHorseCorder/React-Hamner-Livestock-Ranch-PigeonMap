import controllers
from flask import request, Response, Blueprint

search = Blueprint('search', __name__)

@search.route("/search/<search_term>")
def get_objects_by_search(search_term) -> Response:
    return controllers.get_objects_by_search(request, search_term)