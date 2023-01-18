module.exports = function validateMiddleWare(req, res, next) {
    console.log(`Request url: ${req.url}, method: ${req.method}`);

    next();
}