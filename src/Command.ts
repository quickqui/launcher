import { Implementation, StringKeyObject } from "@quick-qui/model-defines";
import { spawn } from "child_process";
import path from "path";
import _ from "lodash";
export const command = (
  implementation: Implementation,
  globalEnv: StringKeyObject
) => {
  const p: string = implementation.parameters?.["path"] ?? ".";
  const command = implementation.parameters?.["command"] ?? "npm";
  const args: string[] = implementation.parameters?.["args"] ?? [];
  const env = implementation.env ?? {};
  const absolutePath = path.resolve(".", p);

  console.log(absolutePath, command, args);
  spawn(command, args, {
    cwd: absolutePath,
    stdio: "inherit",
    env: _.extend({ PATH: process.env.PATH }, globalEnv, env)
  });
};
