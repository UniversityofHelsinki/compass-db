const router = (router) => {
    router.get('/hello', (req, res) => {
        console.log('hello from db');
        res.json({message: 'Hello, world!'});
    });
};

export default router;
