import { ImplementationModel, Implementation } from "@quick-qui/model-defines";
import { command } from "./Command";
import { docker } from "./Docker";
import _ from "lodash";
import * as yaml from "js-yaml";
import { spawn, execSync } from "child_process";
import path from "path";
import { filterObject } from "./Util";
import exitHook from "async-exit-hook";

export function dockerLaunch(
  launcherImplementation: Implementation,
  implementationModel: ImplementationModel,
  additionalConfigs: any[] = []
) {
  const launcherEnv = launcherImplementation.env ?? {};
  const launch = launcherImplementation.parameters?.["launch"];

  const dockerConfigs = [
    ...additionalConfigs,
    ...launch
      ?.map(launchName => {
        const implementation = implementationModel?.implementations?.find(
          imp => imp.name === launchName
        );
        if (implementation && implementation.runtime === "docker") {
          return docker(implementation, launcherEnv);
        } else {
          return undefined;
        }
      })
      .filter(_ => _ !== undefined)
  ];

  if (dockerConfigs.length > 0) {
    const all: any = {
      version: "3",
      services: {}
      // volumes: {
      //   "app-folder": {}
      // }
    };
    dockerConfigs.forEach(config => {
      all.services[config.service] = filterObject(_.omit(config, "service"));
    });
    console.log(yaml.safeDump(all));

    const configString = yaml.safeDump(all);

    const project = `docker-launcher-${launcherImplementation.name}`;
    const command = "docker-compose";
    const args = ["-f", "-", "-p", project, "up"];
    const absolutePath = path.resolve(".");
    const child = spawn(command, args, {
      cwd: absolutePath
    });

    child.stdin?.write(configString);
    child.stdin?.end();

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    exitHook(() => {
      console.log("shutting down docker-compose...");
      execSync(`docker-compose -f - -p ${project} down`, {
        input: configString
      });
      console.log("docker-compose shut down ");
    });
  }
}
export const modelServerConfig = {
  service: "model-server",
  image: "nielinjie/quickqui-model-server:latest",
  environment: ["MODEL_PATH=/modelProjectDir"],
  volumes: [`${"../model-front"}/:/modelProjectDir`],
  ports: ["1111:1111"]
};