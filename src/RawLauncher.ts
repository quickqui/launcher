import { ImplementationModel, Implementation } from "@quick-qui/model-defines";
import { command } from "./Command";
import { EEXIST } from "constants";
import exitHook from "async-exit-hook";

export function rawLaunch(
  launcherImplementation: Implementation,
  implementationModel: ImplementationModel
) {
  const launcherEnv = launcherImplementation.env ?? {};
  const launch = launcherImplementation.parameters?.["launch"];
  launch?.forEach(launchName => {
    const implementation = implementationModel?.implementations?.find(
      imp => imp.name === launchName 
    );
    if (implementation && implementation.runtime === "command") {
      command(implementation, launcherEnv);
    }
  });
}
 