import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    externalId: {
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
    category: {
      type: String,
      required: true,
      enum: [
        'strength',
        'stretching',
        'cardio',
        'plyometrics',
        'powerlifting',
        'strongman',
        'olympic weightlifting',
      ],
    },
    level: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    force: {
      type: String,
      enum: ['push', 'pull', 'static', null],
      default: null,
    },
    mechanic: {
      type: String,
      enum: ['compound', 'isolation', null],
      default: null,
    },
    equipment: {
      type: String,
      required: true,
      lowercase: true,
      default: 'other',
    },
    primaryMuscles: {
      type: [String],
      default: [],
    },
    secondaryMuscles: {
      type: [String],
      default: [],
    },
    muscleGroup: {
      type: String,
      required: true,
      enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio'],
    },
    trackingType: {
      type: String,
      required: true,
      enum: ['reps', 'time'],
      default: 'reps',
    },
    lowImpact: {
      type: Boolean,
      required: true,
      default: true,
    },
    slots: {
      type: [String],
      required: true,
      default: [],
    },
    instructions: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
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

exerciseSchema.virtual('imageUrls').get(function () {
  if (!this.images || this.images.length === 0) {
    return [];
  }
  return this.images.map((img) => `/exercise-images/${img}`);
});

exerciseSchema.index({ muscleGroup: 1, level: 1 });
exerciseSchema.index({ name: 'text' });

export const Exercise = mongoose.model('Exercise', exerciseSchema);
