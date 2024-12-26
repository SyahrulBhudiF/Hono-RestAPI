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