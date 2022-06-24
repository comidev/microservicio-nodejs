const userRepo = require("./model");
const roleRepo = require("../role/model");

const ROLES = {
    CLIENTE: "CLIENTE",
    ADMIN: "ADMIN",
};

const existsUsername = async (username) => (await findByUsername(username)) === null;

const findByUsername = async (username) =>
    await userRepo.findOne({ username: username });

const saveUserWithRole = async (user, roleName) => {
    if (await existsUsername(user.username)) return null;

    const role = await roleRepo.findOne({ name: roleName });
    console.log({ user, role });
    if (!role) {
        role = await roleRepo.create({ name: roleName });
    }

    return await userRepo.create({
        username: user.username,
        password: user.password,
        roles: [{ _id: role._id }], // * TODO: IMPORTANTE
    });
};

module.exports = {
    login: async (user) => {
        const userDB = await findByUsername(user.username);
        if (!userDB) return null;

        if (!user.password === userDB.password) return null;
        // Se le da el TOKEN :v
        return userDB;
    },
    saveCliente: async (user) => await saveUserWithRole(user, ROLES.CLIENTE),
    saveAdmin: async (user) => await saveUserWithRole(user, ROLES.ADMIN),
    findAll: async () => await userRepo.find({}),
    findById: async (id) => await userRepo.findById(id),
};
