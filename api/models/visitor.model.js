import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;
