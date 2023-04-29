"""
HEALTHCHECK Script
Perform HTTP requests against the API /status endpoint, as Docker healthchecks

Example usage: python heathcheck.py
"""

import os
import sys
import urllib.request
import urllib.error

try:
    from chat_api.config import config
except ModuleNotFoundError:
    sys.path.append(os.getcwd())
    from chat_api.config import config


def healthcheck():
    try:
        with urllib.request.urlopen(
            f"http://localhost:{config.port}/status"
        ) as response:
            code = response.getcode()
            text = response.read().decode()
            print(f"Healthcheck response ({code}): {text}")
            exit(0)
    except urllib.error.URLError as ex:
        print(f"Healthcheck failed ({ex})")
        exit(1)


if __name__ == "__main__":
    healthcheck()
