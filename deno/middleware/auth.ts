import { Context, verify } from "../deps.ts";
import { key } from "../config/key.ts";


export async function auth(ctx: Context ){
	const token = ctx.request.headers.get("x-auth-token");
	if(!token){
		ctx.response.status = 401;
		ctx.response.body = "Access denied. No token provided"
		return false;
	}
	try{
		const decoded = await verify(token, key);
		ctx.state.user = decoded;
		return true;
	}catch (ex){
		ctx.response.status = 401;
		ctx.response.body = "Access denied. Invalid token.";
		return false;
	}
}