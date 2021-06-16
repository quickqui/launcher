import { notNil } from "@quick-qui/util";
import {
  Implementation,
  withImplementationModel,
  ImplementationModel,
} from "@quick-qui/implementation-model";
import { runCommand } from "./Command";
import _ from "lodash";
import path from "path";
import { sync } from "./DevSupport";
import { evaluate } from "./evaluate";
import { modelServerConfig } from "./modelServerConfig";
import { npmCommand } from "./npmCommand";
import { waitModel } from "./waitModel";

export async function flatNpmLaunch(
  launcherImplementation: Implementation,
  evaluateContext: object
) {
  const modelFolder = ".";
  const launch = launcherImplementation.parameters?.["launch"];
  const launcherEnv = launcherImplementation.env ?? {};
  const port = evaluateContext["modelServerPort"] ?? launcherEnv["PORT"];
  const launcherImplementationConfig = modelServerConfig(port, modelFolder);
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
          return npmCommand(implementation, launcherEnv, modelFolder);
        } else {
          return undefined;
        }
      })
      .filter(notNil);
    commandConfigs.forEach(runCommand);
    // start up sync
    sync(
      path.resolve(process.env.DEV_MODEL_PATH!, "model"),
      path.resolve(".", modelFolder, "model")
    );
    sync(
      path.resolve(process.env.DEV_MODEL_PATH!, "dist"),
      path.resolve(".", modelFolder, "dist")
    );
  }
}
