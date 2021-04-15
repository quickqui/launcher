import { fail } from "assert";
import { spawn, spawnSync } from "child_process";
import path from "path";
import {logging} from '@quick-qui/util'

export function filterObject(obj: any) {
  const ret: any = {};
  Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .forEach((key) => (ret[key] = obj[key]));
  return ret;
}

export function noEnvFound(name: string, help?: string) {
  fail(`env not found - ${name} - ${help ?? ""}`);
}

export const log = logging("quick-qui:launcher");

export function childProcess(
  command: string,
  args: string[],
  cwd?: string,
  stdinString?: string
) {
  const child = spawn(command, args, {
    cwd: cwd ?? path.resolve(process.cwd()),
    stdio: "inherit",
  });
  if (stdinString) {
    child.stdin?.write(stdinString);
    child.stdin?.end();
  }

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);
  return child;
}
export function childProcessSync(
  command: string,
  args: string[],
  cwd?: string,
  stdinString?: string
) {
  const done = spawnSync(
    command,
    args,
    filterObject({
      cwd: cwd ?? path.resolve(process.cwd()),
      input: stdinString,
    })
  );
  return done;
}
