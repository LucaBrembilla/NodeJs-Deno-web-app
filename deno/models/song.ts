import { Bson } from "../deps.ts";
import { GenreSchema } from "./genre.ts";
import { ArtistSchema } from "./artist.ts";

export interface SongSchema {
  _id: Bson.ObjectId,
  title: string,
	artist: [ArtistSchema],
	genre: [GenreSchema],
	releaseDate?: Date,
	_v: number
}
