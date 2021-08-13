import exitHook from "async-exit-hook";
import { spawn } from "child_process";
import pm2 from "pm2";
import { log } from "./Util";



export interface CommandConfig {
  absolutePath: string;
  command: string;
  args: string[];
  env: NodeJS.ProcessEnv;
  name?: string;
}

export function runCommand(config: CommandConfig) {
  const commandProcess = spawn(config.command, config.args, {
    cwd: config.absolutePath,
    stdio: "inherit",
    env: config.env,
  });
  exitHook(() => {
    log.info(`killing command process, name - ${config.name}...`);
    commandProcess?.kill();
    log.info(" command process killed");
  });
}

export function runCommandInPm2(config: CommandConfig) {

  pm2.connect(function (err) {
    if (err) {
      log.error(err);
    } else {
      pm2.start(
        {
          script: config.command,
          name: config.name,
          cwd: config.absolutePath,
          args: config.args,
          env: config.env as { [key: string]: string },
        },
        function (err, apps) {
          if (err) {
            log.error(err);
          } else {
            log.info("in start callback");
            log.info(apps);
          }
        }
      );
    }
  });
}
