const dbApi = require('../api/dbApi');

exports.getAnswersAndFeedbacksByAssignmentId = async (assignmentId) => {
    if (!assignmentId) {
        throw new Error(`assignment ${assignmentId} must be defined.`);
    }
    return await dbApi.getAnswersAndFeedbacksByAssignmentId(assignmentId);
};
