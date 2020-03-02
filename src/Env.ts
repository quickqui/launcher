import { filterObject, no } from "./Util";
export const env: {
  modelUrl: string;
} = (() => {
  const defaults = {};
  return Object.assign(
    {},
    defaults,
    filterObject({
      modelUrl: process.env.MODEL_URL ?? no("MODEL_URL")
    })
  );
})();
