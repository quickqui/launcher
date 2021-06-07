import {
  ImplementationModel,
  Implementation,
  withImplementationModel,
} from "@quick-qui/model-defines";
import { runCommand } from "./Command";
import { evaluate } from "./evaluate";
import { notNil } from "@quick-qui/util";
import { waitModel } from "./waitModel";
import { npmCommand } from "./npmCommand";
import { modelServerConfig } from "./modelServerConfig";
export async function npmLaunch(
  launcherImplementation: Implementation,
  evaluateContext: object
) {
  const modelFolder = "./modelDir";
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
    // console.log(commandConfigs)
    commandConfigs.forEach(runCommand);
  }
}

