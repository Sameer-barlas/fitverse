import { useState, useEffect } from 'react';
import { X, Dumbbell, CheckCircle2 } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import { getExerciseImageUrl } from '../../utils/imageUrl.js';

export default function ExerciseDetailModal({ exercise, onClose }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [exercise]);

  useEffect(() => {
    if (!exercise) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exercise, onClose]);

  if (!exercise) return null;

  const rawImageUrls =
    exercise.imageUrls?.length > 0
      ? exercise.imageUrls
      : (exercise.images || []).map((img) => `/exercise-images/${img}`);

  const imageUrls = rawImageUrls.map((url) => getExerciseImageUrl(url));
  const currentImg = imageUrls[activeImageIdx] || imageUrls[0] || null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-modal-title"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-[#1E293B] bg-[#111827] text-[#F9FAFB] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-[#1E293B]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge variant={exercise.level}>{exercise.level}</Badge>
              <Badge variant="indigo">{exercise.muscleGroup}</Badge>
              {exercise.lowImpact && <Badge variant="emerald">Low Impact</Badge>}
              <Badge variant="default">
                {exercise.trackingType === 'time' ? 'Timed Hold / Cardio' : 'Reps & Weight'}
              </Badge>
            </div>
            <h2 id="exercise-modal-title" className="text-xl font-bold text-[#F9FAFB]">
              {exercise.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Image showcase + 0.jpg / 1.jpg toggle */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-72 w-full rounded-xl bg-[#1F2937] overflow-hidden flex items-center justify-center">
              {currentImg ? (
                <img
                  src={currentImg}
                  alt={`${exercise.name} position ${activeImageIdx + 1}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Dumbbell className="h-12 w-12 text-[#9CA3AF]" />
              )}
            </div>

            {imageUrls.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                {imageUrls.map((url, idx) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeImageIdx === idx
                        ? 'bg-[#10B981] text-[#0B0F17]'
                        : 'bg-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB]'
                    }`}
                  >
                    Step {idx + 1} ({idx}.jpg)
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-[#1F2937]/60 p-3">
              <p className="text-xs text-[#9CA3AF]">Category</p>
              <p className="mt-0.5 text-sm font-semibold capitalize">{exercise.category}</p>
            </div>
            <div className="rounded-xl bg-[#1F2937]/60 p-3">
              <p className="text-xs text-[#9CA3AF]">Equipment</p>
              <p className="mt-0.5 text-sm font-semibold capitalize">
                {exercise.equipment || 'Body only'}
              </p>
            </div>
            <div className="rounded-xl bg-[#1F2937]/60 p-3">
              <p className="text-xs text-[#9CA3AF]">Mechanic</p>
              <p className="mt-0.5 text-sm font-semibold capitalize">
                {exercise.mechanic || 'N/A'}
              </p>
            </div>
            <div className="rounded-xl bg-[#1F2937]/60 p-3">
              <p className="text-xs text-[#9CA3AF]">Force</p>
              <p className="mt-0.5 text-sm font-semibold capitalize">
                {exercise.force || 'N/A'}
              </p>
            </div>
          </div>

          {/* Target Muscles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#1E293B] bg-[#1F2937]/30 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Primary Muscles
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {exercise.primaryMuscles?.length > 0 ? (
                  exercise.primaryMuscles.map((m) => (
                    <Badge key={m} variant="emerald">
                      {m}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-[#9CA3AF]">None listed</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[#1E293B] bg-[#1F2937]/30 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Secondary Muscles
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {exercise.secondaryMuscles?.length > 0 ? (
                  exercise.secondaryMuscles.map((m) => (
                    <Badge key={m} variant="default">
                      {m}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-[#9CA3AF]">None listed</span>
                )}
              </div>
            </div>
          </div>

          {/* Step-by-step instructions */}
          {exercise.instructions?.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Instructions
              </h3>
              <ol className="space-y-2">
                {exercise.instructions.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl bg-[#1F2937]/40 p-3 text-sm text-[#F9FAFB]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
