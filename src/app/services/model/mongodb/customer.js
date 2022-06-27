const { model, Schema } = require("mongoose");

const CustomerSchema = new Schema({
    dni: {
        type: String,
        unique: true,
    },
    name: String,
    email: {
        type: String,
        unique: true,
    },
    photoUrl: String,
    state: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: "regions",
    },
});

const CustomerModel = model("customers", CustomerSchema);

module.exports = CustomerModel;
