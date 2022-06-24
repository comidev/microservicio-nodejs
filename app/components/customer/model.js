const { model, Schema } = require("mongoose");

const CustomerSchema = new Schema({
    dni: String,
    name: String,
    email: String,
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
