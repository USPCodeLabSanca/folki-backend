start-docker:
	@docker compose up -d

run-migration-docker:
	@docker compose run backend npx prisma migrate dev --name "${message}"

run-generate-docker:
	@docker compose run backend npx prisma generate

prisma-generate:
	@nvm use 16; npx prisma generate; docker compose down; docker compose build; make start-docker