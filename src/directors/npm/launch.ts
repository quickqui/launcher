import { notNil } from "@quick-qui/util";
import {
  Implementation,
  withImplementationModel,
  ImplementationModel,
} from "@quick-qui/implementation-model";
import { runCommandInPm2, runCommand, CommandConfig } from "../../Command";
import _ from "lodash";
import { run } from "../../actors/sync/npm";
import { evaluate } from "../../evaluate";
import { modelServerConfig } from "../../actors/modelServer/npm";
import { npmCommand } from "./npmCommand";
import { waitModel } from "../../waitModel";

export async function npmLaunch(
  launcherImplementation: Implementation,
  evaluateContext: object
) {
  const modelFolder = ".";
  const launch = launcherImplementation.parameters?.["launch"];
  const launcherEnv = launcherImplementation.env ?? {};
  const port = evaluateContext["modelServerPort"] ?? launcherEnv["PORT"];
  const launcherImplementationConfig = modelServerConfig(port, modelFolder);
  let runner: (arg0: CommandConfig) => void;

  if (launcherImplementation.parameters?.["pm"] === "pm2")
    runner = runCommandInPm2;
  else runner = runCommand;
  runner(launcherImplementationConfig);
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
          return npmCommand(implementation, launcherEnv, modelFolder);
        } else {
          return undefined;
        }
      })
      .filter(notNil);
    commandConfigs.forEach(runner);
    // start up sync
    // if have actor sync
    run(modelFolder);
  }
}
