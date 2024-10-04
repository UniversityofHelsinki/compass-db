const database = require('../services/database.js');

exports.forCourse = async (course) => {
  if (!course) {
    throw new Error(
      `Course is not defined ${course}`
    );
  }

  return await database.execute(
    'course/questions.sql', 
    [course]
  );

};
