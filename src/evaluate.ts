import { evaluateInObject, jexlEvaluator } from "@quick-qui/util";
import portfinder from "portfinder";
import _ from "lodash";

export async function evaluate(obj, context) {
  return await evaluateInObject(
    obj,
    context,
    jexlEvaluator([
      {
        name: "getPort",
        fun: async (init) => {
          const re = await portfinder.getPortPromise({
            port: init, // minimum port
            stopPort: init + 100, // maximum port
          });
          return re;
        },
      },
    ])
  );
}
