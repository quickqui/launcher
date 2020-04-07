export { dockerLaunch, modelServerConfig } from "./DockerLauncher";

export { filterObject, noEnvFound } from "./Util";
import { model } from "./Model";

import { withImplementationModel } from "@quick-qui/model-defines";
import _ from "lodash";
import { rawLaunch } from "./RawLauncher";
import { dockerLaunch } from "./DockerLauncher";
import { env } from "./Env";

//TODO 这个方式有没有价值？何时使用？
//NOTE 本地launch，从../model-server起一个model-server子进程。
export function launch() {
  model.then(m => {
    const implementationModel = withImplementationModel(m)?.implementationModel;
    // const globalEnv = implementationModel?.env ?? {};
    const launcherImplementation = implementationModel?.implementations.find(
      implementation =>
        implementation.runtime === "launcher" &&
        (env.launcherName ? implementation.name === env.launcherName : true)
    );
    if (launcherImplementation) {
      if (launcherImplementation.parameters?.["type"] === "raw") {
        rawLaunch(launcherImplementation, implementationModel!);
      } else if (launcherImplementation.parameters?.["type"] === "docker") {
        dockerLaunch(launcherImplementation, implementationModel!);
      } else {
        throw new Error(
          `launcher type is not supported yet - ${launcherImplementation.parameters?.["type"]}`
        );
      }
    } else {
      throw new Error("no launcher implementation found");
    }
  });
}
