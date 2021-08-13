export {
  dockerLaunch,
  modelServerConfig,
} from "./directors/docker/DockerLauncher";
export { rawLaunch } from "./directors/raw/launch";
export { filterObject, noEnvFound } from "./Util";
import { Implementation } from "@quick-qui/implementation-model";
import { fail } from "assert";
import { npmLaunch } from "./directors/npm/launch";
import { rawLaunch } from "./directors/raw/launch";
import { evaluate } from "./evaluate";

export async function launch(launcherImplementation: Implementation) {
  const launcherType = process.env["LAUNCHER_TYPE"];
  const launcherName = process.env["LAUNCHER_NAME"];

  const [lI, context] = await evaluate(launcherImplementation, {});
  if (lI) {
    // if (launcherType === "docker") {
    //   dockerLaunch(launcherImplementation);
    // } else
    const li = lI as Implementation;
    if (launcherType === "raw") {
      rawLaunch(li, context);
    } else if (launcherType === "npm") {
      npmLaunch(li, context);
    } else if (launcherType === "electron") {
      npmLaunch(li, context);
    } else {
      fail(`launcher type not supported yet - ${launcherType}`);
    }
  } else {
    fail(`no launcher found - name=${launcherName}`);
  }
}
