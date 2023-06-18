elastic:
	docker compose -f ./elasticsearch/elastic-cluster.yml up -d

elastic-down:
	docker compose -f ./elasticsearch/elastic-cluster.yml down
