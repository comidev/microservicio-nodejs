const { model, Schema } = require("mongoose");
const STATUS = require("../../../utils/status");

const InvoiceSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "customers",
        },
        description: String,
        invoiceItems: [
            {
                type: Schema.Types.ObjectId,
                ref: "invoice_items",
            },
        ],
        state: String,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const InvoiceModel = model("invoices", InvoiceSchema);

module.exports = InvoiceModel;
