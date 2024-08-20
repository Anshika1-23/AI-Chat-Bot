const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/homeImprovementChatbot', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for storing service details
const ServiceSchema = new mongoose.Schema({
    name: String,
    description: String,
    averageCost: String,
    typicalIssues: [String],
});

const Service = mongoose.model('Service', ServiceSchema);

// Define a schema for storing user inquiries
const InquirySchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    serviceType: String,
    timestamp: { type: Date, default: Date.now },
});

const Inquiry = mongoose.model('Inquiry', InquirySchema);

// Endpoint to handle user inquiries
app.post('/api/inquire', async (req, res) => {
    const { serviceType, name, email, phone } = req.body;

    // Store the inquiry details
    const inquiry = new Inquiry({ name, email, phone, serviceType });
    await inquiry.save();

    try {
        const service = await Service.findOne({ name: serviceType });
        if (service) {
            res.json({
                message: `Thank you, ${name}! We offer ${service.name} services. ${service.description} The average cost is ${service.averageCost}. Common issues include: ${service.typicalIssues.join(', ')}. We will contact you shortly at ${email} or ${phone}.`,
            });
        } else {
            res.json({ message: `Thank you, ${name}. Sorry, we don't have information on ${serviceType} at the moment. We will contact you shortly at ${email} or ${phone}.` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
