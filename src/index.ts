export { dockerLaunch, modelServerConfig } from "./DockerLauncher";
export { rawLaunch } from "./RawLauncher";
export { filterObject, noEnvFound } from "./Util";
import { fail } from "assert";
import { Implementation } from "@quick-qui/model-defines";
import { rawLaunch } from "./RawLauncher";
import { npmLaunch } from "./NpmLauncher";
import { devNpmLaunch } from "./DevNpmLauncher";
import { evaluate } from "./evaluate";

export async function launch(launcherImplementation: Implementation) {
  const launcherType = process.env["LAUNCHER_TYPE"];
  const launcherName = process.env["LAUNCHER_NAME"];

  const [lI, context] = await evaluate(launcherImplementation, {});
  if (lI) {
    // if (launcherType === "docker") {
    //   dockerLaunch(launcherImplementation);
    // } else
    if (launcherType === "raw") {
      rawLaunch(lI as Implementation, context);
    } else if (launcherType === "npm") {
      npmLaunch(lI as Implementation, context);
    } else if (launcherType === "devNpm") {
      devNpmLaunch(lI as Implementation, context);
    } else {
      fail(`launcher type not supported yet - ${launcherType}`);
    }
  } else {
    fail(`no launcher found - name=${launcherName}`);
  }
}
