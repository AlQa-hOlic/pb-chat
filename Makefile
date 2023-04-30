THIS_FILE := $(lastword $(MAKEFILE_LIST))

help: # Show help for Makefile commands
	@grep -E '^[a-zA-Z0-9 -]+:.*#' $(THIS_FILE)
ps: # List all services
	@docker compose ps -a
up: # Start docker services
	@docker compose up -d
down: # Stop docker services
	@docker compose down --remove-orphans
restart: # Restart docker services
	@docker compose stop $(c)
	@docker compose up -d $(c)
db-shell: # Connect to psql in 'postgres' service
	@docker compose exec postgres psql -Upostgres

.default: help