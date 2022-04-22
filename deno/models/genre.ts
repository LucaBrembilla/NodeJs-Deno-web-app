import { Bson } from "../deps.ts";
export default class Genre{
	public name: string;
	
	constructor({ name = "" }){
		this.name = name;
	}

}
export interface GenreSchema {
  _id: Bson.ObjectId;
  name: string;
}