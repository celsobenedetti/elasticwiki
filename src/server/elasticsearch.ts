import { Client } from "@elastic/elasticsearch";

export const elasticClient = new Client({
  auth: {
    username: process.env.ELASTIC_USER || "",
    password: process.env.ELASTIC_PASSWORD || "",
  },
  tls: {
    ca: process.env.ELASTIC_CERT,
  },
  node: process.env.ELASTIC_HOST,
});
