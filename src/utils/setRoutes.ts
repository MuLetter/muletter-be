import { DefaultRoutes } from "types/common";
import { METHODS } from "@routes/common";
import path from "path";
import fs from "fs";

export async function setRoutes(this: DefaultRoutes, dir: string) {
  const routesDir = fs.readdirSync(path.resolve(dir));

  for (let fileName of routesDir) {
    if (fileName.includes(".js")) continue;

    const routesObj = await import(path.resolve(dir, fileName));
    const routes = routesObj.default;

    if (METHODS.includes(fileName)) this.routes.use(routes);
    else {
      const routesPath = "/" + fileName.toLowerCase();
      this.routes.use(routesPath, routes);
    }
  }
}
