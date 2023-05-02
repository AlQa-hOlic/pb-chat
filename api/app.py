from logging import config as logging_config

import uvicorn
from fastapi import FastAPI

from core.config import config
from core.db import database
from core.middleware import request_handler
from routes import TAGS_METADATA, setup_routes

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


if __name__ == "__main__":
    uvicorn.run("app:app", host=config.host, port=config.port, reload=config.debug)
