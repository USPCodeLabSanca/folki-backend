start-docker:
	@docker compose up -d

run-migration-docker:
	@docker compose run backend npx prisma migrate dev --name "${message}"

run-generate-docker:
	@docker compose run backend npx prisma generate