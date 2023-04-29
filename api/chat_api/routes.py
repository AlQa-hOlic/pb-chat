from fastapi import FastAPI

from .api import core


def setup_routes(app: FastAPI):
    """
    Each Router specified in routes/* must be referenced in setup_routes(),
    as a new app.include_router() call.
    """
    app.include_router(core.router, prefix="", tags=["core"])


TAGS_METADATA = [
    {"name": "core", "description": "General system endpoints for the API."}
]
