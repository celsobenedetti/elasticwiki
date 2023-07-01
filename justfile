# github.com/casey/just
alias eu := elastic-up
alias ed := elastic-down
alias di := delete-index

# run elastic cluster containers
elastic-up:
	docker compose -f ./elasticsearch/elastic-cluster.yml up -d

# down elastic cluster containers
elastic-down:
	docker compose -f ./elasticsearch/elastic-cluster.yml down

# create index with mapping and bulk ingest wiki.json
index:
    python3 elasticsearch/build_index.py

# delete index
delete-index endpoint="wikipedia":
    curl -XDELETE --cacert ca/ca.crt -u $ELASTIC_USER:$ELASTIC_PASSWORD $ELASTIC_HOST/{{ endpoint }}

# curl index
get endpoint="wikipedia":
    curl --cacert ca/ca.crt -u $ELASTIC_USER:$ELASTIC_PASSWORD $ELASTIC_HOST/{{ endpoint }}?pretty=true
