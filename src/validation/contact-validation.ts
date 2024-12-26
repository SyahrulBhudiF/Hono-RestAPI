import {z, ZodType} from "zod";

export class ContactValidation {
    static readonly CREATE: ZodType = z.object({
        first_name: z.string().min(4).max(100),
        last_name: z.string().min(4).max(100).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(4).max(100).optional(),
    });

    static readonly GET: ZodType = z.number().positive();

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        first_name: z.string().min(4).max(100).optional(),
        last_name: z.string().min(4).max(100).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(4).max(100).optional(),
    });
}