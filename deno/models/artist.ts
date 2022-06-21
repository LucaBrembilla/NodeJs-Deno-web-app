import { Bson } from "../deps.ts";

export interface ArtistSchema {
  _id: Bson.ObjectId;
  alias: String,
	real_name: String,
	real_surname: String,
	band: String,
  __v: number
}

export function validateArtist(artist: {alias: String, real_name: String, real_surname: String, band: String, __v: number }){
  if( artist.alias === null || artist.alias === undefined || typeof artist.alias !== "string" || artist.alias.length<1 || artist.alias.length>50 )
		return false;
	
  if( artist.real_name )
    if( artist.real_name === null || artist.real_name === undefined || typeof artist.real_name !== "string" || artist.real_name.length<1 || artist.real_name.length>50 )
      return false;
  
  if( artist.real_surname )
    if( artist.real_surname === null || artist.real_surname === undefined || typeof artist.real_surname !== "string" || artist.real_surname.length<1 || artist.real_surname.length>50 )
      return false;
  
  if( artist.band )
    if( artist.band === null || artist.band === undefined || typeof artist.band !== "string" || artist.band.length<1 || artist.band.length>50 )
      return false;

  return true;
}