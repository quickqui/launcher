import { Model } from "@quick-qui/model-core";
import { spawn } from "child_process";

import { env } from "./Env";
import axios from "axios";
import path from "path";
import waitPort from 'wait-port'
const modelUrl = `http://localhost:${env.modelServerPort}`;


const params = {
  host: "localhost",
  port: env.modelServerPort
};

const server = spawn("npm", ["start"], {
  cwd: path.resolve(".", "../model-server"),
  stdio: "inherit",
  env: {
    PATH: process.env.PATH,
    MODEL_PATH: env.modelPath,
    PORT: env.modelServerPort + ""
  }
});

export const model: Promise<Model> = waitPort(params).then(_ =>
  axios.get(`${modelUrl}/models/default`).then(_ => _.data)
);



