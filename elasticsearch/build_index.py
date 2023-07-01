import os
import json
import time

# pip install elasticsearch
from elasticsearch import Elasticsearch
from elasticsearch import helpers

start_time = time.time()


user = os.environ.get("ELASTIC_USER") or ""
password = os.environ.get("ELASTIC_PASSWORD") or ""
hosts = os.environ.get("ELASTIC_HOST")
cert = os.environ.get("ELASTIC_CERT") or ""

if "" in [user, password, hosts, cert]:
    print("Env: ELASTIC_USER, ELASTIC_PASSWORD, ELASTIC_HOST, ELASTIC_CERT required")
    exit(1)


# Create an Elasticsearch client
elastic = Elasticsearch(ca_certs=cert, basic_auth=(user, password), hosts=hosts)

INDEX = "wikipedia"
BATCH_SIZE = 1000


def run():
    create_index()
    bulk_index()
    print("Took: ", time.time() - start_time)


def create_index():
    with open("elasticsearch/wikipedia_mapping.json") as json_mapping:
        mapping = json.load(json_mapping)
        elastic.indices.create(index=INDEX, body=mapping)


def bulk_index():
    with open("elasticsearch/wiki.json") as json_bulk:
        lines = json_bulk.readlines()

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
                        "content_unstemmed": doc["content"],
                        "dt_creation": doc["dt_creation"],
                        "reading_time": doc["reading_time"],
                    },
                }
            )

            if len(bulk) == BATCH_SIZE:
                helpers.bulk(elastic, bulk)
                bulk = []

        # Execute the remaining bulk indexing requests
        if bulk:
            helpers.bulk(elastic, bulk)


run()
