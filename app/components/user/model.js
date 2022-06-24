const { model, Schema } = require("mongoose");

const UserSchema = new Schema(
    {
        username: String,
        password: String,
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: "roles",
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const UserModel = model("users", UserSchema);

module.exports = UserModel;
