const shortUUID = require("short-uuid");
const mongoose = require("mongoose");

const passwordService = require("../../utils/password");
const userRepo = require("../../services/model/mongodb/user");
const roleRepo = require("../../services/model/mongodb/role");
const customerRepo = require("../../services/model/mongodb/customer");
const invoiceRepo = require("../../services/model/mongodb/invoice");
const invoiceItemRepo = require("../../services/model/mongodb/invoiceItem");
const regionRepo = require("../../services/model/mongodb/region");
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

// TODO: REGION
const createRegion = async (
    { regionName = "region" } = { regionName: "region" }
) => {
    const region = { name: regionName };
    const { _id, name } =
        (await regionRepo.findOne(region)) || (await regionRepo.create(region));
    return { _id, name };
};

// TODO: CUSTOMER
const createCustomer = async (
    { userId = generateId(), regionId = generateId() } = {
        userId: generateId(),
        regionId: generateId(),
    }
) => {
    const customer = {
        dni: shortUUID.generate().substring(0, 8),
        name: "Omar",
        email: shortUUID().generate(),
        photoUrl: "none",
        state: "CREATED",
        user: userId,
        region: regionId,
    };
    const { _id, name, dni, email } = await customerRepo.create(customer);
    return { _id, name, dni, email };
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
        description: "description",
        stock: 100,
        price: 100.51,
        status: "CREATED",
        categories: categoriesId,
    };
    const { _id } = await productRepo.create(product);
    return { _id };
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
    createRegion,
    createCategory,
    createInvoiceItem,
};
