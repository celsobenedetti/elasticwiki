# github.com/casey/just
alias eu := elastic-up
alias ed := elastic-down
alias cc := copy-certs
alias i := index
alias di := delete-index

# run elastic cluster containers
elastic-up:
	docker compose -f ./elasticsearch/elastic-cluster.yml up -d

# down elastic cluster containers
elastic-down arg="":
	docker compose -f ./elasticsearch/elastic-cluster.yml down {{ arg }}

# copy ca certs from elastic container to ./certs/
copy-certs:
    rm -rf certs
    docker cp elasticsearch-es01-1:/usr/share/elasticsearch/config/certs/ca certs

# create index with mapping and bulk ingest wiki.json
index:
    python3 elasticsearch/build_index.py --cert certs/ca.crt

# delete index
delete-index endpoint="wikipedia":
    curl -XDELETE --cacert certs/ca.crt -u $ELASTIC_USER:$ELASTIC_PASSWORD $ELASTIC_HOST/{{ endpoint }}

# curl index
get endpoint="wikipedia":
    curl --cacert certs/ca.crt -u $ELASTIC_USER:$ELASTIC_PASSWORD $ELASTIC_HOST/{{ endpoint }}?pretty=true
