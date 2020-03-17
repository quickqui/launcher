import { ImplementationModel, Implementation } from "@quick-qui/model-defines";
import { command } from "./Command";

export function launch(
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
