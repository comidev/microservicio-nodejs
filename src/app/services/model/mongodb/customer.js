const { model, Schema } = require("mongoose");

const CustomerSchema = new Schema({
    dni: {
        type: String,
        unique: true,
    },
    name: String,
    dateOfBirth: Date,
    gender: String,
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
    country: {
        type: Schema.Types.ObjectId,
        ref: "countries",
    },
});

const CustomerModel = model("customers", CustomerSchema);

module.exports = CustomerModel;
