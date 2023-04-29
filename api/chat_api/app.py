import uvicorn
from fastapi import FastAPI


from .config import config
from .routes import TAGS_METADATA, setup_routes
from .middleware import request_handler

app = FastAPI(title=config.title, version=config.version, openapi_tags=TAGS_METADATA)
app.middleware("http")(request_handler)
setup_routes(app)


def run():
    """Run the API using Uvicorn"""
    uvicorn.run(app, host=config.host, port=config.port, log_config="uvicorn_log.ini")
