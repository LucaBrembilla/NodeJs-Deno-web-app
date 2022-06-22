import {
	Router,
	Context
} from "../deps.ts";
import routerGenres from "../routes/genres.ts";
import routerArtists from "../routes/artists.ts";
import routerSongs from "../routes/songs.ts";
import routerAlbums from "../routes/albums.ts";
import routerUsers from "../routes/users.ts";
import routerAuth from "../routes/auth.ts";

const router = new Router();

router
	.get("/", (ctx : Context) => {
		ctx.response.body = "Questa è la pagina iniziale!";
	})
;

router.use("/api/genres", routerGenres.routes());
router.use("/api/artists", routerArtists.routes());
router.use("/api/songs", routerSongs.routes());
router.use("/api/albums", routerAlbums.routes());
router.use("/api/users", routerUsers.routes())
router.use("/api/auth", routerAuth.routes());

export default router;