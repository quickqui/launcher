import { Implementation } from "@quick-qui/implementation-model";
import _ from "lodash";
import path from "path";
import { CommandConfig } from "../../Command";

export function modelServerConfig(
  launcherImplementation: Implementation,
  port: number
): CommandConfig {
  return {
    absolutePath: path.resolve(
      `${launcherImplementation.parameters?.["quickqui_base"] ?? ".."}`,
      `${launcherImplementation.parameters?.["model_server_path"] ?? ""}`
    ),
    command: "npm",
    args: ["start"],
    env: _.extend(
      {
        PORT: port,
        MODEL_PATH: `${launcherImplementation.env?.["MODEL_PATH"]}`,
      },
      process.env,
      { PATH: process.env.PATH }
    ),
  };
}
