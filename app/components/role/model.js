const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const RoleSchema = new Schema(
    {
        name: String,
    },
    {
        versionKey: false,
    }
);

const RoleModel = model("roles", RoleSchema);

module.exports = RoleModel;
