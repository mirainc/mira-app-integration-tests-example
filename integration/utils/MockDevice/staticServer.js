import Koa from "koa";
import serve from "koa-static";
import path from "path";

const staticServer = pathname => {
  const app = new Koa();
  app.use(serve(path.resolve(process.cwd(), pathname)));
  return app;
};

export default staticServer;
