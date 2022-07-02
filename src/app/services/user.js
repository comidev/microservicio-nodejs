const { HttpStatus, HttpError } = require("../middleware/handleError");

const passwordService = require("../utils/password");
const jwtService = require("../utils/jwt");
const ROLES = require("../utils/roles");

const customerRepo = require("./model/mongodb/customer");
const userRepo = require("./model/mongodb/user");
const roleRepo = require("./model/mongodb/role");

const findByUsername = async (username) =>
    await userRepo.findOne({ username: username });

const hasEmptySpaces = (string) => {
    return string.includes(" ");
};

const saveUserWithRole = async (user, roleName) => {
    const { username: usernameReq, password: passwordReq } = user;
    if (hasEmptySpaces(usernameReq) || hasEmptySpaces(passwordReq)) {
        const message = `El username y/o password presentan espacios vacios!`;
        throw HttpError(HttpStatus.BAD_REQUEST, message);
    }

    if (await findByUsername(usernameReq)) {
        const message = `El username '${usernameReq}' ya existe!`;
        throw HttpError(HttpStatus.CONFLICT, message);
    }

    const role =
        (await roleRepo.findOne({ name: roleName })) ||
        (await roleRepo.create({ name: roleName }));

    const password = await passwordService.encrypt(passwordReq);

    return await userRepo.create({
        username: usernameReq,
        password: password,
        roles: [{ _id: role._id }],
    });
};

const findById = async (id) => {
    let userDB;
    try {
        userDB = await userRepo.findById(id);
    } catch (e) {
        throw HttpError(HttpStatus.NOT_FOUND, e.message);
    }
    if (!userDB) {
        throw HttpError(HttpStatus.NOT_FOUND, `User no encontrado!`);
    }
    return userDB;
};

module.exports = {
    login: async (user) => {
        const { username: usernameOrEmail, password: passwordReq } = user;
        if (hasEmptySpaces(usernameOrEmail) || hasEmptySpaces(passwordReq)) {
            const message = `El username y/o password presentan espacios vacios!`;
            throw HttpError(HttpStatus.BAD_REQUEST, message);
        }

        let userDB = await findByUsername(usernameOrEmail);
        if (!userDB) {
            // ? Username o Id ?
            const customerDB = await customerRepo
                .findOne({ email: usernameOrEmail })
                .populate("user");
            if (!customerDB) {
                const message = `Username o password incorrecto!`;
                throw HttpError(HttpStatus.FORBBIDEN, message);
            }
            const { user } = customerDB;
            userDB = await findByUsername(user.username);
            if (!userDB) {
                const message = `Username o password incorrecto!`;
                throw HttpError(HttpStatus.FORBBIDEN, message);
            }
        }

        const passwordIsCorrect = await passwordService.comparePlainWithEncrypted(
            passwordReq,
            userDB.password
        );

        if (!passwordIsCorrect) {
            const message = `Username o Password ${passwordReq} DB: ${userDB.password} incorrecto!`;
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

    existsUsername: async (username) => {
        const exists = Boolean(await findByUsername(username));
        return { exists };
    },

    saveCliente: async (user) => await saveUserWithRole(user, ROLES.CLIENTE),

    saveAdmin: async (user) => await saveUserWithRole(user, ROLES.ADMIN),

    findAll: async () =>
        await userRepo.find({}).populate("roles", { name: 1, _id: 0 }),

    findById,
    authInfo: async (token) => {
        const { id: userId, username } = jwtService.verify(token);
        const {
            _id: customerId,
            photoUrl,
            name,
        } = await customerRepo.findOne({ user: userId });
        return { photoUrl, customerId, username, name };
    },
    tokenRefresh: (tokenRefresh) => {
        const { id, username, roles } = jwtService.verify(tokenRefresh);
        return jwtService.createTokens({ id, username, roles });
    },
    updateUsername: async (username, userId) => {
        try {
            await userRepo.findByIdAndUpdate(userId, { username: username });
        } catch (e) {
            throw HttpError(HttpStatus.NOT_FOUND, e.message);
        }
    },
    updatePassword: async (currentPassword, newPassword, userId) => {
        const userDB = await findById(userId);
        const passwordIsCorrect = await passwordService.comparePlainWithEncrypted(
            currentPassword,
            userDB.password
        );
        if (!passwordIsCorrect) {
            const message = `EL password es incorrecto!!`;
            throw HttpError(HttpStatus.UNAUTHORIZED, message);
        }
        const password = await passwordService.encrypt(newPassword);
        await userRepo.findByIdAndUpdate(userId, { password });
    },
};
