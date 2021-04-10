import {
  evaluateInObject,
  jexlEvaluator,
  DOUBLE_BIG_BRACKET,
} from "@quick-qui/util";
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
          // const re= await getPort({ port: getPort.makeRange(init, init + 100) });
          const re = await portfinder.getPortPromise({
            port: init, // minimum port
            stopPort: init + 100, // maximum port
          });
          // console.log("##############");
          // console.log("port ------" + re);
          // console.log("##############");
          return re;
        },
      },
    ])
  );
}
