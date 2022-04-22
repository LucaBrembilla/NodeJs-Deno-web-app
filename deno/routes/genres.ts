import { Router, Context } from "../deps.ts";
import { genresCollection } from "../startup/db.ts";

const routerGenres = new Router;

routerGenres
	.get("/", async (ctx: Context) =>{
		let genres = await genresCollection.find({ name: { $ne: "" } }).toArray();
		ctx.response.body = genres;
		ctx.response.status = 200;
	})
;

export default routerGenres;