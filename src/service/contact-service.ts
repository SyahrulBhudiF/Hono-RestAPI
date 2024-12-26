import {Contact, User} from "@prisma/client";
import {
    ContactResponse,
    CreateContactRequest,
    SearchContactRequest,
    toContactResponse,
    UpdateContactRequest
} from "../model/contact-model";
import {ContactValidation} from "../validation/contact-validation";
import {prismaClient} from "../application/database";
import {HTTPException} from "hono/http-exception";
import {Pageable} from "../model/page-model";

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

    static async delete(user: User, contactId: number): Promise<boolean> {
        contactId = ContactValidation.GET.parse(contactId);

        await this.contactMustExist(user, contactId);

        await prismaClient.contact.delete({
            where: {
                id: contactId,
                username: user.username
            }
        });

        return true;
    }

    static async search(user: User, request: SearchContactRequest): Promise<Pageable<ContactResponse>> {
        request = ContactValidation.SEARCH.parse(request)

        const filters = [];
        if (request.name) {
            filters.push({
                OR: [
                    {
                        first_name: {
                            contains: request.name
                        }
                    },
                    {
                        last_name: {
                            contains: request.name
                        }
                    }
                ]
            })
        }

        if (request.email) {
            filters.push({
                email: {
                    contains: request.email
                }
            })
        }

        if (request.phone) {
            filters.push({
                phone: {
                    contains: request.phone
                }
            })
        }

        const skip = (request.page - 1) * request.size

        const contacts = await prismaClient.contact.findMany({
            where: {
                username: user.username,
                AND: filters
            },
            take: request.size,
            skip: skip
        })

        const total = await prismaClient.contact.count({
            where: {
                username: user.username,
                AND: filters
            }
        })

        return {
            data: contacts.map(contact => toContactResponse(contact)),
            paging: {
                current_page: request.page,
                size: request.size,
                total_page: Math.ceil(total / request.size)
            }
        }
    }
}