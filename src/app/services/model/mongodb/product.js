const { model, Schema } = require("mongoose");

const ProductScheme = new Schema(
    {
        name: String,
        description: String,
        photoUrl: String,
        stock: Number,
        price: Number,
        status: String,
        categories: [
            {
                type: Schema.Types.ObjectId,
                ref: "categories",
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("products", ProductScheme);
