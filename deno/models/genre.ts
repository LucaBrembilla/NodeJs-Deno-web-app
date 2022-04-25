import { Bson } from "../deps.ts";
export interface GenreSchema {
  _id: Bson.ObjectId,
  name: string,
	_v: number
}

export function validateGenre(genre: {name: String, _v: number }){
  const name = genre.name;
  if( name === null || name === undefined || typeof name !== "string" || name.length<1 || name.length>50 ){
			return false;
		}
  return true;
}