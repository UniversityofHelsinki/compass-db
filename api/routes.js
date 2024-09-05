const answers = require("../services/answers.js");

const router = (router) => {
    router.get('/hello', (req, res) => {
        res.json({message: 'Hello, world!'});
    });

    router.post('/saveanswer', answers.insertanswer);

    /*router.post('/saveanswer', (req, res) => {
        answers.insertanswer(null, null);
        let answer = req.body
        res.json([{message: 'Answer stored!'}]);
    });*/
};

export default router;
