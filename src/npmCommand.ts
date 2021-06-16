import { StringKeyObject } from "@quick-qui/model-defines";
import { Implementation } from "@quick-qui/implementation-model";

import { CommandConfig } from "./Command";
import _ from "lodash";
import path from "path";
import { log } from "./Util";

export function npmCommand(
  implementation: Implementation,
  globalEnv: StringKeyObject,
  modelFolder: string
): CommandConfig {
  const packageName: string = implementation.parameters?.["packageName"]!;
  const command = implementation.parameters?.["command"] ?? "npm";
  const args: string[] = implementation.parameters?.["args"] ?? [];
  const overrideEnv = { MODEL_PATH: path.resolve(".", modelFolder) };
  const env = _.extend(
    {},
    { IMPLEMENTATION_NAME: implementation.name },
    //TODO 目前是不加区别的加上这一个，显然，非create-react-app不需要。
    { REACT_APP_IMPLEMENTATION_NAME: implementation.name },
    //TODO 算是写死的一个，只有某种型号的implementation才是对的，应该是有这个implementation自己处理。
    //在buildhook里面set
    //在launcher里面读取？
    //跨phase的传递，scope是implementation，但builder/launcher是否要提供这个服务？
    { BUILT_PATH: path.resolve(".", "build") },
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
}
