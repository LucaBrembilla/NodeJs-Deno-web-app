import { Router, Context, Bson, hashSync, compareSync, create, genSaltSync, getNumericDate } from "../deps.ts";
import { usersCollection } from "../startup/db.ts";
import { key } from "../config/key.ts";

const routerUsers = new Router;

routerUsers

	// Registering new user:
	.post("/", async (ctx: Context) => {
		const { value } = await ctx.request.body();
    const { name, email, password } = await value;

		let user = await usersCollection.findOne({ email })
		if(user) {
			ctx.response.status = 422;
			ctx.response.body = {message: "User already registered"};
			return;
		}

		const salt = await genSaltSync(8);
		const hashedPassword = hashSync(password, salt);
		const newUser = { name, email, password: hashedPassword, isAdmin: false, __v: 0};
		const _id = await usersCollection.insertOne(newUser);

		const payload = {
			_id: _id,
			isAdmin: newUser.isAdmin,
			iat: getNumericDate(Date.now())
		};
		const token = await create({ alg: "HS256", typ: "JWT" }, payload, key);

		ctx.response.status = 200;
		ctx.response.body = { _id, name, email };
		ctx.response.headers.set("x-auth-token", token);
	})
;

export default routerUsers;