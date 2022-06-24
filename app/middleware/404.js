const error404 = (req, res, next) => {
    console.log(req);
    res.status(404);
    res.send({
        error: "NOT FOUND",
        message: "Esta ruta no esta registrada :(",
        path: "",
    });
};

module.exports = { error404 };
