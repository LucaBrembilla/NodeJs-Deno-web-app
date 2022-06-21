import { Bson } from "../deps.ts";

export interface SongSchema {
  _id: Bson.ObjectId,
  title: string,
	artist: Array<{ _id: Bson.ObjectId, alias: String }>,
	genre: Array<{ _id: Bson.ObjectId, name: String }>,
	releaseDate?: Date,
	__v: number
}

export function validateInputSong(songInput: {title: String, artistId: Object, genreId: Array<String>, releaseDate: String }){
  if( songInput.title === null || songInput.title === undefined || typeof songInput.title !== "string" || songInput.title.length<1 || songInput.title.length>50 )
		return false;
	
	if (!Array.isArray(songInput.artistId) || !Array.isArray(songInput.genreId))
		return false;

  if( songInput.releaseDate )
    if( songInput.releaseDate === null || songInput.releaseDate === undefined || typeof songInput.releaseDate !== "string" )
      return false;

  return true;
} 
