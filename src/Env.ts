import { filterObject, noEnvFound } from "./Util";
export const env: {
  // modelUrl: string;
  modelPath: string;
  modelServerPort: number;
  launcherName?: string;
} = (() => {
  const defaults = {
    modelServerPort: 1111
  };
  return Object.assign(
    {},
    defaults,
    filterObject({
      // modelUrl: process.env.MODEL_URL ?? no("MODEL_URL"),
      modelPath: process.env.MODEL_PATH ?? noEnvFound("MODEL_PATH"),
      launcherName: process.env.LAUNCHER_NAME,
      modelServerPort:
        (process.env.MODEL_SERVER_PORT &&
          parseInt(process.env.MODEL_SERVER_PORT)) ||
        (process.env.PORT && parseInt(process.env.PORT))
    })
  );
})();
