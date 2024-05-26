const express = require('express');
const cors = require('cors');
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const payRouter = express.Router();
payRouter.use(cors());
payRouter.use(express.json());
require('dotenv').config();


// Endpoint to create a customer
payRouter.post('/createCustomer', async (req, res) => {
    try {
        const customer = await stripe.customers.create({
            email: "newCustomer@smart.com", // Assuming email is sent from the client
            // Add more customer details as needed
        });
        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating customer');
    }
});

// Endpoint to add funds to wallet
payRouter.post("/pay", async (req, res) => {
    try {
        const { VehicleNumber } = req.body; // Destructure merchantDisplayName
        console.log("Received VehicleNumber:", VehicleNumber); // Log received name

        if (!VehicleNumber) return res.status(400).json({ message: "Please enter a VehicleNumber" });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(25 * 100),
            currency: "INR",
            payment_method_types: ["card"],
            metadata: { VehicleNumber },
            // Include merchantDisplayName in metadata
        });
        console.log("PaymentIntent:", paymentIntent);
        const clientSecret = paymentIntent.client_secret;
        res.json({ message: "Payment initiated", clientSecret });
    } catch (err) {
        console.error("Error creating payment intent:", err); // Log error
        res.status(500).json({ message: "Internal server error" });
    }
});

// Endpoint to deduct funds for toll
payRouter.post('/deductFunds', async (req, res) => {
    try {
        // Deduct funds from customer's wallet balance in your database
        // You may also want to create a charge object here for accounting purposes
        res.status(200).send('Funds deducted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deducting funds');
    }
});


module.exports = payRouter;