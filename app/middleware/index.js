module.exports.error404 = (req, res, next) => {
    next(createError(404));
};

module.exports.generalErrorHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error");
};
