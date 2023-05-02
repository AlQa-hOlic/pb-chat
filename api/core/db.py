import databases

from core.config import config

database = databases.Database(
    config.database_url,
)
