start-docker:
	@docker compose up --build -d

restart-docker:
	@docker compose down; docker compose up --build -d

run-migrations-docker:
	@docker compose run backend npx prisma migrate dev

run-migration-docker:
	@docker compose run backend npx prisma migrate dev --name "${message}"

run-generate-docker:
	@docker compose run backend npx prisma generate

prisma-generate:
	@nvm use 16; npx prisma generate; docker compose down; docker compose build; make start-docker