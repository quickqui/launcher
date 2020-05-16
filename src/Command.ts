import { Implementation, StringKeyObject } from "@quick-qui/model-defines";
import { spawn } from "child_process";
import path from "path";
import _ from "lodash";
import exitHook from "async-exit-hook";
import { log } from "./Util";

export const command = (
  implementation: Implementation,
  globalEnv: StringKeyObject
): CommandConfig => {
  const p: string = implementation.parameters?.["path"] ?? ".";
  const command = implementation.parameters?.["command"] ?? "npm";
  const args: string[] = implementation.parameters?.["args"] ?? [];
  const env = implementation.env ?? {};
  const absolutePath = path.resolve(".", p);

  return {
    absolutePath,
    args,
    command,
    env: _.extend({}, process.env, { PATH: process.env.PATH }, globalEnv, env),
  };
};

export interface CommandConfig {
  absolutePath: string;
  command: string;
  args: string[];
  env: NodeJS.ProcessEnv;
}


export function runCommand(config: CommandConfig) {
  const commandProcess = spawn(config.command, config.args, {
    cwd: config.absolutePath,
    stdio: "inherit",
    env: config.env,
  });
  exitHook(() => {
    log.info("killing command process...");
    commandProcess?.kill();
    log.info(" command process killed");
  });
}