import {
	Router,
	Context
} from "../deps.ts";
import genreController from "../routes/GenreController.ts";
const router = new Router();

router
	.get("/", (ctx : Context) => {
		ctx.response.body = "Ciao";
	})
	.get("/api/genres", async (ctx : Context) => {
		await genreController.get(ctx);
	})
;

export default router;