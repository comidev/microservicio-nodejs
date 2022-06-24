const customerRepo = require("./model");
const userService = require("../user/service");
const regionRepo = require("../region/model");

const existsByDni = async (dni) => {
    return (await customerRepo.findOne({ dni: dni })) !== null;
};

const existsByEmail = async (email) => {
    return (await customerRepo.findOne({ email: email })) !== null;
};

module.exports = {
    save: async (customer) => {
        const customerInvalid =
            (await existsByDni(customer.dni)) ||
            (await existsByEmail(customer.email));
        if (customerInvalid) {
            return null;
        }

        const regionId = await regionRepo.findOne({ name: regionName });
        if (!regionId) {
            return null;
        }

        const userId = await userService.saveCliente(customer.user);
        if (!userId) {
            return null;
        }

        const customerDB = await customerRepo.create({
            dni: customer.dni,
            name: customer.name,
            email: customer.email,
            photoUrl: customer.photoUrl,
            state: "CREATED",
            user: userId,
            region: regionId,
        });

        return customerDB;
    },
    saveRegion: async (regionName) => await regionRepo.create({ name: regionName }),
    deleteById: async (id) => await customerRepo.findByIdAndDelete(id),
    findAll: async () => await customerRepo.find({}),
    findById: async (id) => await customerRepo.findById(id),
};
