import path from "path";
import syncDir from "sync-directory";

export function sync(source: string, target: string) {
  return syncDir(source, target, { watch: true, type: "copy" });
}

export function run (modelFolder:string){
    sync(
      path.resolve(process.env.DEV_MODEL_PATH!, "model"),
      path.resolve(".", modelFolder, "model")
    );
    sync(
      path.resolve(process.env.DEV_MODEL_PATH!, "dist"),
      path.resolve(".", modelFolder, "dist")
    );
}