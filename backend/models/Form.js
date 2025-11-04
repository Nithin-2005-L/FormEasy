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
    type: String,
    required: true,
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

const Form = mongoose.model('Form', formSchema);

export default Form;

