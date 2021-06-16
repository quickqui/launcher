export { dockerLaunch, modelServerConfig } from "./DockerLauncher";
export { rawLaunch } from "./RawLauncher";
export { filterObject, noEnvFound } from "./Util";
import { fail } from "assert";
import { Implementation } from "@quick-qui/implementation-model";
import { rawLaunch } from "./RawLauncher";
import { evaluate } from "./evaluate";
import { flatNpmLaunch } from "./FlatNpmLauncher";

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
      // } else if (launcherType === "npm") {
      //   npmLaunch(li, context);
      // } else if (launcherType === "devNpm") {
      //   devNpmLaunch(li, context);
    } else if (launcherType === "flatNpm") {
      flatNpmLaunch(li, context);
    } else if (launcherType === "electron") {
      flatNpmLaunch(li, context);
    } else {
      fail(`launcher type not supported yet - ${launcherType}`);
    }
  } else {
    fail(`no launcher found - name=${launcherName}`);
  }
}
