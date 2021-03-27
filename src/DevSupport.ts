import syncDir from "sync-directory";

export function sync(source: string, target: string) {
  return syncDir(source, target, { watch: true, type: "copy" });
}
