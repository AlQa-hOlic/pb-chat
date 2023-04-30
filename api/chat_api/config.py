import os
from typing import Optional, Union

import pydantic

ENV_FILE = os.getenv("ENV_FILE", ".env")


class BaseSettings(pydantic.BaseSettings):
    """Base class for loading settings.
    The setting variables are loaded from environment settings first, then from the defined env_file.

    Different groups/contexts of settings are created using different classes, that can define an env_prefix which
    will be concatenated to the start of the variable name."""

    class Config:
        env_file = ENV_FILE


class ChatApiSettings(BaseSettings):
    host: str = "0.0.0.0"
    """Host where the API is run"""

    port: int = 8080
    """Port at which the API is run"""

    title: str = "Chat API"
    """Title of the API"""

    description: Optional[str] = None
    """Description of the API"""

    version: str = "0.0.1"
    """Version of the API"""


class LoggingSettings(BaseSettings):
    """Settings related with the logging"""

    level: str = "DEBUG"
    serialize: bool = False
    file: Union[str, None] = None

    class Config(BaseSettings.Config):
        env_prefix = "LOG_"


config = ChatApiSettings()
log_config = LoggingSettings()
