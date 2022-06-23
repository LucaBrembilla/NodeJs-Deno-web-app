import { Context, verify } from "../deps.ts";

export async function admin(ctx: Context ){
	if( !ctx.state.user.isAdmin ){
		ctx.response.status = 403;
		ctx.response.body = "Access denied.";
		return false;
	}
	return true;
}