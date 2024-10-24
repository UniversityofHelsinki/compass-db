const { describe, beforeEach, it, expect } = require('@jest/globals');
const dbApi = require('../api/dbApi'); // Adjust the path to your `dbApi` module
const { addUser } = require('../services/users'); // Adjust the path to your `users` module

const messageKeys = {
    USER_ADDED: 'user-added',
    ERROR_MESSAGE_FAILED_TO_ADD_USER: 'error-failed-to-add-user',
};

// Mock external dependencies
jest.mock('../api/dbApi');
jest.mock('../logger');

describe('addUser', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                eppn: 'john@university.edu',
                eduPersonAffiliation: ['student', 'alumni'],
            },
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        jest.clearAllMocks();
    });

    it('should add user and roles successfully', async () => {
        const userId = 1;

        // Mocking dbApi responses
        dbApi.userExist.mockResolvedValue(false);
        dbApi.addUser.mockResolvedValue(userId);
        dbApi.getUserId.mockResolvedValue(userId);
        dbApi.getUserRoles.mockResolvedValue([]);
        dbApi.adduserRole.mockResolvedValue({});
        dbApi.removeUserRole.mockResolvedValue({});

        // Call the function to test
        await addUser(req, res);

        // Assertions to verify correct behavior
        expect(dbApi.userExist).toHaveBeenCalledWith('john@university.edu');
        expect(dbApi.addUser).toHaveBeenCalledWith('john@university.edu');
        expect(dbApi.adduserRole).toHaveBeenNthCalledWith(1, userId, 'student');
        expect(dbApi.adduserRole).toHaveBeenNthCalledWith(2, userId, 'alumni');
        expect(res.json).toHaveBeenCalledWith({ message: messageKeys.USER_ADDED });
    });
});
