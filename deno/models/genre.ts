import { Bson } from "../deps.ts";
export interface GenreSchema {
  _id: Bson.ObjectId,
  name: string,
	_v: number
}