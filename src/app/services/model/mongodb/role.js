const { model, Schema } = require("mongoose");
const ROLES = require("../../../utils/roles");

const RoleSchema = new Schema(
    {
        name: {
            type: String,
            default: ROLES.CLIENTE,
        },
    },
    {
        versionKey: false,
    }
);

const RoleModel = model("roles", RoleSchema);

module.exports = RoleModel;
