import {z, ZodType} from 'zod';


export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(4).max(100),
        password: z.string().min(8).max(100),
        name: z.string().min(4).max(100),
    })

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(4).max(100),
        password: z.string().min(8).max(100),
    })

    static readonly TOKEN: ZodType = z.string().min(4).max(100);
}