const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const ProductScheme = new Schema(
    {
        name: String,
        description: String,
        stock: Number,
        price: Number,
        status: String,
        category: {
            type: Schema.Types.ObjectId,
            ref: "category",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("product", ProductScheme);  
