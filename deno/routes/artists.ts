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
		const { value } = await ctx.request.body();
		const { alias, real_name, real_surname, band } = await value;
		const artist = {
			alias: alias,
			real_name: real_name,
			real_surname: real_surname,
			band: band,
			_v: 0
		};
		await artistsCollection.insertOne(artist);
		ctx.response.status = 200;
		ctx.response.body = artist;
	})
;
export default routerArtists;