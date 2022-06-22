import { Bson } from "../deps.ts";

export interface AlbumSchema {
  _id: Bson.ObjectId,
  title: string,
	artist: Array<{ _id: Bson.ObjectId, alias: String }>,
	genre: Array<{ _id: Bson.ObjectId, name: String }>,
	songs: Array<{ _id: Bson.ObjectId, title: String }>,
	releaseDate: Date,
	numberOfSongs: number,
	__v: number
}

export function validateInputAlbum(albumInput: {title: String, artistId: Array<String>, genreId: Array<String>, songId: Array<String>, releaseDate: String, numberOfSongs: number }){
  if( albumInput.title === null || albumInput.title === undefined || typeof albumInput.title !== "string" || albumInput.title.length<1 || albumInput.title.length>50 )
		return false;
	
	if (!Array.isArray(albumInput.artistId) || !Array.isArray(albumInput.genreId) || !Array.isArray(albumInput.songId))
		return false;

	if( albumInput.releaseDate === null || albumInput.releaseDate === undefined || typeof albumInput.releaseDate !== "string" )
		return false;

	if ( albumInput.numberOfSongs )
		if ( albumInput.numberOfSongs === null || albumInput.numberOfSongs === undefined || typeof albumInput.numberOfSongs !== "number" )
			return false;

  return true;
} 

