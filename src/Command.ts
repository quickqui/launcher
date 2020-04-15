import { Implementation, StringKeyObject } from "@quick-qui/model-defines";
import { spawn } from "child_process";
import path from "path";
import _ from "lodash";
import exitHook from "async-exit-hook";
import { log } from "./Util";

export const command = (
  implementation: Implementation,
  globalEnv: StringKeyObject
) => {
  const p: string = implementation.parameters?.["path"] ?? ".";
  const command = implementation.parameters?.["command"] ?? "npm";
  const args: string[] = implementation.parameters?.["args"] ?? [];
  const env = implementation.env ?? {};
  const absolutePath = path.resolve(".", p);

  log(absolutePath)
  log(command)
  log( args);
  const commandProcess = spawn(command, args, {
    cwd: absolutePath,
    stdio: "inherit",
    env: _.extend({}, process.env, { PATH: process.env.PATH }, globalEnv, env)
  });
  exitHook(() => {
    log.info("killing command process...");
    commandProcess?.kill();
    log.info(" command process killed");
  });
};
