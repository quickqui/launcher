import {
  ImplementationModel,
  Implementation,
  StringKeyObject,
} from "@quick-qui/model-defines";
import { CommandConfig, runCommand } from "./Command";
import _ from "lodash";
import path from "path";
import { log } from "./Util";
import { sync } from "./DevSupport";
export function devNpmLaunch(
  launcherImplementation: Implementation,
  implementationModel: ImplementationModel
) {
  const launcherEnv = launcherImplementation.env ?? {};
  const launch = launcherImplementation.parameters?.["launch"];

  const commandConfigs = [
    modelServerConfig(launcherImplementation),
    ...launch
      ?.map((launchName) => {
        const implementation = implementationModel?.implementations?.find(
          (imp) => imp.name === launchName
        );
        if (implementation && implementation.runtime === "command") {
          return npmCommand(implementation, launcherEnv);
        } else {
          return undefined;
        }
      })
      .filter((_) => _ !== undefined),
  ];
  // console.log(commandConfigs)
  commandConfigs.forEach(runCommand);
  // start up sync

  sync(
    path.resolve(process.env.DEV_MODEL_PATH!, "model"),
    path.resolve(".", "modelDirCopy/model"),
  );
  sync(
    path.resolve(process.env.DEV_MODEL_PATH!,'dist'),
    path.resolve(".", "modelDirCopy/dist")
  );
}

function modelServerConfig(
  launcherImplementation: Implementation
): CommandConfig {
  const modelServerPackageName = "@quick-qui/model-server";
  const serverPath = path.resolve(
    ".",
    `node_modules/${modelServerPackageName}`
  );
  return {
    absolutePath: path.resolve(".", serverPath!),
    command: "npm",
    args: ["start"],
    env: _.extend(
      {
        PORT: "1111",
        //
        MODEL_PATH: path.resolve(".", "./modelDirCopy"),
      },
      process.env,
      { PATH: process.env.PATH }
    ),
  };
}

export const npmCommand = (
  implementation: Implementation,
  globalEnv: StringKeyObject
): CommandConfig => {
  const packageName: string = implementation.parameters?.["packageName"]!;
  const command = implementation.parameters?.["command"] ?? "npm";
  const args: string[] = implementation.parameters?.["args"] ?? [];
  const overrideEnv = { MODEL_PATH: path.resolve(".", "./modelDirCopy") };
  const env = _.extend(
    {},
    { IMPLEMENTATION_NAME: implementation.name },
    //TODO 目前是不加区别的加上这一个，显然，非create-react-app不需要。
    { REACT_APP_IMPLEMENTATION_NAME: implementation.name },
    implementation.env ?? {}
  );
  const absolutePath = path.resolve(".", `node_modules/${packageName}`);
  const finalEnv = _.extend(
    {},
    process.env,
    { PATH: process.env.PATH },
    globalEnv,
    env,
    overrideEnv
  ) as NodeJS.ProcessEnv;

  log.debug(JSON.stringify(finalEnv, undefined, 2));
  return {
    absolutePath,
    args,
    command,
    env: finalEnv,
  };
};
