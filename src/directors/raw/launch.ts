import {
  ImplementationModel,
  Implementation,
  withImplementationModel,
} from "@quick-qui/implementation-model";
import { runCommand } from "../../Command";
import { rawCommand } from "./RawCommand";
import _ from "lodash";
import { notNil } from "@quick-qui/util";
import { waitModel } from "../../waitModel";
import { modelServerConfig } from "../../actors/modelServer/raw";
import { evaluate } from "../../evaluate";
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
          return rawCommand(
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
