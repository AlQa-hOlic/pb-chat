import logging
from fastapi import Request, Response

from .exceptions.base import BaseAPIException, InternalServerException
from .utils import get_time, get_uuid

log = logging.getLogger("chat_api")


async def request_handler(request: Request, call_next):
    """
    Middleware used by FastAPI to process each request, featuring:

    - Contextualize request logs with an unique Request ID (UUID4) for each unique request.
    - Catch exceptions during the request handling. Translate custom API exceptions into responses,
      or treat (and log) unexpected exceptions.
    """
    start_time = get_time(seconds_precision=False)
    # noinspection PyBroadException
    try:
        response: Response = await call_next(request)

    except BaseAPIException as ex:
        response = ex.response()
        if response.status_code < 500:
            log.info("Request did not succeed due to client-side error", exc_info=ex)
        else:
            log.warning("Request did not succeed due to server-side error", exc_info=ex)

    except Exception as ex:
        log.error("Request failed due to unexpected error", exc_info=ex)
        response = InternalServerException().response()

    end_time = get_time(seconds_precision=False)
    time_elapsed = round(end_time - start_time, 5)
    response.headers["X-Process-Time"] = str(time_elapsed)
    log.info(
        "Request ended url=%s method=%s time_elapsed=%s status=%s",
        request.url,
        request.method,
        time_elapsed,
        response.status_code,
    )
    return response
