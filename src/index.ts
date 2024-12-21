import {Hono} from 'hono'
import {userController} from "./controller/user-controller";
import {HTTPException} from "hono/http-exception";
import {ResponseUtils} from "./utils/response-utils";
import {ZodError} from "zod";
import {RouteCollector} from "./utils/route-utils";

const app = new Hono()

const routes: { method: string; path: string }[] = [];

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.route('/api', userController)

app.onError(async (err, c) => {
    if (err instanceof HTTPException) {
        c.status(err.status);
        return c.json(ResponseUtils.error(err.message));

    } else if (err instanceof ZodError) {
        c.status(400);
        return c.json(ResponseUtils.error(err.message));

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
