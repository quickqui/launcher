import {
  ImplementationModel,
  Implementation,
  StringKeyObject,
  withImplementationModel,
} from "@quick-qui/model-defines";
import { CommandConfig, runCommand } from "./Command";
import _ from "lodash";
import path from "path";
import { log } from "./Util";
import { evaluate } from "./evaluate";
import { notNil } from "@quick-qui/util";
import { waitModel } from "./waitModel";
export async function npmLaunch(
  launcherImplementation: Implementation,
  evaluateContext: object
) {
  const modelFolder = "./modelDir";
  const launch = launcherImplementation.parameters?.["launch"];
  const launcherEnv = launcherImplementation.env ?? {};
  const port = evaluateContext["modelServerPort"] ?? launcherEnv['PORT'];
  const launcherImplementationConfig = modelServerConfig(port, modelFolder);
  runCommand(launcherImplementationConfig);

  const model = await waitModel(port);
  const implementationModel: ImplementationModel = (
    await evaluate(
      withImplementationModel(model)?.implementationModel,
      evaluateContext
    )
  )[0] as ImplementationModel;
  if (implementationModel) {
    const commandConfigs = launch
      ?.map((launchName) => {
        const implementation = implementationModel?.implementations?.find(
          (imp) => imp.name === launchName
        );
        if (implementation && implementation.runtime === "command") {
          return npmCommand(implementation, launcherEnv, modelFolder);
        } else {
          return undefined;
        }
      })
      .filter(notNil);
    // console.log(commandConfigs)
    commandConfigs.forEach(runCommand);
  }
}
export const npmCommand = (
  implementation: Implementation,
  globalEnv: StringKeyObject,
  modelFolder: string
): CommandConfig => {
  const packageName: string = implementation.parameters?.["packageName"]!;
  const command = implementation.parameters?.["command"] ?? "npm";
  const args: string[] = implementation.parameters?.["args"] ?? [];
  const overrideEnv = { MODEL_PATH: path.resolve(".", modelFolder) };
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

export function modelServerConfig(
  port: number,
  modelFolder: string
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
        PORT: port,
        MODEL_PATH: path.resolve(".", modelFolder),
      },
      process.env,
      { PATH: process.env.PATH }
    ),
  };
}
