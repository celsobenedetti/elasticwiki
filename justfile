# github.com/casey/just
alias e := elastic
alias ed := elastic-down

# run elastic cluster containers
elastic:
	docker compose -f ./elasticsearch/elastic-cluster.yml up -d

# down elastic cluster containers
elastic-down:
	docker compose -f ./elasticsearch/elastic-cluster.yml down
