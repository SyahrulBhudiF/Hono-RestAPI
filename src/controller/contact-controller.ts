import {Hono} from "hono";
import {ApplicationVariables} from "../model/app-model";
import {authMiddleware} from "../middleware/auth-middleware";
import {User} from "@prisma/client";
import {CreateContactRequest, UpdateContactRequest} from "../model/contact-model";
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

contactController.get('/:id', async (c) => {
    const user = c.get('user') as User;
    const id = Number(c.req.param('id'));
    const response = await ContactService.get(user, id);

    return c.json(ResponseUtils.success(response));
});

contactController.put('/:id', async (c) => {
    const user = c.get('user') as User;
    const id = Number(c.req.param('id'));
    const request = await c.req.json() as UpdateContactRequest;
    request.id = id;

    const response = await ContactService.update(user, request);

    return c.json(ResponseUtils.success(response, 'Contact updated successfully'));
});