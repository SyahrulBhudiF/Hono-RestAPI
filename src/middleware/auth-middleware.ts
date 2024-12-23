import {Context, Next} from "hono";
import {ResponseUtils} from "../utils/response-utils";
import {UserService} from "../service/user-service";

export async function authMiddleware(c: Context, next: Next) {
    const token = c.req.header('Authorization');
    if (!token) {
        return c.json(ResponseUtils.error('Authorization header is missing'), 401);
    }

    try {
        const user = await UserService.get(token);
        c.set('user', user);
        await next();
    } catch (error) {
        return c.json(ResponseUtils.error('Unauthorized'), 401);
    }
}