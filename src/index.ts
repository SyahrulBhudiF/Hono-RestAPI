import {Hono} from 'hono'
import {userController} from "./controller/user-controller";
import {HTTPException} from "hono/http-exception";
import {ResponseUtils} from "./utils/response-utils";
import {ZodError} from "zod";
import {RouteCollector} from "./utils/route-utils";
import {contactController} from "./controller/contact-controller";

const app = new Hono()
app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.route('/api', userController)
app.route('/api', contactController)

app.onError(async (err, c) => {
    if (err instanceof HTTPException) {
        c.status(err.status);
        return c.json(ResponseUtils.error(err.message));

    } else if (err instanceof ZodError) {
        c.status(400);
        const errors = err.errors.map(error => ({
            field: error.path[0],
            message: error.message
        }));
        return c.json(ResponseUtils.error(errors, "Validation error"));

    } else {
        c.status(500);
        return c.json(ResponseUtils.error('Internal server error'));
    }
})

app.get('/route-list', (c) => {
    RouteCollector.collect(app)
    const routes = RouteCollector.getRoutes()
    const routesTable = routes.join('\n')
    return c.text(`Method Path\n${routesTable}`)
})

export default app
