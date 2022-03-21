import { copy } from "https://deno.land/std@0.103.0/io/util.ts";

const hostname = "127.0.0.1";
const port = Deno.env.get("PORT") || 3000;

const listener = Deno.listen({ hostname, port });
console.log(`Listening on ${hostname}:${port}`);

for await (const conn of listener) {
	console.log("Ciao");
}