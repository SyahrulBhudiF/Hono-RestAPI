import {describe, it, expect, beforeEach, afterEach} from "bun:test";
import {ContactTest, UserTest} from "./test-util";
import {ContactService} from "../service/contact-service";
import app from "../index";
import {logger} from "../application/logging";

describe('POST /api/contacts', async () => {
    beforeEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should rejected if contact is invalid', async () => {
        const response = await app.request('/api/contacts', {
            method: 'POST',
            headers: {
                'Authorization': `test`
            },
            body: JSON.stringify({
                'first_name': '',
            })
        })

        expect(response.status).toBe(400);
        const body = await response.json();
        logger.debug(body);

        expect(body.message).toBeDefined();
    });

    it('should be rejected if token is not valid', async () => {
        const response = await app.request('/api/contacts', {
            method: 'POST',
            headers: {
                'Authorization': `invalid`
            },
            body: JSON.stringify({
                'first_name': 'test',
            })
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        logger.debug(body);

        expect(body.message).toBeDefined();
    });

    it('should success if contact is valid (first_name)', async () => {
        const response = await app.request('/api/contacts', {
            method: 'POST',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                'first_name': 'test',
            })
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug(body);

        expect(body.data).toBeDefined();
    });

    it('should success if contact is valid (full data)', async () => {
        const response = await app.request('/api/contacts', {
            method: 'POST',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                'first_name': 'test',
                'last_name': 'test',
                'email': 'test@gmail.com',
                'phone': '08123456789',
            })
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        logger.debug(body);

        expect(body.data).toBeDefined();
    });
});

describe('GEt /api/contacts/{id}', () => {

    beforeEach(async () => {
        await ContactTest.deleteAll()
        await UserTest.create()
        await ContactTest.create()
    })

    afterEach(async () => {
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it('should get 404 if contact is not found', async () => {
        const contact = await ContactTest.get()

        const response = await app.request('/api/contacts/' + (contact.id + 1), {
            method: 'get',
            headers: {
                'Authorization': 'test'
            }
        })

        expect(response.status).toBe(404)
    });

    it('should success if contact is exists', async () => {
        const contact = await ContactTest.get()
        console.log(contact)

        const response = await app.request('/api/contacts/' + contact.id, {
            method: 'get',
            headers: {
                'Authorization': 'test'
            }
        })

        expect(response.status).toBe(200)

        const body = await response.json()
    });
})

describe('PUT /api/contacts/{id}', () => {

    beforeEach(async () => {
        await ContactTest.deleteAll()
        await UserTest.create()
        await ContactTest.create()
    })

    afterEach(async () => {
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it('should rejected update contact if request is invalid', async () => {
        const contact = await ContactTest.get()

        const response = await app.request('/api/contacts/' + contact.id, {
            method: 'put',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                first_name: ""
            })
        })

        expect(response.status).toBe(400)

        const body = await response.json()
        expect(body.message).toBeDefined()
    });

    it('should rejected update contact if id is not found', async () => {
        const contact = await ContactTest.get()

        const response = await app.request('/api/contacts/' + (contact.id + 1), {
            method: 'put',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                first_name: "Budi"
            })
        })

        expect(response.status).toBe(404)

        const body = await response.json()
        expect(body.message).toBeDefined()
    });

    it('should success update contact if request is valid', async () => {
        const contact = await ContactTest.get()

        const response = await app.request('/api/contacts/' + contact.id, {
            method: 'put',
            headers: {
                'Authorization': 'test'
            },
            body: JSON.stringify({
                first_name: "Budi",
                last_name: "Ferdi",
                email: "user@gmail.com",
                phone: "1231234"
            })
        })

        expect(response.status).toBe(200)

        const body = await response.json()
        expect(body.data).toBeDefined()
        expect(body.data.first_name).toBe("Budi")
        expect(body.data.last_name).toBe("Ferdi")
        expect(body.data.email).toBe("user@gmail.com")
        expect(body.data.phone).toBe("1231234")
    });

});
