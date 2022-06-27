const { HttpStatus, HttpError } = require("../middleware/handleError");
const customerRepo = require("./model/mongodb/customer");
const regionRepo = require("./model/mongodb/region");
const userService = require("./user");

const existsByDni = async (dni) => await customerRepo.findOne({ dni: dni });

const existsByEmail = async (email) => await customerRepo.findOne({ email: email });

module.exports = {
    save: async (customer) => {
        if (await existsByDni(customer.dni)) {
            const message = `El DNI '${customer.dni}' ya existe!`;
            throw HttpError(HttpStatus.CONFLICT, message);
        }

        if (await existsByEmail(customer.email)) {
            const message = `El email '${customer.email}' ya existe!`;
            throw HttpError(HttpStatus.CONFLICT, message);
        }

        const regionId = await regionRepo.findOne({ name: customer.regionName });

        if (!regionId) {
            const message = `La region '${customer.regionName}' no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }

        const userId = await userService.saveCliente(customer.user);

        return await customerRepo.create({
            dni: customer.dni,
            name: customer.name,
            email: customer.email,
            photoUrl: customer.photoUrl,
            state: "CREATED",
            user: userId._id,
            region: regionId._id,
        });
    },

    saveRegion: async (regionName) => {
        try {
            const regionDB = await regionRepo.create({ name: regionName });
            return regionDB;
        } catch (e) {
            throw HttpError(HttpStatus.CONFLICT, e.message);
        }
    },
    deleteById: async (id) => {
        try {
            const customerDB = await customerRepo.findByIdAndDelete(id);
            return customerDB;
        } catch (e) {
            throw HttpError(HttpStatus.NOT_FOUND, e.message);
        }
    },

    findAll: async () => await customerRepo.find({}),

    findById: async (id) => {
        let customerDB = null;
        try {
            customerDB = await customerRepo
                .findById(id)
                .populate(["user", "region"]);
        } catch (e) {
            const message = `El customer no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }

        if (!customerDB) {
            throw HttpError(HttpStatus.NOT_FOUND, `Cliente no encontrado!`);
        }
        return customerDB;
    },
};
