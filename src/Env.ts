import { filterObject, no } from "./Util";
export const env: {
  // modelUrl: string;
  modelPath: string;
  modelServerPort: number;
} = (() => {
  const defaults = {
    modelServerPort: 1111
  };
  return Object.assign(
    {},
    defaults,
    filterObject({
      // modelUrl: process.env.MODEL_URL ?? no("MODEL_URL"),
      modelPath: process.env.MODEL_PATH ?? no("MODEL_PATH"),
      modelServerPort:
        (process.env.MODEL_SERVER_PORT &&
          parseInt(process.env.MODEL_SERVER_PORT)) ||
        (process.env.PORT && parseInt(process.env.PORT))
    })
  );
})();
