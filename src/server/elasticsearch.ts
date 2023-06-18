import { Client } from "@elastic/elasticsearch";
import { readFileSync } from "fs";

const cwd = process.cwd();

export const elasticClient = new Client({
  auth: {
    username: process.env.ELASTIC_USER || "",
    password: process.env.ELASTIC_PASSWORD || "",
  },
  tls: {
    ca: readFileSync(`${cwd}/ca.crt`),
  },
  node: process.env.ELASTIC_HOST,
});
