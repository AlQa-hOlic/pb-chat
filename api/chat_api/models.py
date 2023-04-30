from sqlalchemy import Integer, Column, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String)
    password = Column(String)
    is_active = Column(Boolean, server_default="t")
    is_superuser = Column(Boolean, server_default="f")
    is_verified = Column(Boolean, server_default="f")
