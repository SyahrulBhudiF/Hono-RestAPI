import {Hono} from "hono";
import {RegisterUserRequest} from "../model/user-model";
import {UserService} from "../service/user-service";
import {ResponseUtils} from "../utils/response-utils";

export const userController = new Hono().basePath('/users');


userController.post('/', async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    const response = await UserService.registerUser(request);

    return c.json(ResponseUtils.success(response, 'User registered successfully'));
})

userController.post('/login', async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    const response = await UserService.login(request);

    return c.json(ResponseUtils.success(response, 'User logged in successfully'));
})