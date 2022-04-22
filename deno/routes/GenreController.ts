import { Context } from "../deps.ts";
import { genresCollection } from "../startup/db.ts";

class GenreController {
	async get( ctx: Context ){
		let all_genres = await genresCollection.find({ name: { $ne: "" } }).toArray();
		ctx.response.body = all_genres;
		ctx.response.status = 200;
	}
}

const genreController = new GenreController();
export default genreController;