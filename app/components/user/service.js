const UserModel = require("./model");

const save = async (user) => {
    // Hasheamos el password
    const userDB = await UserModel.create({
        username: user.username,
        password: user.password,
        roles: user.roles,
    });

    return userDB;
};
