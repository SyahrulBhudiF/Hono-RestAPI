export class ResponseUtils {
    /*
    * This method is used to return a success response
    * @param data: Array<any> | Object | null
    * @param message: string
    * @return object
    *
    * using with c.json in Hono
    * */
    static success(data: Array<any> | Object | null, message: string = 'Success', paging: any = undefined): object {
        return {
            status: 'success',
            message,
            data,
            paging
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
    static error(message: any, status: any = 'error'): object {
        return {
            status,
            message,
            data: null
        };
    }
}