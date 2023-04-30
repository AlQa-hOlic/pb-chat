import databases

from chat_api.config import config

database = databases.Database(config.database_url, )
