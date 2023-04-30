import sys

from loguru import logger

from .config import log_config as config

LoggerFormat = (
    "<green>{time:YY-MM-DD HH:mm:ss.SSS}</green> | "
    "<level>{level: <8}</level> | "
    "<level>{message}</level> <{extra}>"
)

logger.remove()

if config.file != None:
    logger.add(
        open(config.file, "a"),
        level=config.level.upper(),
        format=LoggerFormat,
        serialize=config.serialize,
        enqueue=True,  # process logs in background
        diagnose=False,  # hide variable values in log backtrace
    )
else:
    logger.add(
        sys.stderr,
        level=config.level.upper(),
        format=LoggerFormat,
        serialize=config.serialize,
        enqueue=True,  # process logs in background
        diagnose=False,  # hide variable values in log backtrace
    )
