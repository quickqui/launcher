import { CommandConfig } from "../../Command";
import _ from "lodash";
import path from "path";

export function modelServerConfig(
  port: number,
  modelFolder: string
): CommandConfig {
  const modelServerPackageName = "@quick-qui/model-server";
  const serverPath = path.resolve(
    ".",
    `node_modules/${modelServerPackageName}`
  );
  return {
    absolutePath: path.resolve(".", serverPath!),
    command: "npm",
    args: ["start"],
    env: _.extend(
      {
        PORT: port,
        MODEL_PATH: path.resolve(".", modelFolder),
      },
      process.env,
      { PATH: process.env.PATH }
    ),
  };
}
