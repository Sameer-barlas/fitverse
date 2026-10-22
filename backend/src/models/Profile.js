import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    heightCm: {
      type: Number,
      required: true,
      min: [100, 'Height must be between 100 and 250 cm'],
      max: [250, 'Height must be between 100 and 250 cm'],
    },
    weightKg: {
      type: Number,
      required: true,
      min: [30, 'Weight must be between 30 and 300 kg'],
      max: [300, 'Weight must be between 30 and 300 kg'],
    },
    age: {
      type: Number,
      required: true,
      min: [18, 'Age must be between 18 and 80'],
      max: [80, 'Age must be between 18 and 80'],
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    bmi: {
      type: Number,
      required: true,
    },
    bmiCategory: {
      type: String,
      required: true,
      enum: ['underweight', 'normal', 'overweight', 'obese'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const Profile = mongoose.model('Profile', profileSchema);
