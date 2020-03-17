import { model } from "./Model";
import * as yaml from "js-yaml";

import {
  withImplementationModel,
  withoutAbstract
} from "@quick-qui/model-defines";
import { command } from "./Command";
import { docker } from "./Docker";
import _ from "lodash";
import { launch } from "./RawLauncher";

model.then(m => {
  const implementationModel = withImplementationModel(m)?.implementationModel;
  // const globalEnv = implementationModel?.env ?? {};
  const launcherImplementation = implementationModel?.implementations.find(
    implementation => implementation.runtime === "launcher"
  );
  if (launcherImplementation) {
    if (launcherImplementation.parameters?.["type"] === "raw") {
      launch(launcherImplementation, implementationModel!);
    } else {
      throw new Error("only raw launcher is supported");
    }
  } else {
    throw new Error("no launcher implementation found");
  }

  // const implementations =
  //   withoutAbstract(implementationModel?.implementations) ?? [];
  // implementations
  //   .filter(implementation => implementation.runtime === "command")
  //   .forEach(implementation => command(implementation, globalEnv));
  // const dockerConfigs = implementations
  //   .filter(implementation => implementation.runtime === "docker")
  //   .map(implementation => docker(implementation, globalEnv));
  // if (dockerConfigs.length > 0) {
  //   const all: any = {
  //     version: "3",
  //     services: {},
  //     volumes: {
  //       "app-folder": {}
  //     }
  //   };
  //   dockerConfigs.forEach(config => {
  //     all.services[config.service] = _.omit(config, "service");
  //   });
  //   //TODO 还没有完成呢。
  //   console.log(JSON.stringify(all));
  //   console.log(yaml.safeDump(all));
  // }
});
