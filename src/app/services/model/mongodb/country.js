const { model, Schema } = require("mongoose");

const CountrySchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
        },
    },
    {
        versionKey: false,
    }
);

const CountryModel = model("countries", CountrySchema);

module.exports = CountryModel;
