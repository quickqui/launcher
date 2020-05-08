import { ImplementationModel, Implementation } from "@quick-qui/model-defines";
import { command, CommandConfig } from "./Command";
import { spawn } from "child_process";
import _ from "lodash";
import exitHook from "async-exit-hook";
import { log } from "./Util";
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
          return command(implementation, launcherEnv);
        } else {
          return undefined;
        }
      })
      .filter((_) => _ !== undefined),
  ];
  // console.log(commandConfigs)
  commandConfigs.forEach(runCommand);
}

function runCommand(config: CommandConfig) {
  const commandProcess = spawn(config.command, config.args, {
    cwd: config.absolutePath,
    stdio: "inherit",
    env: config.env,
  });
  exitHook(() => {
    log.info("killing command process...");
    commandProcess?.kill();
    log.info(" command process killed");
  });
}

function modelServerConfig(
  launcherImplementation: Implementation
): CommandConfig {
  return {
    absolutePath: path.resolve(
      ".",
      `${launcherImplementation.parameters?.["model_server_path"] ?? ''}`
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
