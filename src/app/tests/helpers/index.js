const shortUUID = require("short-uuid");
const mongoose = require("mongoose");
const roleRepo = require("../../services/model/mongodb/role");
const userRepo = require("../../services/model/mongodb/user");
const passwordService = require("../../utils/password");
const customerRepo = require("../../services/model/mongodb/customer");
const invoiceRepo = require("../../services/model/mongodb/invoice");
const invoiceItemRepo = require("../../services/model/mongodb/invoiceItem");
const regionRepo = require("../../services/model/mongodb/region");
const productRepo = require("../../services/model/mongodb/product");
const categoryRepo = require("../../services/model/mongodb/category");

const generateId = () => mongoose.Types.ObjectId();

const createRole = async (roleName = "CLIENTE") => {
    const role = { name: roleName };
    const { _id } = (await roleRepo.findOne(role)) || (await roleRepo.create(role));
    return { _id };
};

const createUser = async (role) => {
    const password = "123";
    const passwordHash = await passwordService.encrypt(password);
    const user = {
        username: shortUUID().generate(),
        password: passwordHash,
        roles: [role?._id || generateId()],
    };
    const { _id, username } = await userRepo.create(user);
    return { _id, username, password };
};

const createRegion = async (regionName = "region") => {
    const region = { name: regionName };
    const { _id } =
        (await regionRepo.findOne(region)) || (await regionRepo.create(region));
    return { _id };
};

const createCustomer = async (user, region) => {
    const customer = {
        dni: shortUUID.generate().substring(0, 8),
        name: "Omar",
        email: shortUUID().generate(),
        photoUrl: "none",
        state: "CREATED",
        user: user?._id || generateId(),
        region: region?._id || generateId(),
    };
    const { _id } = await customerRepo.create(customer);
    return { _id };
};

const createCategory = async (categoryName = "Programacion") => {
    const categoria = { name: categoryName };
    const { _id, name } =
        (await categoryRepo.findOne(categoria)) ||
        (await categoryRepo.create(categoria));
    return { _id, name };
};

const createProduct = async (category) => {
    const product = {
        name: "name",
        description: "description",
        stock: 100,
        price: 100.51,
        status: "CREATED",
        category: category?._id || generateId(),
    };
    const { _id } = await productRepo.create(product);
    return { _id };
};

const createInvoiceItem = async (product) => {
    const invoiceItem = {
        quantity: 3,
        product: product._id,
    };
    const { _id } = await invoiceItemRepo.create(invoiceItem);
    return { _id };
};

const createInvoice = async (customer, invoiceItems) => {
    const invoice = {
        customer: customer._id,
        description: "description",
        state: "CREATED",
        invoiceItems: invoiceItems,
    };
    const { _id } = await invoiceRepo.create(invoice);
    return { _id };
};

const arrayLengthAndMap = (length, map) => [...Array(length).keys()].map(map);

// TODO: 3 clientes compran 1 producto cada uno.
const USERS_LENGTH = 3;
const CUSTOMERS_LENGTH = 3; // ? <= USERS
const PRODUCTS_LENGTH = 3;
const INVOICE_ITEMS_LENGTH = 3; // ? <= USERS x PRODUCTS!!!
const INVOICE_LENGTH = 3; // ? <= INVOICES ITEMS

// * USERS ----
const initUsers = async () => {
    const role = await createRole();
    const usersPromises = arrayLengthAndMap(USERS_LENGTH, () => createUser(role));
    const users = await Promise.all(usersPromises);
    return users;
};

// * CUSTOMERS ----
const initCustomers = async () => {
    const users = await initUsers();

    const region = await createRegion();
    const customersPromises = arrayLengthAndMap(CUSTOMERS_LENGTH, (_, index) =>
        createCustomer(users[index], region)
    );

    const customers = await Promise.all(customersPromises);
    return customers;
};

// * PRODUCTS ----
const initProducs = async () => {
    const category = await createCategory();
    const productsPromises = arrayLengthAndMap(PRODUCTS_LENGTH, () =>
        createProduct(category)
    );
    const products = await Promise.all(productsPromises);
    return products;
};

// * INVOICES - ITEMS ----
const initInvoiceItems = async () => {
    const products = await initProducs();

    const invoicesItemsPromises = arrayLengthAndMap(
        INVOICE_ITEMS_LENGTH,
        (_, index) => createInvoiceItem(products[index])
    );
    const invoicesItems = await Promise.all(invoicesItemsPromises);

    const invoiceItemsIdss = invoicesItems.map((item) => [item._id]);

    /*
    const invoiceItemIds1 = [invoicesItems[0]].map((item) => item._id);
    const invoiceItemIds2 = [invoicesItems[1]].map((item) => item._id);
    const invoiceItemIds3 = [invoicesItems[2]].map((item) => item._id);
     */

    return invoiceItemsIdss;
};

// * INVOICES ----
const initInvoices = async () => {
    const [customers, invoiceItemIdss] = await Promise.all([
        initCustomers(),
        initInvoiceItems(),
    ]);

    const invoicesPromises = arrayLengthAndMap(INVOICE_LENGTH, (_, index) =>
        createInvoice(customers[index], invoiceItemIdss[index])
    );
    const invoices = await Promise.all(invoicesPromises);
    return invoices.map((invoice) => invoice._id);
};

module.exports = {
    createCustomer,
    createInvoice,
    createProduct,
    createRole,
    createUser,
    createCategory,
    initInvoices,
};
