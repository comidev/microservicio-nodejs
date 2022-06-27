const userService = require("../services/user");

module.exports = {
    login: async (req, res, next) => {
        try {
            const user = req.body;
            const tokens = await userService.login(user);
            res.status(200);
            res.send(tokens);
        } catch (error) {
            next(error);
        }
    },
    saveAdmin: async (req, res, next) => {
        try {
            const user = req.body;
            const userDB = await userService.saveAdmin(user);
            res.status(201);
            res.send(userDB);
        } catch (error) {
            next(error);
        }
    },
    findAll: async (req, res, next) => {
        try {
            const usersDB = await userService.findAll();
            res.status(200);
            res.send(usersDB);
        } catch (error) {
            next(error);
        }
    },
    findById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userDB = await userService.findById(id);
            res.status(200);
            res.send(userDB);
        } catch (error) {
            next(error);
        }
    },
    tokenRefresh: (req, res, next) => {
        try {
            const authorization = req.get("authorization");
            const tokens = userService.tokenRefresh(authorization);
            res.status(200);
            res.send(tokens);
        } catch (error) {
            next(error);
        }
    },
};