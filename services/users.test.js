const { describe, beforeEach, it, expect } = require('@jest/globals');
const dbApi = require('../api/dbApi'); // Adjust the path to your `dbApi` module
const { addUser } = require('../services/users');
const { synchronizeUserRoles } = require('./users'); // Adjust the path to your `users` module

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

// Test suite for synchronizeUserRoles
describe('synchronizeUserRoles', () => {
    const userId = 1;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should add missing roles and remove extra roles', async () => {
        // Mocking dbApi responses
        dbApi.getUserRoles.mockResolvedValue([{ role: 'student' }, { role: 'faculty' }]);

        const rolesToSync = ['student', 'alumni'];

        // Mock the roles adding and removing functions
        dbApi.adduserRole.mockResolvedValue({});
        dbApi.removeUserRole.mockResolvedValue({});

        // Call the function to test
        await synchronizeUserRoles(userId, rolesToSync);

        // Assertions to verify correct behavior
        expect(dbApi.getUserRoles).toHaveBeenCalledWith(userId);
        expect(dbApi.adduserRole).toHaveBeenCalledWith(userId, 'alumni');
        expect(dbApi.removeUserRole).toHaveBeenCalledWith(userId, 'faculty');
        expect(dbApi.adduserRole).toHaveBeenCalledTimes(1);
        expect(dbApi.removeUserRole).toHaveBeenCalledTimes(1);
    });

    it('should not add or remove roles if current roles match the desired roles', async () => {
        // Mocking dbApi responses
        dbApi.getUserRoles.mockResolvedValue([{ role: 'student' }, { role: 'alumni' }]);

        const rolesToSync = ['student', 'alumni'];

        // Mock the roles adding and removing functions
        dbApi.adduserRole.mockResolvedValue({});
        dbApi.removeUserRole.mockResolvedValue({});

        // Call the function to test
        await synchronizeUserRoles(userId, rolesToSync);

        // Assertions to verify no unnecessary changes
        expect(dbApi.getUserRoles).toHaveBeenCalledWith(userId);
        expect(dbApi.adduserRole).not.toHaveBeenCalled();
        expect(dbApi.removeUserRole).not.toHaveBeenCalled();
    });

    it('should handle adding all new roles if the user has no roles', async () => {
        // Mocking dbApi responses
        dbApi.getUserRoles.mockResolvedValue([]);

        const rolesToSync = ['student', 'alumni'];

        // Mock the roles adding functions
        dbApi.adduserRole.mockResolvedValue({});
        dbApi.removeUserRole.mockResolvedValue({});

        // Call the function to test
        await synchronizeUserRoles(userId, rolesToSync);

        // Assertions to verify correct role additions
        expect(dbApi.getUserRoles).toHaveBeenCalledWith(userId);
        expect(dbApi.adduserRole).toHaveBeenNthCalledWith(1, userId, 'student');
        expect(dbApi.adduserRole).toHaveBeenNthCalledWith(2, userId, 'alumni');
        expect(dbApi.adduserRole).toHaveBeenCalledTimes(2);
        expect(dbApi.removeUserRole).not.toHaveBeenCalled();
    });

    it('should handle removing all roles if no roles are to be synchronized', async () => {
        // Mocking dbApi responses
        dbApi.getUserRoles.mockResolvedValue([{ role: 'student' }, { role: 'alumni' }]);

        const rolesToSync = [];

        // Mock the roles removing functions
        dbApi.adduserRole.mockResolvedValue({});
        dbApi.removeUserRole.mockResolvedValue({});

        // Call the function to test
        await synchronizeUserRoles(userId, rolesToSync);

        // Assertions to verify correct role removals
        expect(dbApi.getUserRoles).toHaveBeenCalledWith(userId);
        expect(dbApi.removeUserRole).toHaveBeenNthCalledWith(1, userId, 'student');
        expect(dbApi.removeUserRole).toHaveBeenNthCalledWith(2, userId, 'alumni');
        expect(dbApi.removeUserRole).toHaveBeenCalledTimes(2);
        expect(dbApi.adduserRole).not.toHaveBeenCalled();
    });

    it('should gracefully handle errors during role synchronization', async () => {
        // Mocking error scenario
        dbApi.getUserRoles.mockRejectedValue(new Error('Database error'));

        const rolesToSync = ['student', 'alumni'];

        // Call the function to test and catch the error
        await expect(synchronizeUserRoles(userId, rolesToSync)).rejects.toThrow('Database error');

        // Ensure no roles were added or removed due to the error
        expect(dbApi.adduserRole).not.toHaveBeenCalled();
        expect(dbApi.removeUserRole).not.toHaveBeenCalled();
    });
});
