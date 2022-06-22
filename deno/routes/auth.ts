import { Router, Context, Bson, hashSync, compareSync, create, getNumericDate } from "../deps.ts";
import { usersCollection } from "../startup/db.ts";
import { key } from "../config/key.ts";

const routerAuth = new Router;

routerAuth
	// Authentication of a user:
	.post("/", async (ctx: Context) => {
		const { value } = await ctx.request.body();
    const { email, password } = await value;

		if( !email || !password){
			ctx.response.status = 422;
			ctx.response.body = "Please, provide email and password.";
			return;
		}

		let user = await usersCollection.findOne({ email })
		if(!user) {
			ctx.response.status = 400;
			ctx.response.body = "Invalid email or password";
			return;
		}

		if (!compareSync(password, user.password)){
			ctx.response.status = 400;
			ctx.response.body = "Invalid email or password";
			return;
		}

		const payload = {
			_id: user._id,
			isAdmin: user.isAdmin,
			iat: getNumericDate(Date.now())
		};
		const token = await create({ alg: "HS256", typ: "JWT" }, payload, key);

		ctx.response.status = 200;
		ctx.response.body = { _id: user._id, name: user.name, email: user.email };
		ctx.response.headers.set("x-auth-token", token);
	})
;

export default routerAuth;