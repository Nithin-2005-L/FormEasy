import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    minlength: 6,
    select: false // Don't return password by default in queries
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  googleId: {
    type: String,
    sparse: true, // Allow null values
    unique: true
  },
  avatar: {
    type: String,
    default: null
  },
  authMethod: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  preferences: {
    theme: {
      type: String,
      enum: ['default', 'dark', 'minimal', 'vibrant', 'corporate'],
      default: 'default'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('passwordHash')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcryptjs.genSalt(10);
    // Hash password
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(inputPassword) {
  try {
    return await bcryptjs.compare(inputPassword, this.passwordHash);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Method to get user data without sensitive fields
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
