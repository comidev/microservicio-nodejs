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
            res.status(usersDB.length === 0 ? 204 : 200);
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
    existsUsername: async (req, res, next) => {
        try {
            const { username } = req.body;
            const exists = await userService.existsUsername(username);
            res.status(200);
            res.send(exists);
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
    authInfo: async (req, res, next) => {
        try {
            const authorization = req.get("authorization");
            const authInfo = await userService.authInfo(authorization);
            res.status(200);
            res.send(authInfo);
        } catch (error) {
            next(error);
        }
    },
    updatePassword: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { currentPassword, newPassword } = req.body;
            await userService.updatePassword(currentPassword, newPassword, id);
            res.status(200);
            res.send();
        } catch (error) {
            next(error);
        }
    },
};
