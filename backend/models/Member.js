const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[\+]?[1-9][\d]{0,15}$/
  },
  joinDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  subscriptionEndDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastReminderSent: {
    type: Date,
    default: null
  },
  reminderCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

memberSchema.index({ fullName: 'text', contactNumber: 'text' });
memberSchema.index({ subscriptionEndDate: 1 });
memberSchema.index({ isActive: 1 });

memberSchema.virtual('subscriptionStatus').get(function() {
  const today = new Date();
  const endDate = new Date(this.subscriptionEndDate);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 3) return 'expiring-soon';
  return 'active';
});

memberSchema.virtual('daysUntilExpiry').get(function() {
  const today = new Date();
  const endDate = new Date(this.subscriptionEndDate);
  const diffTime = endDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Member', memberSchema);
