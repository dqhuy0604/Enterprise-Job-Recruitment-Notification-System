const mongoose = require('mongoose');
const crypto = require('crypto');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    address: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    companyCode: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

companySchema.statics.generateCode = () =>
  `COMP-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

module.exports = mongoose.model('Company', companySchema);
