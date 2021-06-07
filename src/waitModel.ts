import waitPort from "wait-port";
import axios from "axios";
import { Model } from "@quick-qui/model-core";
import { log } from "./Util";

export async function waitModel(port: number): Promise<Model> {
  log.debug('port',port)
  return waitPort({
    host: "localhost",
    port,
  }).then((_) =>
    axios.get(`http://localhost:${port}/models/default`).then((_) => _.data)
  );
}
