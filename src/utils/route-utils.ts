import {Hono} from "hono";

export class RouteCollector {
    private static routes = new Set<string>()

    static collect(app: Hono) {
        const routePatterns = app.routes.map(route => ({
            method: route.method,
            path: route.path,
        }))

        routePatterns.forEach(({method, path}) => {
            this.routes.add(`${method} ${path}`)
        })
    }

    static getRoutes() {
        return Array.from(this.routes).sort()
    }
}