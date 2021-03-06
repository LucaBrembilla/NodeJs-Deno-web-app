import { MongoClient } from "../deps.ts";
import { GenreSchema } from "../models/genre.ts";
import { ArtistSchema } from "../models/artist.ts";
import { SongSchema } from "../models/song.ts";
import { AlbumSchema } from "../models/album.ts";
import { UserSchema } from "../models/user.ts";

const client = new MongoClient();

await client.connect("mongodb://127.0.0.1:27017")
	.then( () => console.log("Connected to MongoDB...") )
	.catch( (err) => { console.log("Could not connect to MongoDB..."); });

const db = client.database("musicAPI");

export const genresCollection = db.collection<GenreSchema>("genres");
export const artistsCollection = db.collection<ArtistSchema>("artists");
export const songsCollection = db.collection<SongSchema>("songs");
export const albumsCollection = db.collection<AlbumSchema>("albums");
export const usersCollection = db.collection<UserSchema>("users");