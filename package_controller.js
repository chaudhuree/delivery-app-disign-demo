import Package from './package_model.js';
// Insert data controller
const insertPackage = async (req, res) => {
  try {
    const pack = new Package(req.body);
    const result = await Package.save();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Change delivery status controller
const changeDeliveryStatus = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { deliveryStatus } = req.body;
    const pack = await Package.findById(packageId);
    if(deliveryStatus === 'delivered' && pack.paymentStatus !== 'fully_paid') {
      const result = await Package.findByIdAndUpdate(packageId, { deliveryStatus,paymentStatus:"fully_paid" }, { new: true });
    }else{
    const result = await Package.findByIdAndUpdate(packageId, { deliveryStatus }, { new: true });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check package status controller
const checkPackageStatus = async (req, res) => {
  try {
    const { packageId } = req.params;
    const result = await Package.findById(packageId);
    res.status(200).json(result.deliveryStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

