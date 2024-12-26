import {prismaClient} from "../application/database";

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
        });
    }
}