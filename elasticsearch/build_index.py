import os
import json
import time
import argparse
import tempfile

# pip install elasticsearch
from elasticsearch import Elasticsearch
from elasticsearch import helpers as elastic

required_envs = ["ELASTIC_USER", "ELASTIC_PASS", "ELASTIC_HOST", "ELASTIC_CERT"]


# Setup CLI argument parser and script description
def setupArgParser():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawTextHelpFormatter,
        description=f"""
    Build and populate ES index.
    Reads: {required_envs}
    env variables by default
    """,
    )
    parser.add_argument("--cert", type=str, help="Path to the certificate file.")
    return parser.parse_args()


args = setupArgParser()
start_time = time.time()

user = os.environ.get("ELASTIC_USER") or ""
password = os.environ.get("ELASTIC_PASSWORD") or ""
host = os.environ.get("ELASTIC_HOST") or ""
ca_cert = os.environ.get("ELASTIC_CERT") or ""


def getCertFile():
    # ovewrite cert if cli flag is present
    if args.cert:
        return args.cert

    # Create a temporary file and write the CA certificate to it
    temp_cert_file = tempfile.NamedTemporaryFile(delete=False)
    temp_cert_file.write(ca_cert.encode())
    temp_cert_file.close()
    return temp_cert_file.name


cert_file = getCertFile()

elastic_vars = [user, password, host, cert_file]
missing_envs = [env[1] for env in zip(elastic_vars, required_envs) if env[0] == ""]

if "" in elastic_vars:
    print("Missing required variables(s): ", missing_envs)
    exit(1)

# Create an Elasticsearch client
client = Elasticsearch(ca_certs=cert_file, basic_auth=(user, password), hosts=host)

INDEX = "wikipedia"
BATCH_SIZE = 1000


def run():
    create_index()
    bulk_index()
    print("Took: ", time.time() - start_time)


def create_index():
    with open("elasticsearch/wikipedia_mapping.json") as json_mapping:
        mapping = json.load(json_mapping)
        client.indices.create(index=INDEX, body=mapping)


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
                elastic.bulk(client, bulk)
                bulk = []

        # Execute the remaining bulk indexing requests
        if bulk:
            elastic.bulk(client, bulk)


run()
