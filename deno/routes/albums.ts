import { Router, Context, Bson } from "../deps.ts";
import { genresCollection, artistsCollection, songsCollection, albumsCollection } from "../startup/db.ts";

const routerAlbums = new Router;

routerAlbums
	.get("/", async (ctx: Context) =>{
		const albums = await albumsCollection.find({ name: { $ne: "" } }).toArray();
		ctx.response.body = albums;
		ctx.response.status = 200;
	})

	.post("/", async (ctx: Context) => {
		const { value } = await ctx.request.body();
		const { title, artistId, genreId, songId, releaseDate } = await value;

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

		_id = Bson.ObjectId.createFromHexString( songId[0] );
		let song = await songsCollection.findOne( { _id } );
		if (!song){
			ctx.response.status = 400;
			ctx.response.body = "Invalid song";
			return;
		}

		const album = {
			title: title,
			artist: [ { 
				_id: artist._id,
				alias: artist.alias
			} ],
			genre: [ {
				_id: genre._id,
				name: genre.name 
			} ],
			songs: [ { 
				_id: song._id,
				title: song.title
			} ],
			releaseDate: releaseDate,
			_v: 0
		};
		// Genres insertion
		for(let i = 1; i<genreId.length; i++){
			_id = Bson.ObjectId.createFromHexString(genreId[i]) 
			genre = await genresCollection.findOne( { _id } );
			if (!genre){
				ctx.response.status = 400;
				ctx.response.body = "Invalid genre";
				return;
			}
			album.genre.push({_id: genre._id, name: genre.name});
		}
		// Artists insertion
		for(let i = 1; i<artistId.length; i++){
			_id = Bson.ObjectId.createFromHexString(artistId[i]) 
			artist = await artistsCollection.findOne( { _id } );
			if (!artist){
				ctx.response.status = 400;
				ctx.response.body = "Invalid artist";
				return;
			}
			album.artist.push({_id: artist._id, alias: artist.alias});
		}
		// Songs insertion
		for(let i = 1; i<songId.length; i++){
			_id = Bson.ObjectId.createFromHexString(songId[i]) 
			song = await songsCollection.findOne( { _id } );
			if (!song){
				ctx.response.status = 400;
				ctx.response.body = "Invalid genre";
				return;
			}
			album.songs.push({_id: song._id, title: song.title });
		}

		await albumsCollection.insertOne(album);
		ctx.response.status = 200;
		ctx.response.body = album;
	})

	.get("/:id", async ( ctx : Context ) => {
		const str = ctx.request.url.pathname.split("/")[3];
		try { 
			const _id = Bson.ObjectId.createFromHexString(str); 
			const album = await albumsCollection.findOne( { _id } );
			if(!album) throw new Error("album not found");
			ctx.response.body = album;
			ctx.response.status = 200;
		}catch{
			ctx.response.status = 404;
			ctx.response.body = "The album with the given ID was not found.";
		}
	})
;

export default routerAlbums;