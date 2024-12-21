import {LoginUserRequest, RegisterUserRequest, toUserResponse, UserResponse} from "../model/user-model";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../application/database";
import {HTTPException} from "hono/http-exception";
import {ResponseUtils} from "../utils/response-utils";
import * as bun from "bun";

export class UserService {
    static async registerUser(request: RegisterUserRequest): Promise<UserResponse> {
        request = UserValidation.REGISTER.parse(request);

        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: request.username
            }
        });

        if (totalUserWithSameUsername > 0) {
            throw new HTTPException(400, {
                res: ResponseUtils.plainError('Username already taken')
            });
        }

        request.password = await bun.password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10
        });

        const user = await prismaClient.user.create({
            data: request
        });

        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        request = UserValidation.LOGIN.parse(request);

        let user = await prismaClient.user.findUnique({
            where: {
                username: request.username
            }
        });

        if (!user) {
            throw new HTTPException(400, {
                res: ResponseUtils.plainError('Username or password is incorrect')
            });
        }

        const isPasswordMatch = await bun.password.verify(request.password, user.password, 'bcrypt');

        if (!isPasswordMatch) {
            throw new HTTPException(400, {
                res: ResponseUtils.plainError('Username or password is incorrect')
            });
        }

        user = await prismaClient.user.update({
            where: {
                username: request.username
            },
            data: {
                token: crypto.randomUUID()
            }
        })

        const response = toUserResponse(user)
        response.token = user.token!;

        return response;
    }
}