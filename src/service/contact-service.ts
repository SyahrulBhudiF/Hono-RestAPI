import {Contact, User} from "@prisma/client";
import {ContactResponse, CreateContactRequest, toContactResponse, UpdateContactRequest} from "../model/contact-model";
import {ContactValidation} from "../validation/contact-validation";
import {prismaClient} from "../application/database";
import {HTTPException} from "hono/http-exception";
import {ResponseUtils} from "../utils/response-utils";

export class ContactService {
    static async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {
        request = ContactValidation.CREATE.parse(request);

        const contact = {
            ...request,
            ...{username: user.username}
        }

        const response = await prismaClient.contact.create({
            data: contact
        });

        return toContactResponse(response);
    }

    static async get(user: User, contactId: number): Promise<ContactResponse> {
        contactId = ContactValidation.GET.parse(contactId);

        const contacts = await this.contactMustExist(user, contactId);

        return toContactResponse(contacts);
    }

    static async contactMustExist(user: User, contactId: number): Promise<Contact> {
        const contact = await prismaClient.contact.findFirst({
            where: {
                id: contactId,
                username: user.username
            }
        });

        if (!contact) {
            throw new HTTPException(404, {
                message: 'Contact not found'
            });
        }

        return contact;
    }

    static async update(user: User, request: UpdateContactRequest): Promise<ContactResponse> {
        request = ContactValidation.UPDATE.parse(request);
        await this.contactMustExist(user, request.id);

        const updatedContact = await prismaClient.contact.update({
            where: {
                id: request.id,
                username: user.username
            },
            data: request
        });

        return toContactResponse(updatedContact);
    }
}