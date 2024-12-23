import {describe, it, expect, afterEach, beforeEach} from 'bun:test';
import app from "../index";
import {logger} from "../application/logging";
import {UserTest} from "./test-util";

describe('POST /api/users', () => {
    afterEach(async () => {
        await UserTest.delete();
    });

    it('should reject register new user if request is invalid', async () => {
        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username: '',
                password: '',
                name: ''
            })
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(400);
        expect(body.status).toBeDefined();
    });

    it('should reject register new user if username has taken', async () => {
        await UserTest.create();

        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username: 'test',
                password: 'test1111',
                name: 'test'
            })
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(400);
        expect(body.status).toBeDefined();
    });

    it('should register new user success', async () => {
        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username: 'test',
                password: 'test1111',
                name: 'test'
            })
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(200);
        expect(body.data).toBeDefined();
        expect(body.data.username).toBe('test');
        expect(body.data.name).toBe('test');
    });
});

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it('should be able to login', async () => {
        const response = await app.request('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                username: 'test',
                password: 'test1111'
            }),
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(200);
        expect(body.data.token).toBeDefined();
    });

    it('should be rejected if username is wrong', async () => {
        const response = await app.request('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                username: 'test1',
                password: 'test1111'
            }),
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(401);
        expect(body.status).toBeDefined();
    });

    it('should be rejected if password is wrong', async () => {
        const response = await app.request('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                username: 'test',
                password: 'test11111'
            }),
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(401);
        expect(body.status).toBeDefined();
    });
});

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it('should be able to get User', async () => {
        const response = await app.request('/api/users/current', {
            method: 'GET',
            headers: {
                'Authorization': 'test',
            }
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(200);
        expect(body.data).toBeDefined();
    });

    it('should not be able to get User if token is invalid', async () => {
        const response = await app.request('/api/users/current', {
            method: 'GET',
            headers: {
                'Authorization': 'test1',
            }
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(401);
        expect(body.status).toBeDefined();
    });

    it('should not be able to get User there is no token', async () => {
        const response = await app.request('/api/users/current', {
            method: 'GET',
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(401);
        expect(body.status).toBeDefined();
    });
});