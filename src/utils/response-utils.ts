export class ResponseUtils {
    /*
    * This method is used to return a success response
    * @param data: Array<any> | Object | null
    * @param message: string
    * @return object
    *
    * using with c.json in Hono
    * */
    static success(data: Array<any> | Object | null, message: string = 'Success'): object {
        return {
            status: 'success',
            message,
            data
        };
    }

    /*
    * This method is used to return an error response
    * @param message: string
    * @param status: number
    * @return object
    *
    * using with c.json in Hono
    * */
    static error(message: string, status: number = 400): object {
        return {
            status: 'error',
            message,
            data: null
        };
    }

    /*
    * This method is used to return an error response
    * @param message: string
    * @param status: number
    * @return Response
    *
    * using with plain response like HTTPException
    * */
    static plainError(message: string, status: number = 400): Response {
        return new Response(
            JSON.stringify({
                status: 'error',
                message,
                data: null
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                status
            }
        );
    }
}