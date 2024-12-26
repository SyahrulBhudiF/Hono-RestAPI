import {Context, Hono} from "hono";
import {RegisterUserRequest, UpdateUserRequest} from "../model/user-model";
import {UserService} from "../service/user-service";
import {ResponseUtils} from "../utils/response-utils";
import {ApplicationVariables} from "../model/app-model";
import {User} from "@prisma/client";
import {authMiddleware} from "../middleware/auth-middleware";

export const userController = new Hono<{ Variables: ApplicationVariables }>().basePath('/users');

userController.post('/', async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    const response = await UserService.registerUser(request);

    return c.json(ResponseUtils.success(response, 'User registered successfully'));
});

userController.post('/login', async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    const response = await UserService.login(request);

    return c.json(ResponseUtils.success(response, 'User logged in successfully'));
});

userController.use(authMiddleware);

userController.get('/current', async (c) => {
    const user = c.get('user') as User;

    return c.json(ResponseUtils.success(user));
});

userController.patch('/current', async (c) => {
    const user = c.get('user') as User;
    const request = await c.req.json() as UpdateUserRequest;

    const response = await UserService.update(user, request);

    return c.json(ResponseUtils.success(response, 'User updated successfully'));
});