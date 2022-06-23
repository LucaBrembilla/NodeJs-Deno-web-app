import { Router, Context, Bson } from "../deps.ts";
import { admin } from "../middleware/admin.ts";
import { auth } from "../middleware/auth.ts";
import { validateInputAlbum } from "../models/album.ts";
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
		const { title, artistId, genreId, songId, releaseDate, numberOfSongs } = await value;

		if( ! await auth(ctx) )
			return;
		
		if( ! await admin(ctx) )
			return;

		if(!validateInputAlbum({ title, artistId, genreId, songId, releaseDate, numberOfSongs })) {
			ctx.response.status = 400;
			ctx.response.body = "You typed incorrect JSON";
			return;
		}

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
			numberOfSongs: numberOfSongs,
			__v: 0
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
				ctx.response.body = "Invalid song";
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

	.put("/:id", async ( ctx: Context ) => {
		const { value } = await ctx.request.body();
		const { title, artistId, genreId, songId, releaseDate, numberOfSongs } = await value;
		
		if( ! await auth(ctx) )
			return;

		if(!validateInputAlbum({ title, artistId, genreId, songId, releaseDate, numberOfSongs })) {
			ctx.response.status = 400;
			ctx.response.body = "You typed incorrect JSON";
			return;
		}

		const str = ctx.request.url.pathname.split("/")[3];
		try { 
			let _id = Bson.ObjectId.createFromHexString(str);
			let album = await albumsCollection.findOne({ _id });
			if(!album) throw new Error("Album not found");

			album.__v++;
			album.releaseDate = releaseDate;
			album.title = title;
			album.artist = [];
			album.genre = [];
			album.songs = [];

			for(let i = 0; i<genreId.length; i++){
				_id = Bson.ObjectId.createFromHexString(genreId[i]) 
				let genre = await genresCollection.findOne( { _id } );
				if (!genre){
					ctx.response.status = 400;
					ctx.response.body = "Invalid genre";
					return;
				}
				album.genre.push({_id: genre._id, name: genre.name});
			}
			for(let i = 0; i<artistId.length; i++){
				_id = Bson.ObjectId.createFromHexString( artistId[i] );
				let artist = await artistsCollection.findOne( { _id } );
				if (!artist){
					ctx.response.status = 400;
					ctx.response.body = "Invalid artist";
					return;
				}
				album.artist.push({_id: artist._id, alias: artist.alias});
			}
			for(let i = 1; i<songId.length; i++){
				_id = Bson.ObjectId.createFromHexString(songId[i]) 
				let song = await songsCollection.findOne( { _id } );
				if (!song){
					ctx.response.status = 400;
					ctx.response.body = "Invalid song";
					return;
				}
				album.songs.push({_id: song._id, title: song.title });
			}

			await albumsCollection.replaceOne( 
				{ _id: album._id },
				{ _id: album._id, title: album.title, artist: album.artist, genre: album.genre, songs: album.songs, releaseDate, __v: album.__v, numberOfSongs }
			);
			ctx.response.body = album;
			ctx.response.status = 200;
		}catch{
			ctx.response.status = 404;
			ctx.response.body = "The song with the given ID was not found.";
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
			const album = await albumsCollection.findOne( { _id });
			if(!album) throw new Error("Album not found");
			await albumsCollection.deleteOne( { _id });
			ctx.response.body = album;
			ctx.response.status = 200;
		}catch{
			ctx.response.status = 404;
			ctx.response.body = "The album with the given ID was not found.";
		}
	})
;

export default routerAlbums;