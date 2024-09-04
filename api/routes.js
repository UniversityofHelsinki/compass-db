const router = (router) => {
    router.get('/hello', (req, res) => {
        res.json({message: 'Hello, world!'});
    });

    router.post('/saveanswer', (req, res) => {
        let answer = req.body;
        res.json([{message: 'Answer stored!'}]);
    });
};

export default router;
