import os
import json

# pip install elasticsearch
from elasticsearch import Elasticsearch
from elasticsearch import helpers

user = os.environ.get("ELASTIC_USER") or ""
password = os.environ.get("ELASTIC_PASSWORD") or ""
hosts = os.environ.get("ELASTIC_HOST")

if "" in [user, password, hosts]:
    print("Env: ELASTIC_USER, ELASTIC_PASSWORD and ELASTIC_HOST required")
    exit(1)

# Create an Elasticsearch client
es = Elasticsearch(ca_certs="ca/ca.crt", basic_auth=(user, password), hosts=hosts)

INDEX = "wikipedia"
BATCH_SIZE = 100

with open("elasticsearch/wiki.json") as json_file:
    lines = json_file.readlines()

    bulk = []

    # process two lines at a time
    for i in range(0, len(lines), 2):
        doc = json.loads(lines[i + 1])

        bulk.append(
            {
                "_index": INDEX,
                "_id": i + 1,
                "_source": {
                    "title": doc["title"],
                    "url": doc["url"],
                    "content": doc["content"],
                    # "content.unstemmed": doc["content"],
                    "dt_creation": doc["dt_creation"],
                    "reading_time": doc["reading_time"],
                },
            }
        )

        if len(bulk) == BATCH_SIZE:
            # Execute batch
            response = helpers.bulk(es, bulk)
            # print(response)
            # Clear the list for the next batch
            bulk = []

    # Execute the remaining bulk indexing requests
    if bulk:
        response = helpers.bulk(es, bulk)
