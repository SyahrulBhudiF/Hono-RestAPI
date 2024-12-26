import {prismaClient} from "../application/database";
import {Contact} from "@prisma/client";

export class UserTest {
    static async create() {
        await prismaClient.user.create({
            data: {
                username: 'test',
                password: await Bun.password.hash('test1111', {algorithm: 'bcrypt', cost: 10}),
                name: 'test',
                token: 'test'
            }
        });
    }

    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: 'test'
            }
        });
    }
}

export class ContactTest {
    static async deleteAll() {
        await prismaClient.contact.deleteMany({
            where: {
                username: 'test'
            }
        })
    }

    static async create() {
        await prismaClient.contact.create({
            data: {
                first_name: "Budi",
                last_name: "Ferdi",
                email: "test@gmail.com",
                phone: "123123",
                username: "test"
            }
        })
    }

    static async createMany(n: number) {
        for (let i = 0; i < n; i++) {
            await this.create()
        }
    }

    static async get(): Promise<Contact> {
        return prismaClient.contact.findFirstOrThrow({
            where: {
                username: "test"
            }
        })
    }

}