const express = require('express');
const cors = require('cors');
const randomize = require('randomatic'); // for generating random OTPs
const twilio = require('twilio'); // if using Twilio for SMS
const fast2sms = require('fast-two-sms');
const axios = require('axios');
const OTP = require('../models/otp');
const paymentRoutes = require('./paymentRoutes.routes');

// const nodemailer = require('nodemailer'); // if using nodemailer for email
// const { validatePhoneNumber, validateEmail } = require('./validation');

//Database models
const vehicleDetails = require('../models/vehicleDetails');
const userData = require('../models/userData');
const transactionLogs = require('../models/transactionLogs');
const IST_TIMEZONE_OFFSET = 5.5 * 60 * 60 * 1000;


const router = express.Router();
router.use(cors());
require('dotenv').config();


router.post('/adduser', (req, res, next) => {
    const user = new userData({ "username": "user", "vehicleNumber": "KA-19-MH-2002" });
    user.save().then((result) => {
        res.status(201).send({ message: "success" });
    });
});

router.post('/login', async (req, res, next) => {
    const { username, vehicleNumber } = req.body;
    console.log(req.body);
    try {
        const user = await userData.findOne({ username, vehicleNumber });

        if (user) {
            res.status(200).json({ userDetails: user });
        } else {
            res.status(401).json({ message: 'Login failed. Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Get vehicle owners details API
router.post('/vehicle', async (req, res) => {
    try {
        const { registrationNumber } = req.body;
        const vehicle = await vehicleDetails.findOne({ RegistrationNumber: registrationNumber });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Send the response from VAHAN API to the client
        res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        res.status(500).json({ error: 'Failed to fetch vehicle details' });
    }
});

//send and OTP
router.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    //otp is saved to db
    try {
        await OTP.create({ phoneNumber, otp });
    } catch (error) {
        console.error('Error saving OTP to database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    // Send OTP via fast-two-sms
    // try {
    //     const fromattedPhone = phoneNumber.split(" ")[1];
    //     const response = await axios.post(
    //         process.env.FAST_TWO_SMS_URI,
    //         {
    //             route: 'q',
    //             message: `Dear customer,\nthe one time password (OTP) is ${otp}. \nUse this code within the next 5 minutes to verify your account and start enjoying seamless toll services. `,
    //             language: 'english',
    //             flash: 0,
    //             numbers: fromattedPhone,
    //         },
    //         {
    //             headers: {
    //                 "authorization": process.env.FAST_TWO_SMS_API_KEY,
    //                 "Content-Type": "application/json",
    //                 'Cache-Control': 'no-cache',
    //             },
    //         }
    //     );
    //     if (response.data.return === true) {
    //         res.send('OTP sent successfully');
    //     } else {
    //         res.send('Failed to send OTP');
    //     }
    // } catch (error) {
    //     console.log(error);
    //     res.send('Error sending OTP');
    // }
    console.log("OTP: ", otp);
    res.send('OTP sent successfully');
});

// Route to handle OTP verification
router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;
    console.log(phoneNumber, otp);

    if (!phoneNumber || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    try {
        // Look for the OTP entry
        const otpEntry = await OTP.findOne({ phoneNumber, otp });

        if (!otpEntry) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Check if OTP has expired
        if (otpEntry.expiresAt < new Date()) {
            return res.status(400).json({ error: 'OTP has expired' });
        }

        // If OTP is valid, delete it from the database
        await OTP.deleteOne({ _id: otpEntry._id });

        // // Format phone number properly
        const formattedPhoneNumber = phoneNumber;

        // Call external service to fetch vehicle registration details
        const vehicleData = { "PhoneNumber": formattedPhoneNumber };
        // const { RegistrationNumber, OwnerName, PhoneNumber } = await vehicleDetails.findOne(vehicleData);
        const vehicles = await vehicleDetails.findOne(vehicleData);
        console.log(vehicles);
        console.log(vehicles.RegistrationNumber)
        const { RegistrationNumber, OwnerName, PhoneNumber } = vehicles;

        // Check if user data already exists
        let existingUser = await userData.findOne({ vehicleNumber: RegistrationNumber });

        if (!existingUser) {
            // If user data doesn't exist, create a new entry
            const newUser = new userData({ username: OwnerName, vehicleNumber: RegistrationNumber, phoneNumber: PhoneNumber });
            await newUser.save();
        }

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/getBalance', async (req, res) => {
    const { vehicleNumber, amount } = req.body;

    const entryTime = new Date(Date.now() + IST_TIMEZONE_OFFSET);
    try {
        // // Create transaction log document
        // const transaction = new transactionLogs({
        //     entry: {
        //         location: {
        //             type: 'Point',
        //             coordinates: [0, 0]
        //         },
        //         time: entryTime
        //     },
        //     exit: {
        //         location: {
        //             type: 'Point',
        //             coordinates: [0, 0]
        //         },
        //         time: entryTime,
        //     },
        //     'tollPaid': amount,
        //     'vehicleNumber': vehicleNumber,
        //     'customerId': customerId
        // });
        // await transaction.save();

        const updatedUser = await userData.findOneAndUpdate(
            { vehicleNumber },
            { customerId: "cust_123bfsdfjsbdf", $inc: { balance: amount }, verified: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ balance: updatedUser.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/getTransactionLogs', async (req, res) => {
    const { vehicleNumber } = req.body;
    try {
        const user = await userData.findOne({ vehicleNumber: vehicleNumber }).populate({ path: 'transactionLogs', model: 'transactionLogs' });

        res.status(200).send({ transactions: user.transactionLogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/getWallet', async (req, res) => {
    const { vehicleNumber } = req.body;
    try {
        const user = await userData.findOne({ vehicleNumber: vehicleNumber });
        const balance = user.balance;
        res.status(200).json({ balance: balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/getUserData', async (req, res) => {
    const { vehicleNumber } = req.body;
    try {
        const user = await userData.findOne({ vehicleNumber });
        const vehicle = await vehicleDetails.findOne({ RegistrationNumber: vehicleNumber });
        if (user && vehicle) {
            res.status(200).json({ userDetails: user, vehicleDetails: vehicle });
        } else {
            res.status(401).json({ message: "Couldn't find user. Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.use('/payment', paymentRoutes);

module.exports = router;


