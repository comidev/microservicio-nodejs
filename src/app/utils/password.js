const passwordEncoder = require("bcrypt");
const SAL_ROUND = 10;

const encrypt = async (password) => {
    const passwordEncrypt = await passwordEncoder.hash(password, SAL_ROUND);
    return passwordEncrypt;
};

const comparePlainWithEncrypted = async (text, encryptedText) => {
    const isEqual = await passwordEncoder.compare(text, encryptedText);
    return isEqual;
};

module.exports = { encrypt, comparePlainWithEncrypted };
