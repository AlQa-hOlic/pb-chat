import uvicorn
from fastapi import FastAPI
from logging import config as logging_config

from chat_api.config import config
from chat_api.routes import TAGS_METADATA, setup_routes
from chat_api.middleware import request_handler
from chat_api.db import database


logging_config.fileConfig("logging.ini")

app = FastAPI(
    title=config.title,
    version=config.version,
    openapi_tags=TAGS_METADATA,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)
app.middleware("http")(request_handler)
setup_routes(app)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


def run():
    """Run the API using Uvicorn"""
    uvicorn.run(app, host=config.host, port=config.port)
