const { HttpStatus, HttpError } = require("../middleware/handleError");
const customerRepo = require("./model/mongodb/customer");
const countryRepo = require("./model/mongodb/country");
const userService = require("./user");
const GENDERS = require("../utils/genders");
const COUNTRIES = require("../utils/countries");
const passwordService = require("../utils/password");

const existsByDni = async (dni) => await customerRepo.findOne({ dni: dni });

const existsByEmail = async (email) => {
    return await customerRepo.findOne({ email: email });
};
const initCountries = async () => {
    const countryYemen = await countryRepo.findOne({ name: "Yemen" });
    if (!Boolean(countryYemen)) {
        const createPromisesArray = COUNTRIES.map((country) =>
            countryRepo.create(country)
        );
        await Promise.all(createPromisesArray);
    }
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

        await customerRepo.create({
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

        return { user: customer.user };
    },
    update: async (customer, customerId) => {
        let current = null;
        try {
            current = await customerRepo
                .findById(customerId)
                .populate(["country", "user"]);
        } catch (e) {
            const message = `El cliente '${customerId}' no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }

        if (!current) {
            const message = `El cliente '${customerId}' no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }

        if (!Object.values(GENDERS).includes(customer.gender)) {
            const message = `El género '${customer.gender}'no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }

        const passwordIsCorrect = await passwordService.comparePlainWithEncrypted(
            customer.user.password,
            current.user.password
        );

        if (!passwordIsCorrect) {
            const message = `EL password es incorrecto!!`;
            throw HttpError(HttpStatus.UNAUTHORIZED, message);
        }

        if (current.dni !== customer.dni && (await existsByDni(customer.dni))) {
            const message = `El DNI '${customer.dni}' ya existe!`;
            throw HttpError(HttpStatus.CONFLICT, message);
        }

        if (
            current.email !== customer.email &&
            (await existsByEmail(customer.email))
        ) {
            const message = `El email '${customer.email}' ya existe!`;
            throw HttpError(HttpStatus.CONFLICT, message);
        }

        //TODO: Verificamos los que sí han cambiado
        const updateCustomer = {};
        if (current.email !== customer.email) {
            updateCustomer.email = customer.email;
        }
        if (current.dni !== customer.dni) {
            updateCustomer.dni = customer.dni;
        }
        if (current.name !== customer.name) {
            updateCustomer.name = customer.name;
        }
        if (current.gender !== customer.gender) {
            updateCustomer.gender = customer.gender;
        }
        if (current.photoUrl !== customer.photoUrl) {
            updateCustomer.photoUrl = customer.photoUrl;
        }
        if (current.country.name !== customer.countryName) {
            const { _id: countryId } = await countryRepo.findOne({
                name: customer.countryName,
            });
            if (!countryId) {
                const message = `El país '${customer.countryName}' no existe!`;
                throw HttpError(HttpStatus.NOT_FOUND, message);
            }
            updateCustomer.country = countryId;
        }
        if (!current.user.username === customer.user.username) {
            await userService.updateUsername(
                customer.user.username,
                current.user._id
            );
        }
        updateCustomer.dateOfBirth = customer.dateOfBirth;
        updateCustomer.state = "UPDATED";
        await customerRepo.findByIdAndUpdate(customerId, updateCustomer);
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

    findAllCountries: async () => {
        const countries = await countryRepo.find({});
        return countries.sort((a, b) => (a.name > b.name ? 1 : -1));
    },

    findById: async (id) => {
        let customerDB = null;
        try {
            customerDB = await customerRepo
                .findById(id)
                .populate(["user", "country"]);
        } catch (e) {
            const message = `El customer id no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }

        if (!customerDB) {
            throw HttpError(HttpStatus.NOT_FOUND, `Cliente no encontrado!`);
        }
        const {
            _id: customerId,
            email,
            dni,
            name,
            dateOfBirth,
            photoUrl,
            country: countryDB,
            user: userDB,
            gender,
        } = customerDB;

        const { name: country } = countryDB;
        const { username } = userDB;

        const user = { username };

        return {
            customerId,
            email,
            dni,
            name,
            dateOfBirth,
            photoUrl,
            country,
            user,
            gender,
        };
    },
    initCountries,
};
