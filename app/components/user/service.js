const { HttpStatus, HttpError } = require("../../middleware/handleError");
const passwordEncoder = require("bcrypt");
const userRepo = require("./model");
const roleRepo = require("../role/model");

const ROLES = {
    CLIENTE: "CLIENTE",
    ADMIN: "ADMIN",
};

const SAL_ROUND = 10;

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
        return userDB;
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
};
