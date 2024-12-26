import {Context, MiddlewareHandler, Next} from "hono";
import {ResponseUtils} from "../utils/response-utils";
import {UserService} from "../service/user-service";

export const authMiddleware: MiddlewareHandler = async (c: Context, next: Next) => {
    const token = c.req.header('Authorization');

    if (!token) {
        return c.json(ResponseUtils.error('Unauthorized', 401));
    }

    const user = await UserService.get(token);

    if (!user) {
        return c.json(ResponseUtils.error('Unauthorized', 401));
    }

    c.set('user', user);

    await next();
}