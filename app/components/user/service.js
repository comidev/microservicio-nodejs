const { HttpStatus, HttpError } = require("../../middleware/handleError");
const passwordEncoder = require("bcrypt");
const userRepo = require("./model");
const roleRepo = require("../role/model");
const jwtService = require("../../services/jwt");

const SAL_ROUND = 10;

const ROLES = {
    CLIENTE: "CLIENTE",
    ADMIN: "ADMIN",
};

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
    

    const password = await passwordEncoder.hash(user.password, SAL_ROUND);

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

        const passwordIsCorrect = await passwordEncoder.compare(
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

        console.log({ rolesDB });

        return jwtService.createTokens({
            id: userDB._id,
            username: userDB.username,
            roles: rolesDB,
        });
    },

    saveCliente: async (user) => await saveUserWithRole(user, ROLES.CLIENTE),

    saveAdmin: async (user) => await saveUserWithRole(user, ROLES.ADMIN),

    findAll: async () => await userRepo.find({}),

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
