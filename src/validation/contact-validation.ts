import {z, ZodType} from "zod";

export class ContactValidation {
    static readonly CREATE: ZodType = z.object({
        first_name: z.string().min(4).max(100),
        last_name: z.string().min(4).max(100).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(4).max(100).optional(),
    });
}