import { Bson } from "../deps.ts";

export interface ArtistSchema {
  _id: Bson.ObjectId;
  alias: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
	real_name: {
		type: String,
    required: false,
    minlength: 1,
    maxlength: 50
	},
	real_surname: {
		type: String,
    required: false,
    minlength: 1,
    maxlength: 50
	},
	band: {
		type: String,
		required: false,
		minlength: 1,
    maxlength: 50
	}
}