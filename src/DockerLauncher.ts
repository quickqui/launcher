import { ImplementationModel, Implementation } from "@quick-qui/implementation-model";
import { docker, ComposeConfig } from "./Docker";
import _ from "lodash";
import * as yaml from "js-yaml";
import { execSync } from "child_process";
import path from "path";
import { filterObject, log, childProcess } from "./Util";
import exitHook from "async-exit-hook";
//TODO 很久没有保持更新，不在主线上？
export function dockerLaunch(
  launcherImplementation: Implementation,
  implementationModel: ImplementationModel
) {
  const launcherEnv = launcherImplementation.env ?? {};


  const launch = launcherImplementation.parameters?.["launch"];

  const dockerConfigs = [
    modelServerConfig(launcherImplementation),
    ...launch
      ?.map((launchName) => {
        const implementation = implementationModel?.implementations?.find(
          (imp) => imp.name === launchName
        );
        if (implementation && implementation.runtime === "docker") {
          return docker(implementation, launcherEnv);
        } else {
          return undefined;
        }
      })
      .filter((_) => _ !== undefined),
  ];

  if (dockerConfigs.length > 0) {
    const all: any = {
      version: "3",
      services: {},
    };
    dockerConfigs.forEach((config) => {
      all.services[config.service] = filterObject(_.omit(config, "service"));
    });
    log.debug(yaml.dump(all));

    const configString = yaml.dump(all);

    const project = `docker-launcher-${launcherImplementation.name}`;
    const command = "docker-compose";
    const args = ["-f", "-", "-p", project, "up"];
    const absolutePath = path.resolve(".");

    childProcess(command, args, absolutePath, configString);

    exitHook(() => {
      log.info("shutting down docker-compose...");
      execSync(`docker-compose -f - -p ${project} down`, {
        input: configString,
      });
      log.info("docker-compose shut down ");
    });
  }
}
export function modelServerConfig(
  launcherImplementation: Implementation
): ComposeConfig {
  return {
    service: "model-server",
    image: "nielinjie/quickqui-model-server:latest",
    environment: ["MODEL_PATH=/modelProjectDir"],
    volumes: [`${launcherImplementation.env?.['MODEL_PATH']}/:/modelProjectDir`],
    ports: [1111],
    links: [],
    depends_on: [],
    stdin_open: false,
  };
}
