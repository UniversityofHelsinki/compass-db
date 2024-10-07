const { adduser } = require('../services/users'); // Adjust the path to your `users` module
const dbApi = require('../api/dbApi'); // Adjust the path to your `dbApi` module
const logger = require('../logger'); // Adjust the path to your `logger` module
const messageKeys = {
    USER_ADDED: 'user-added',
    ERROR_MESSAGE_FAILED_TO_ADD_USER: 'error-failed-to-add-user'
};

// Mock external dependencies
jest.mock('../api/dbApi'); // Mock dbApi module
jest.mock('../logger'); // Mock logger module

describe('adduser', () => {
    let req, res;

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

    it('should add user and roles successfully', async () => {
        const userId = 1;
        dbApi.adduser.mockResolvedValue({ id: userId });
        dbApi.adduserRole.mockResolvedValue({});

        await adduser(req, res);

        expect(dbApi.adduser).toHaveBeenCalledWith('john@university.edu');
        expect(dbApi.adduserRole).toHaveBeenNthCalledWith(1, userId, 'student');
        expect(dbApi.adduserRole).toHaveBeenNthCalledWith(2, userId, 'alumni');
        expect(logger.logger.info).toHaveBeenCalledWith('User and roles added');
        expect(res.json).toHaveBeenCalledWith({ message: messageKeys.USER_ADDED });
    });

    it('should handle errors and send error response', async () => {
        const errorMessage = 'Test Error';
        dbApi.adduser.mockRejectedValueOnce(new Error(errorMessage));

        await adduser(req, res);

        expect(logger.logger.error).toHaveBeenCalledWith('error inserting user');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: messageKeys.ERROR_MESSAGE_FAILED_TO_ADD_USER
        });
    });
});
