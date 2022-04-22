import { Router, Context } from "../deps.ts";
import { artistsCollection } from "../startup/db.ts";

const routerArtists = new Router;
routerArtists
	.get("/", async (ctx: Context) =>{
		const artists = await artistsCollection.find({ name: { $ne: "" } }).toArray();
		ctx.response.status = 200;
		ctx.response.body = artists;
	})
	.post("/", async (ctx : Context) => {

	})
;
export default routerArtists;