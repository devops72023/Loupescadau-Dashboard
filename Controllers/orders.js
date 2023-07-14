import Order, { CartItem } from "../Models/orders.js";

async function list (req, res){
    try {
        const orders = await Order.find()
        res.json(orders)
    } catch (error) {
        return res.status(500).json({error:'Something went wrong!' + error.message})
    }
}

async function countMonth (req, res){
    const year = req.body.year;// Note: month is zero-indexed in JavaScript Dates
    const month = req.body.month - 1;
    
    try {
        // Find orders within the specified date range
        const orders = await Order.find()
        const nOrders = orders.filter(item => {
            const cyear = new Date(item.createdAt).getFullYear();
            const cmonth = new Date(item.createdAt).getMonth(); 
            return cyear == year && cmonth == month
        })
        return res.status(200).json(nOrders);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        return res.status(500).json({error: 'Something went wrong!'})
    };
};


export { list, countMonth }