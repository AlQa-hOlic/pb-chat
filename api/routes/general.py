import logging

from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
from sqlalchemy import select

from core.db import database
from models import User

log = logging.getLogger("chat_api.routes.general")
router = APIRouter()


@router.get("/status", description="Get API status.")
async def get_status():
    user = await database.execute(select(User).where(User.id == 1))
    log.debug(user)
    return PlainTextResponse(status_code=200, content="OK")
