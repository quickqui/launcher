import {
  ImplementationModel,
  Implementation,
  withImplementationModel,
} from "@quick-qui/model-defines";
import { command, CommandConfig, runCommand } from "./Command";
import _ from "lodash";
import path from "path";
import { notNil } from "@quick-qui/util";
import { waitModel } from "./waitModel";
import { evaluate } from "./evaluate";
export async function rawLaunch(
  launcherImplementation: Implementation,
  evaluateContext: object
) {
  const launch = launcherImplementation.parameters?.["launch"];
  const launcherEnv = launcherImplementation.env ?? {};
  const port = evaluateContext["modelServerPort"] ?? launcherEnv["PORT"];
  const launcherImplementationConfig = modelServerConfig(
    launcherImplementation,
    port
  );
  runCommand(launcherImplementationConfig);
  const model = await waitModel(port);

  const implementationModel: ImplementationModel = (
    await evaluate(
      withImplementationModel(model)?.implementationModel,
      evaluateContext
    )
  )[0] as ImplementationModel;
  if (implementationModel) {
    const commandConfigs = launch
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
      .filter(notNil);

    commandConfigs.forEach(runCommand);
  }
}

function modelServerConfig(
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
