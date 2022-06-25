const { model, Schema } = require("mongoose");

const InvoiceItemSchema = new Schema(
    {
        quantity: Number,
        product: {
            type: Schema.Types.ObjectId,
            ref: "products",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const InvoiceItemModel = model("invoices_items", InvoiceItemSchema);

module.exports = InvoiceItemModel;
