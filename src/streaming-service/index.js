import Koa from "koa";
import Logger from "koa-logger";
import Router from "koa-router";
import BodyParser from "koa-bodyparser";
import Compress from "koa-compress";
import ResponseTime from "koa-response-time";

const app = new Koa();
const router = new Router();

router.get("/", async (ctx, next) => {
  ctx.body = null;
  ctx.status = 200;
  await next();
});

app.use(ResponseTime());
app.use(Logger());
app.use(Compress({
  threshold: 1024
}));
app.use(BodyParser({
  enableTypes: [ "text" ],
  extendTypes: {
    text: [ "text/html" ]
  },
  textLimit: "1mb"
}));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(5801);