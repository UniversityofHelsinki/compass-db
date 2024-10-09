const { describe, beforeEach, expect } = require("@jest/globals");
const { adduser } = require('../services/users'); // Adjust the path to your `users` module
const dbApi = require('../api/dbApi'); // Adjust the path to your `dbApi` module
const logger = require('../logger'); // Adjust the path to your `logger` module

/**
 * Object containing key-value pairs for various message identifiers used in the application.
 *
 * Properties:
 * - USER_ADDED: Represents the key for a message indicating a user has been successfully added.
 * - ERROR_MESSAGE_FAILED_TO_ADD_USER: Represents the key for a message indicating failure to add the user.
 *
 * @type {{USER_ADDED: string, ERROR_MESSAGE_FAILED_TO_ADD_USER: string}}
 */
const messageKeys = {
    USER_ADDED: 'user-added',
    ERROR_MESSAGE_FAILED_TO_ADD_USER: 'error-failed-to-add-user'
};

// Mock external dependencies
jest.mock('../api/dbApi'); // Mock dbApi module
jest.mock('../logger'); // Mock logger module

describe('adduser', () => {
    let req, res;

    /**
     * Reset and initialize common objects and mocks before each test.
     */
    beforeEach(() => {
        req = {
            body: {
                eppn: 'john@university.edu',
                eduPersonAffiliation: 'student;alumni'
            }
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        // Ensuring the clearAllMocks is correctly placed
        jest.clearAllMocks();
    });

    /**
     * Test if a user and their roles can be added successfully.
     */
    it('should add user and roles successfully', async () => {
        const userId = 1;
        // Mocking dbApi responses
        dbApi.adduser.mockResolvedValue({ id: userId });
        dbApi.adduserRole.mockResolvedValue({});

        // Call the function to test
        await adduser(req, res);

        // Assertions to verify correct behavior
        expect(dbApi.adduser).toHaveBeenCalledWith('john@university.edu');
        expect(dbApi.adduserRole).toHaveBeenNthCalledWith(1, userId, 'student');
        expect(dbApi.adduserRole).toHaveBeenNthCalledWith(2, userId, 'alumni');
        expect(logger.logger.info).toHaveBeenCalledWith('User and roles added');
        expect(res.json).toHaveBeenCalledWith({ message: messageKeys.USER_ADDED });
    });

    /**
     * Test error handling and response when user addition fails.
     */
    it('should handle errors and send error response', async () => {
        const errorMessage = 'Test Error';
        // Mocking dbApi to throw an error
        dbApi.adduser.mockRejectedValueOnce(new Error(errorMessage));

        // Call the function to test
        await adduser(req, res);

        // Assertions to verify error handling behavior
        expect(logger.logger.error).toHaveBeenCalledWith('error inserting user');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_USER
        });
    });
});
