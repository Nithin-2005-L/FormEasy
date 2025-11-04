import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  responses: {
    type: Object,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  submittedBy: {
    type: String,
    default: 'Anonymous',
  },
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;

