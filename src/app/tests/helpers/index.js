const shortUUID = require("short-uuid");
const mongoose = require("mongoose");

const passwordService = require("../../utils/password");
const jwtService = require("../../utils/jwt");
const userRepo = require("../../services/model/mongodb/user");
const roleRepo = require("../../services/model/mongodb/role");
const customerRepo = require("../../services/model/mongodb/customer");
const invoiceRepo = require("../../services/model/mongodb/invoice");
const invoiceItemRepo = require("../../services/model/mongodb/invoiceItem");
const countryRepo = require("../../services/model/mongodb/country");
const productRepo = require("../../services/model/mongodb/product");
const categoryRepo = require("../../services/model/mongodb/category");

const generateId = () => mongoose.Types.ObjectId();

// TODO: ROLE
const createRole = async (roleName = "CLIENTE") => {
    const role = { name: roleName };
    const { _id } = (await roleRepo.findOne(role)) || (await roleRepo.create(role));
    return { _id };
};

// TODO: USER
const createUser = async ({ role = generateId() } = { role: generateId() }) => {
    const password = "123";
    const passwordHash = await passwordService.encrypt(password);
    const user = {
        username: shortUUID().generate(),
        password: passwordHash,
        roles: [role],
    };
    const { _id, username } = await userRepo.create(user);
    return { _id, username, password };
};

const createUserByRole = async (role) => {
    const { _id: roleId } = await createRole(role);
    const user = await createUser({ role: roleId });
    user.roles = [role];
    return user;
};

//TODO: Token y Rol de acceso
const createToken = async (role) => {
    const { _id: id, username, roles } = await createUserByRole(role);
    const { access_token } = jwtService.createTokens({ id, username, roles });
    const token = { Authorization: `Bearer ${access_token}` };
    return token;
};

const createTokenAdmin = async () => await createToken("ADMIN");
const createTokenClient = async () => await createToken("CLIENTE");

// TODO: COUNTRY
const createCountry = async ({ countryName = "Perú" } = { countryName: "Perú" }) => {
    const country = { name: countryName };
    const { _id, name } =
        (await countryRepo.findOne(country)) || (await countryRepo.create(country));
    return { _id, name };
};

// TODO: CUSTOMER
const createCustomer = async (
    { userId = generateId(), countryId = generateId() } = {
        userId: generateId(),
        countryId: generateId(),
    }
) => {
    const customer = {
        dni: shortUUID.generate().substring(0, 8),
        name: "Omar",
        email: shortUUID().generate(),
        photoUrl: "none",
        gender: "MASCULINO",
        dateOfBirth: new Date(2000, 3, 11),
        state: "CREATED",
        user: userId,
        country: countryId,
    };
    return await customerRepo.create(customer);
};

// TODO: CATEGORY
const createCategory = async (
    { categoryName = "Programacion" } = { categoryaName: "Programacion" }
) => {
    const categoria = { name: categoryName };
    const { _id, name } =
        (await categoryRepo.findOne(categoria)) ||
        (await categoryRepo.create(categoria));
    return { _id, name };
};

// TODO: PRODUCT
const createProduct = async (
    { categoriesId = [generateId()] } = { categoriesId: [generateId()] }
) => {
    const product = {
        name: "name",
        photoUrl: "xdd",
        description: "description",
        stock: 100,
        price: 100.51,
        status: "CREATED",
        categories: categoriesId,
    };
    const { _id, name } = await productRepo.create(product);
    return { _id, name };
};

// TODO: INVOICE ITEM
const createInvoiceItem = async (
    { productId = generateId() } = { productId: generateId() }
) => {
    const invoiceItem = {
        quantity: 3,
        product: productId,
    };
    const { _id } = await invoiceItemRepo.create(invoiceItem);
    return { _id };
};

// TODO: INVOICE
const createInvoice = async (
    { customerId = generateId(), invoiceItemsIds = [generateId()] } = {
        customerId: generateId(),
        invoiceItemsIds: [generateId()],
    }
) => {
    const invoice = {
        customer: customerId,
        description: "description",
        state: "CREATED",
        invoiceItems: invoiceItemsIds,
    };
    const { _id } = await invoiceRepo.create(invoice);
    return { _id };
};

module.exports = {
    createCustomer,
    createInvoice,
    createProduct,
    createRole,
    createUser,
    createTokenAdmin,
    createTokenClient,
    createCountry,
    createCategory,
    createInvoiceItem,
};
