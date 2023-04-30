import logging
from fastapi import APIRouter
from fastapi.responses import PlainTextResponse


from chat_api.db import database
from chat_api.models import User
from sqlalchemy import select

log = logging.getLogger("chat_api.api.core")
router = APIRouter()


@router.get("/status", description="Get API status.")
async def get_status():
    await database.execute(select(User).where(User.id == 1))
    return PlainTextResponse(status_code=200, content="OK")
