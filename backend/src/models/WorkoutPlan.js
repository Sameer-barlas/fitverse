import mongoose from 'mongoose';

const planExerciseSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true,
    },
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    repsMin: {
      type: Number,
      default: null,
    },
    repsMax: {
      type: Number,
      default: null,
    },
    durationSec: {
      type: Number,
      default: null,
    },
    restSec: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const planDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    focus: {
      type: String,
      required: true,
    },
    exercises: {
      type: [planExerciseSchema],
      default: [],
    },
  },
  { _id: false },
);

const workoutPlanSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    bmiCategory: {
      type: String,
      required: true,
      enum: ['underweight', 'normal', 'overweight', 'obese'],
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    ageBand: {
      type: String,
      required: true,
      enum: ['adult', 'midlife', 'senior'],
    },
    daysPerWeek: {
      type: Number,
      required: true,
      enum: [3, 4, 5],
    },
    guidelines: {
      type: [String],
      default: [],
    },
    days: {
      type: [planDaySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        delete ret.__v;
        return ret;
      },
    },
  },
);

workoutPlanSchema.index({ bmiCategory: 1, experienceLevel: 1, ageBand: 1 }, { unique: true });

export const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
