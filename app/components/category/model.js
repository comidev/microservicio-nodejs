const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const CategorySchema = new Schema(
    { name: String },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("categories", CategorySchema);
