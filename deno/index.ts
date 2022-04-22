import { Application } from "./deps.ts";
import router from "./startup/routes.ts";

const app  =  new Application();
const hostname = "127.0.0.1";
const port = Deno.env.get("PORT") || 3000;

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ( {hostname, port} )=> {
	console.log(`Listening on ${hostname || "localhost"}:${port}`);
});
await app.listen({ port: 3000 });
