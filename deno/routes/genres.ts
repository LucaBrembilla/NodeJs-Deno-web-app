import { Router, Context } from "../deps.ts";
import { genresCollection } from "../startup/db.ts";
import { GenreSchema } from "../models/genre.ts";

const routerGenres = new Router;

routerGenres
	.get("/", async (ctx: Context) =>{
		let genres = await genresCollection.find({ name: { $ne: "" } }).toArray();
		ctx.response.body = genres;
		ctx.response.status = 200;
	})
	.post("/", async (ctx: Context) => {
		const { value } = await ctx.request.body();
		const { name } = await value;
		
		const genre = {
			name: name,
			_v: 0
		};
		
		if( name === null || name === undefined || typeof name !== "string" || name.length<1 || name.length>50 ){
			ctx.response.status = 400;
			ctx.response.body = "You typed incorrect JSON";
			return;
		}

		await genresCollection.insertOne(genre);
		ctx.response.status = 200;
		ctx.response.body = genre;
	})
;

export default routerGenres;