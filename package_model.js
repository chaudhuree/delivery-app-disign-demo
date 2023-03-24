const mongoose = require('mongoose');

// Define pickup address schema
const pickupAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
});

// Define destination address schema
const destinationAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true }
});

// Define package schema
const packageSchema = new mongoose.Schema({
  packageType: { type: String, required: true },
  paymentStatus: { type: String, enum: ['fully_paid', 'cash_on_delivery'], required: true },
  deliveryStatus: { type: String, enum: ['pending', 'in_transit', 'delivered'], required: true },
  pickupAddress: { type: pickupAddressSchema, required: true },
  destinationAddress: { type: destinationAddressSchema, required: true }
});

// Create package model
const Package = mongoose.model('Package', packageSchema);
