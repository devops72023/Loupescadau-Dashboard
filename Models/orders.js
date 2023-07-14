import mongoose from 'mongoose';
const { model, models, Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product",
    },
    title: String,
    price: Number,
    quantity: Number,
}, {
    timestamps: true
});

const CartItem = models.CartItem || model('CartItem', CartItemSchema);

const OrderSchema = new mongoose.Schema({
    products: [CartItemSchema], // array of objects
    transaction_id: {type: String},
    amount: {
        type: Number
    },
    address: String,
    status: {
        type: String,
        default: "Not processed",
        // enum: string objects
        enum: ["Not processed", "Shipped", "Delivered", "Cancelled"]
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

const Order = models.Order || model("Order", OrderSchema);
export default Order
export { CartItem }

