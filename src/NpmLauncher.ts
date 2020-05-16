import {
  ImplementationModel,
  Implementation,
  StringKeyObject,
} from "@quick-qui/model-defines";
import { CommandConfig, runCommand } from "./Command";
import _ from "lodash";
import path from "path";
import pkgDir from "pkg-dir";
import { log } from "./Util";
export function npmLaunch(
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
        MODEL_PATH: path.resolve(".", "./modelDir"),
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
  const overrideEnv = { MODEL_PATH: path.resolve(".", "./modelDir") };
  const env = implementation.env ?? {};
  const absolutePath = path.resolve(".", `node_modules/${packageName}`);
  const finalEnv = _.extend(
    {},
    process.env,
    { PATH: process.env.PATH },
    globalEnv,
    env,
    overrideEnv
  ) as NodeJS.ProcessEnv;

  console.log(JSON.stringify(finalEnv,undefined,2));
  return {
    absolutePath,
    args,
    command,
    env: finalEnv,
  };
};
