import mergeOptions from "merge-options";


export function deepMerge<T>(obj: T, source: any): T {
  return mergeOptions.call({ concatArrays: true }, obj, source) as T;
}
