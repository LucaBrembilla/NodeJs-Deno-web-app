import { Router, Context, Bson } from "../deps.ts";
import { admin } from "../middleware/admin.ts";
import { auth } from "../middleware/auth.ts";
import { validateArtist } from "../models/artist.ts";
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
		
		if( ! await auth(ctx) )
			return;
		
		if( ! await admin(ctx) )
			return;

		const artist = {
			alias: alias,
			real_name: real_name,
			real_surname: real_surname,
			band: band,
			__v: 0
		};

		if(!validateArtist(artist)){
			ctx.response.status = 400;
			ctx.response.body = "You typed incorrect JSON";
			return;
		}

		await artistsCollection.insertOne(artist);
		ctx.response.status = 200;
		ctx.response.body = artist;
	})
	.put("/:id", async ( ctx: Context ) => {
		const { value } = await ctx.request.body();
		const { alias, real_name, real_surname, band } = await value;
		const str = ctx.request.url.pathname.split("/")[3];
		
		if( ! await auth(ctx) )
			return;
		
		try { 
			let _id = Bson.ObjectId.createFromHexString(str);
			let artist = await artistsCollection.findOne({ _id });
			if(!artist) throw new Error("Artist not found");

			let version = artist.__v +1;

			if(!validateArtist( { alias, real_name, real_surname, band, __v: version } )){
				ctx.response.status = 400;
				ctx.response.body = "You typed incorrect JSON";
				return;
			}

			await artistsCollection.replaceOne( 
				{ _id },
				{ _id, alias, real_name, real_surname, band, __v : version }
			);
			artist = await artistsCollection.findOne({_id});
			ctx.response.body = artist;
			ctx.response.status = 200;
		}catch{
			ctx.response.status = 404;
			ctx.response.body = "The artist with the given ID was not found.";
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
			const artist = await artistsCollection.findOne( { _id });
			if(!artist) throw new Error("Artist not found");
			await artistsCollection.deleteOne( { _id });
			ctx.response.body = artist;
			ctx.response.status = 200;
		}catch{
			ctx.response.status = 404;
			ctx.response.body = "The artist with the given ID was not found.";
		}
	})
;
export default routerArtists;