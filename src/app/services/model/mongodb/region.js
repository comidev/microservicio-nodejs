const { model, Schema } = require("mongoose");

const RegionSchema = new Schema(
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

const RegionModel = model("regions", RegionSchema);

module.exports = RegionModel;
