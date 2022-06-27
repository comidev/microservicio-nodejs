const error404 = (req, res, next) => {
    res.status(404);
    res.send({
        error: "404 - NOT_FOUND",
        message: "Esta ruta no esta registrada :(",
        path: `${req.method} - ${req.url}`,
    });
};

module.exports = { error404 };
