import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    default: '',
  },
  audience: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  theme: {
    type: String,
    enum: ['default', 'dark', 'minimal', 'vibrant', 'corporate'],
    default: 'default',
  },
  uniqueCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  submissions: {
    type: Number,
    default: 0,
  },
  analyticsToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying
formSchema.index({ userId: 1, createdAt: -1 });

const Form = mongoose.model('Form', formSchema);

export default Form;