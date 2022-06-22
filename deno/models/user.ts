import { Bson } from "../deps.ts";

export interface UserSchema {
  _id: Bson.ObjectId,
  name: string,
	email: string,
	password: string,
	isAdmin: boolean,
	__v: number
}


export function validateUser( user : 
	{ _id: Bson.ObjectId, name: string, email: string, password: string, isAdmin: boolean, __v: number} ) {
		
}