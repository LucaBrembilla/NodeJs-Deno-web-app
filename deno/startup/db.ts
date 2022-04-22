import { MongoClient } from "../deps.ts";
import { GenreSchema } from "../models/genre.ts";

const client = new MongoClient();

await client.connect("mongodb://127.0.0.1:27017")
	.then( () => console.log("Connected to MongoDB...") )
	.catch( (err) => { console.log("Could not connect to MongoDB..."); });

const db = client.database("musicAPI");

export const genresCollection = db.collection<GenreSchema>("genres");
export const artistsCollection = db.collection("artists"); 