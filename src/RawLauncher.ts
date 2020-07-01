import { ImplementationModel, Implementation } from "@quick-qui/model-defines";
import { command, CommandConfig, runCommand } from "./Command";
import _ from "lodash";
import path from "path";
export function rawLaunch(
  launcherImplementation: Implementation,
  implementationModel: ImplementationModel
) {
  const launcherEnv = launcherImplementation.env ?? {};
  const launch = launcherImplementation.parameters?.["launch"];

  const commandConfigs = [
    modelServerConfig(launcherImplementation),
    ...launch
      ?.map((launchName) => {
        const implementation = implementationModel?.implementations?.find(
          (imp) => imp.name === launchName
        );
        if (implementation && implementation.runtime === "command") {
          return command(
            implementation,
            launcherEnv,
            launcherImplementation.parameters?.["quickqui_base"]
          );
        } else {
          return undefined;
        }
      })
      .filter((_) => _ !== undefined),
  ];
  commandConfigs.forEach(runCommand);
}

function modelServerConfig(
  launcherImplementation: Implementation
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
        PORT: "1111",
        MODEL_PATH: `${launcherImplementation.env?.["MODEL_PATH"]}`,
      },
      process.env,
      { PATH: process.env.PATH }
    ),
  };
}
