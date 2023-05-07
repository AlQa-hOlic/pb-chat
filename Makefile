THIS_FILE := $(lastword $(MAKEFILE_LIST))

help: # Show help for Makefile commands
	@grep -E '^[a-zA-Z0-9 -_]+:.*#' $(THIS_FILE)
ps: # List all services
	@docker compose ps -a
up: # Start docker services
	@docker compose up -d
down: # Stop docker services
	@docker compose down --remove-orphans
restart: # Restart docker services
	@docker compose stop $(c)
	@docker compose up -d $(c)
web_dev: # Run socket.io dev server
	@yarn workspace web dev
socket_server_dev: # Run web dev server
	@yarn workspace socket-server dev

.default: help