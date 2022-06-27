const { model, Schema } = require("mongoose");
const STATUS = require("../../../utils/status");

const ProductScheme = new Schema(
    {
        name: String,
        description: String,
        stock: Number,
        price: Number,
        status: String,
        category: {
            type: Schema.Types.ObjectId,
            ref: "categories",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("products", ProductScheme);
