
import { Implementation } from "@quick-qui/implementation-model";
import path from "path";
import _ from "lodash";
import { StringKeyObject } from "@quick-qui/model-defines";
import { CommandConfig } from "../../Command";


export const rawCommand = (
  implementation: Implementation,
  globalEnv: StringKeyObject,
  commonBase?: string
): CommandConfig => {
  const p: string = implementation.parameters?.["path"] ?? ".";
  const command = implementation.parameters?.["command"] ?? "npm";
  const args: string[] = implementation.parameters?.["args"] ?? [];
  const env = _.extend(
    {},
    { IMPLEMENTATION_NAME: implementation.name },
    //TODO 目前是不加区别的加上这一个，显然，非create-react-app不需要。
    { REACT_APP_IMPLEMENTATION_NAME: implementation.name },
    implementation.env ?? {}
  );

  const absolutePath = path.resolve(commonBase ?? ".", p);

  return {
    absolutePath,
    args,
    command,
    env: _.extend({}, process.env, { PATH: process.env.PATH }, globalEnv, env),
    name: implementation.name,
  };
};
