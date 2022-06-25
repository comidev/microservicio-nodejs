const userService = require("./service");

module.exports = {
    login: async (req, res, next) => {
        try {
            const user = req.body;
            const userDB = await userService.login(user);
            res.status(200);
            res.send(userDB);
        } catch (error) {
            next(error);
        }
    },
    saveCliente: async (req, res, next) => {
        try {
            const user = req.body;
            const userDB = await userService.saveCliente(user);
            res.status(201);
            res.send(userDB);
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
};
