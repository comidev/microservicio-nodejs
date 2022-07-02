const { initCountries } = require("../services/customer");
const { initCategories } = require("../services/category");
const { initProducts } = require("../services/product");

const initDataBase = async () => {
    await Promise.all([initCountries(), initCategories()]);
    await initProducts();
};

module.exports = { initDataBase };
