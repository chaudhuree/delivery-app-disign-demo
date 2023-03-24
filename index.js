const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

// Create schema for package
const packageSchema = new Schema({
  packageType: String,
  senderName:String,
  recipientName:String,
  paymentStatus: { type: String, enum: ['fully paid', 'cash on delivery'] },
  deliveryStatus: { type: String, enum: ['pending', 'in transit', 'delivered'] },
  destination: { type: addressSchema,required: true},
  pickupPoint: { type: addressSchema, required: true},
  // destination: { type: Schema.Types.ObjectId, ref: 'Address' },
  // pickupPoint: { type: Schema.Types.ObjectId, ref: 'Address' },
});

// Create schema for address
const addressSchema = new Schema({
  address: String,
  city: String,
  state: String,
  zip: String,
});

// Create model for package and address
const Package = mongoose.model('Package', packageSchema);

// Insert a new package into the database
//sample code:
/*
{
  packageType: "letter",
  senderName:"sohan",
  recipientName:"shimla",
  paymentStatus: 'cash on delivery,
  deliveryStatus: 'pending',
  destination: {
    address:"panchbibi",
    city:"panchbibi",
    state:"joypurhat",
    zip:"5910"

  },
  pickupPoint: {
    address:"uttara",
    city:"dhaka",
    state:"dhaka",
    zip:"5200"
  },
}
*/
app.post('/packages', async (req, res) => {
  try {
    const package = new Package(req.body);
    const result = await package.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Update the delivery status of a package
app.put('/packagesUpdate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStatus } = req.body;
    const pack = await Package.findById(id);
    if(deliveryStatus==="delivered" && pack.paymentStatus!=="fully paid"){
      const package = await Package.findByIdAndUpdate(
        id,
        { deliveryStatus,paymentStatus:"fully paid" },
        { new: true }
      );
      return res.json(package);
    }
    const package = await Package.findByIdAndUpdate(
      id,
      { deliveryStatus},
      { new: true }
    )
    return res.json(package);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Check the delivery status of a package
app.get('/packages/:id/delivery-status', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id).populate('destination').populate('pickupPoint');
    console.log(package);
    res.json(package.deliveryStatus);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
