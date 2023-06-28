# github.com/casey/just
alias e := elastic-up
alias ed := elastic-down

# run elastic cluster containers
elastic-up:
	docker compose -f ./elasticsearch/elastic-cluster.yml up -d

# down elastic cluster containers
elastic-down:
	docker compose -f ./elasticsearch/elastic-cluster.yml down

get endpoint="wikipedia":
    curl --cacert ca/ca.crt --cert ca/ca.crt --key ca/ca.key -u $ELASTIC_USER:$ELASTIC_PASSWORD $ELASTIC_HOST/{{ endpoint }}?pretty=true
