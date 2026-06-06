const mongoose = require('mongoose');

const aiSuggestionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cvFileName: { type: String, default: '' },
    cvText: { type: String, default: '' },
    suggestedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiSuggestion', aiSuggestionSchema);
