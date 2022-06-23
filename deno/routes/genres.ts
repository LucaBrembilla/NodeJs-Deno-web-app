import { Router, Context, Bson } from "../deps.ts";
import { genresCollection } from "../startup/db.ts";
import { validateGenre } from "../models/genre.ts";
import { auth } from "../middleware/auth.ts";
import { admin } from "../middleware/admin.ts";

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
			__v: 0
		};
		
		if(!validateGenre(genre)){
			ctx.response.status = 400;
			ctx.response.body = "You typed incorrect JSON";
			return;
		}

		if( ! await auth(ctx) )
			return;
		
		if( ! await admin(ctx) )
			return;

		await genresCollection.insertOne(genre);
		ctx.response.status = 200;
		ctx.response.body = genre;
	})
	.put("/:id", async ( ctx: Context ) => {
		const { value } = await ctx.request.body();
		const { name } = await value;
		const str = ctx.request.url.pathname.split("/")[3];

		if( ! await auth(ctx) )
			return;

		try { 
			let _id = Bson.ObjectId.createFromHexString(str);
			let genre = await genresCollection.findOne({ _id });
			if(!genre) throw new Error("Genre not found");

			let version = genre.__v +1;

			if(!validateGenre( { name, __v: version } )){
				ctx.response.status = 400;
				ctx.response.body = "You typed incorrect JSON";
				return;
			}

			await genresCollection.replaceOne( 
				{ _id },
				{ _id, name, __v : version }
			);
			genre = await genresCollection.findOne({_id});
			ctx.response.body = genre;
			ctx.response.status = 200;
		}catch{
			ctx.response.status = 404;
			ctx.response.body = "The genre with the given ID was not found.";
		}
	})

	.delete("/:id", async ( ctx: Context ) => {
		const str = ctx.request.url.pathname.split("/")[3];
		
		if( ! await auth(ctx) )
			return;
		
		if( ! await admin(ctx) )
			return;

		try { 
			const _id = Bson.ObjectId.createFromHexString(str); 
			const genre = await genresCollection.findOne( { _id });
			if(!genre) throw new Error("Genre not found");
			await genresCollection.deleteOne( { _id });
			ctx.response.body = genre;
			ctx.response.status = 200;
		}catch{
			ctx.response.status = 404;
			ctx.response.body = "The genre with the given ID was not found.";
		}
	})
;

export default routerGenres;