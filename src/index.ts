import { model } from "./Model";
import { withImplementationModel } from "@quick-qui/model-defines";
import { command } from "./Command";
import { docker } from "./Docker";

model.then(m => {
  withImplementationModel(m)?.implementationModel?.implementations?.forEach(
    implementation => {
      if (implementation.runtime === "command") {
        command(implementation);
      }
      if (implementation.runtime === "docker") {
        docker(implementation);
      }
      //TODO 添加其他runtime -  docker
      //TODO 是否有package形式的implement？
    }
  );
});
