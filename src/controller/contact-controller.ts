import {Hono} from "hono";
import {ApplicationVariables} from "../model/app-model";
import {authMiddleware} from "../middleware/auth-middleware";
import {User} from "@prisma/client";
import {CreateContactRequest} from "../model/contact-model";
import {ContactService} from "../service/contact-service";
import {ResponseUtils} from "../utils/response-utils";

export const contactController = new Hono<{ Variables: ApplicationVariables }>().basePath('/contacts');
contactController.use(authMiddleware);

contactController.post('/', async (c) => {
    const user = c.get('user') as User;
    const request = await c.req.json() as CreateContactRequest;
    const response = await ContactService.create(user, request);

    return c.json(ResponseUtils.success(response, 'Contact created successfully'));
});