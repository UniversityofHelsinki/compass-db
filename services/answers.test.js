const { describe, test, expect, beforeEach } = require("@jest/globals");
const supertest = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const dbApi = require('../api/dbApi');
const { saveAnswer } = require('../services/answers');

jest.mock('../api/dbApi');
jest.mock('../logger');

const app = express();
app.use(bodyParser.json());
app.post('/saveAnswer', saveAnswer);

describe('saveAnswer function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('successfully saves an answer', async () => {
        const mockAnswer = {
            user_name: 'testuser',
            course_id: 'CS101',
            value: 'Test Answer',
            order_nbr: 1,
            assignment_id: 1
        };

        dbApi.saveAnswer.mockResolvedValue(mockAnswer);

        const response = await supertest(app)
            .post('/saveAnswer')
            .send(mockAnswer)
            .expect(200);

        expect(response.body).toEqual(mockAnswer);
        expect(dbApi.saveAnswer).toHaveBeenCalledWith(mockAnswer);
    });
});
