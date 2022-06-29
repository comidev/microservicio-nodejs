const { HttpStatus, HttpError } = require("../middleware/handleError");
const customerRepo = require("./model/mongodb/customer");
const countryRepo = require("./model/mongodb/country");
const userService = require("./user");
const GENDERS = require("../utils/genders");

const existsByDni = async (dni) => await customerRepo.findOne({ dni: dni });

const existsByEmail = async (email) => {
    return await customerRepo.findOne({ email: email });
};

module.exports = {
    save: async (customer) => {
        if (!Object.values(GENDERS).includes(customer.gender)) {
            const message = `El género '${customer.gender}'no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }

        if (await existsByDni(customer.dni)) {
            const message = `El DNI '${customer.dni}' ya existe!`;
            throw HttpError(HttpStatus.CONFLICT, message);
        }

        if (await existsByEmail(customer.email)) {
            const message = `El email '${customer.email}' ya existe!`;
            throw HttpError(HttpStatus.CONFLICT, message);
        }

        const countryId = await countryRepo.findOne({ name: customer.countryName });

        if (!countryId) {
            const message = `El país '${customer.countryName}' no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }

        const userId = await userService.saveCliente(customer.user);

        return await customerRepo.create({
            dni: customer.dni,
            name: customer.name,
            email: customer.email,
            gender: customer.gender,
            dateOfBirth: customer.dateOfBirth,
            photoUrl: customer.photoUrl,
            state: "CREATED",
            user: userId._id,
            country: countryId._id,
        });
    },
    deleteById: async (id) => {
        try {
            const customerDB = await customerRepo.findByIdAndDelete(id);
            return customerDB;
        } catch (e) {
            throw HttpError(HttpStatus.NOT_FOUND, e.message);
        }
    },

    existsEmail: async (email) => {
        const exists = Boolean(await existsByEmail(email));
        return { exists };
    },

    findAll: async () => await customerRepo.find({}),
    
    findAllCountries: async () => await countryRepo.find({}),

    findById: async (id) => {
        let customerDB = null;
        try {
            customerDB = await customerRepo
                .findById(id)
                .populate(["user", "country"]);
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
