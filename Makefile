COMPOSE_FILE=docker-compose.yml
CONTAINER_ID=$(shell docker compose -f $(COMPOSE_FILE) ps -q app)

.PHONY: up-no-build
up-no-build:
	docker compose -f $(COMPOSE_FILE) up -d

.PHONY: up-build
up-build:
	docker compose -f $(COMPOSE_FILE) up --build -d

.PHONY: down
down:
	docker compose -f $(COMPOSE_FILE) down

.PHONY: restart
restart:
	$(MAKE) down
	$(MAKE) up-build

.PHONY: logs
logs:
	docker logs -f $(CONTAINER_ID)

.PHONY: exec
exec:
	docker exec -it $(CONTAINER_ID) sh 