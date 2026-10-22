import mongoose from 'mongoose';

const setSchema = new mongoose.Schema(
  {
    reps: {
      type: Number,
      default: null,
    },
    weightKg: {
      type: Number,
      default: 0,
    },
    durationSec: {
      type: Number,
      default: null,
    },
  },
  { _id: false },
);

const entrySchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    sets: {
      type: [setSchema],
      required: true,
    },
  },
  { _id: false },
);

const planDayRefSchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const workoutLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 80,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    planDay: {
      type: planDayRefSchema,
      default: null,
    },
    entries: {
      type: [entrySchema],
      required: true,
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

workoutLogSchema.index({ user: 1, date: -1 });
workoutLogSchema.index({ user: 1, 'entries.exercise': 1, date: -1 });

export const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
