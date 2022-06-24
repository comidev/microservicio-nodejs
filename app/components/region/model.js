const { model, Schema } = require("mongoose");

const RegionSchema = new Schema(
    {
        name: String,
    },
    {
        versionKey: false,
    }
);

const RegionModel = model("regions", RegionSchema);

module.exports = RegionModel;
