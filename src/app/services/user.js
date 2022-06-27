const { HttpStatus, HttpError } = require("../middleware/handleError");

const passwordService = require("../utils/password");
const jwtService = require("../utils/jwt");
const ROLES = require("../utils/roles");

const userRepo = require("./model/mongodb/user");
const roleRepo = require("./model/mongodb/role");

const findByUsername = async (username) =>
    await userRepo.findOne({ username: username });

const saveUserWithRole = async (user, roleName) => {
    const username = user.username;
    if (await findByUsername(username)) {
        const message = `El username '${username}' ya existe!`;
        throw HttpError(HttpStatus.CONFLICT, message);
    }

    const role =
        (await roleRepo.findOne({ name: roleName })) ||
        (await roleRepo.create({ name: roleName }));

    const password = await passwordService.encrypt(user.password);

    return await userRepo.create({
        username: username,
        password: password,
        roles: [{ _id: role._id }],
    });
};

module.exports = {
    login: async (user) => {
        const userDB = await findByUsername(user.username);
        if (!userDB) {
            const message = `Username '${user.username}' o password incorrecto!`;
            throw HttpError(HttpStatus.FORBBIDEN, message);
        }

        const passwordIsCorrect = await passwordService.comparePlainWithEncrypted(
            user.password,
            userDB.password
        );

        if (!passwordIsCorrect) {
            const message = `Username '${user.username}' o password incorrecto!`;
            throw HttpError(HttpStatus.FORBBIDEN, message);
        }

        const rolesDB = [];
        for (const roles of userDB.roles) {
            const roleDB = await roleRepo.findById(roles);
            rolesDB.push(roleDB.name);
        }

        return jwtService.createTokens({
            id: userDB._id,
            username: userDB.username,
            roles: rolesDB,
        });
    },

    saveCliente: async (user) => await saveUserWithRole(user, ROLES.CLIENTE),

    saveAdmin: async (user) => await saveUserWithRole(user, ROLES.ADMIN),

    findAll: async () =>
        await userRepo.find({}).populate("roles", { name: 1, _id: 0 }),

    findById: async (id) => {
        const userDB = await userRepo.findById(id);
        if (!userDB) {
            throw HttpError(HttpStatus.NOT_FOUND, `User no encontrado!`);
        }
        return userDB;
    },
    tokenRefresh: (tokenRefresh) => {
        const payload = jwtService.verify(tokenRefresh);
        return jwtService.createTokens(payload);
    },
};
