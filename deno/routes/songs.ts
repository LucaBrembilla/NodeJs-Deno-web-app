import { Router, Context, Bson } from "../deps.ts";
import { genresCollection, artistsCollection, songsCollection } from "../startup/db.ts";

const routerSongs = new Router;

routerSongs
	.get("/", async (ctx: Context) =>{
		const songs = await songsCollection.find({ name: { $ne: "" } }).toArray();
		ctx.response.body = songs;
		ctx.response.status = 200;
	})

	.post("/", async (ctx: Context) => {
		const { value } = await ctx.request.body();
		const { title, artistId, genreId, releaseDate } = await value;

		let _id = Bson.ObjectId.createFromHexString(genreId[0]);
		let genre = await genresCollection.findOne( { _id } );
		if (!genre){
			ctx.response.status = 400;
			ctx.response.body = "Invalid genre";
			return;
		}

		_id = Bson.ObjectId.createFromHexString( artistId[0] );
		let artist = await artistsCollection.findOne( { _id } );
		if (!artist){
			ctx.response.status = 400;
			ctx.response.body = "Invalid artist";
			return;
		}

		const song = {
			title: title,
			artist: [{
				_id: artist._id,
				alias: artist.alias
			}],
			genre: [{
				_id: genre._id,
				name: genre.name
			}],
			releaseDate: releaseDate,
			_v: 0
		};
		for(let i = 1; i<genreId.length; i++){
			_id = Bson.ObjectId.createFromHexString(genreId[i]!) 
			genre = await genresCollection.findOne( { _id } );
			if (!genre){
				ctx.response.status = 400;
				ctx.response.body = "Invalid genre";
				return;
			}
			song.genre.push({_id: genre._id, name: genre.name});
		}
		for(let i = 1; i<artistId.length; i++){
			_id = Bson.ObjectId.createFromHexString( artistId[i] );
			artist = await artistsCollection.findOne( { _id } );
			if (!artist){
				ctx.response.status = 400;
				ctx.response.body = "Invalid artist";
				return;
			}
			song.artist.push({_id: artist._id, alias: artist.alias});
		}

		await songsCollection.insertOne(song);
		ctx.response.status = 200;
		ctx.response.body = song;
	})

	.get("/:id", async ( ctx : Context ) => {
		const str = ctx.request.url.pathname.split("/")[3];
		try { 
			const _id = Bson.ObjectId.createFromHexString(str); 
			const song = await songsCollection.findOne( { _id } );
			if(!song) throw new Error("Song not found");
			ctx.response.body = song;
			ctx.response.status = 200;
		}catch{
			ctx.response.status = 404;
			ctx.response.body = "The song with the given ID was not found.";
		}
	})

	.put("/:id", async ( ctx: Context ) => {
		const { value } = await ctx.request.body();
		const { title, artistId, genreId, releaseDate } = await value;
		const str = ctx.request.url.pathname.split("/")[3];
		try { 
			let _id = Bson.ObjectId.createFromHexString(str);
			let song = await songsCollection.findOne({ _id });
			if(!song) throw new Error("Song not found");

			console.log(song);
			await songsCollection.replaceOne( 
				{ _id },
				{ _id, title, artist: [], genre: [], releaseDate}
			);
			song = await songsCollection.findOne({_id});

			for(let i = 0; i<genreId.length; i++){
				_id = Bson.ObjectId.createFromHexString(genreId[i]!) 
				let genre = await genresCollection.findOne( { _id } );
				if (!genre){
					ctx.response.status = 400;
					ctx.response.body = "Invalid genre";
					return;
				}
				song!.genre.push({_id: genre._id, name: genre.name});
			}
			for(let i = 0; i<artistId.length; i++){
				_id = Bson.ObjectId.createFromHexString( artistId[i] );
				let artist = await artistsCollection.findOne( { _id } );
				if (!artist){
					ctx.response.status = 400;
					ctx.response.body = "Invalid artist";
					return;
				}
				song!.artist.push({_id: artist._id, alias: artist.alias});
			}
			ctx.response.body = song;
			ctx.response.status = 200;
		}catch{
			ctx.response.status = 404;
			ctx.response.body = "The song with the given ID was not found.";
		}
	})

	.delete("/:id", async ( ctx: Context ) => {
		const str = ctx.request.url.pathname.split("/")[3];
		try { 
			const _id = Bson.ObjectId.createFromHexString(str); 
			const song = await songsCollection.findOne( { _id });
			if(!song) throw new Error("Song not found");
			await songsCollection.deleteOne( { _id });
			ctx.response.body = song;
			ctx.response.status = 200;
		}catch{
			ctx.response.status = 404;
			ctx.response.body = "The song with the given ID was not found.";
		}
	})
;

export default routerSongs;