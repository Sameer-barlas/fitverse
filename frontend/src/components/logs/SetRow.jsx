import { Trash2 } from 'lucide-react';

export default function SetRow({
  setIndex,
  setItem,
  trackingType,
  onChange,
  onRemove,
  canRemove,
}) {
  const isTime = trackingType === 'time';

  return (
    <div className="grid grid-cols-12 items-center gap-2 sm:gap-3 py-1.5">
      <div className="col-span-2 sm:col-span-1">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F2937] text-xs font-bold text-[#9CA3AF] font-mono-num">
          #{setIndex + 1}
        </span>
      </div>

      {isTime ? (
        <div className="col-span-8 sm:col-span-9">
          <label className="sr-only">Duration in seconds for set {setIndex + 1}</label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="36000"
              value={setItem.durationSec ?? ''}
              onChange={(e) =>
                onChange(setIndex, {
                  durationSec: e.target.value === '' ? '' : Number(e.target.value),
                })
              }
              placeholder="Duration (sec)"
              required
              className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2 pr-12 text-sm text-[#F9FAFB] font-mono-num focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
              sec
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="col-span-4 sm:col-span-5">
            <label className="sr-only">Reps for set {setIndex + 1}</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="200"
                value={setItem.reps ?? ''}
                onChange={(e) =>
                  onChange(setIndex, {
                    ...setItem,
                    reps: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                placeholder="Reps"
                required
                className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2 pr-12 text-sm text-[#F9FAFB] font-mono-num focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
                reps
              </span>
            </div>
          </div>

          <div className="col-span-4 sm:col-span-4">
            <label className="sr-only">Weight in kg for set {setIndex + 1}</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="1000"
                step="0.5"
                value={setItem.weightKg ?? 0}
                onChange={(e) =>
                  onChange(setIndex, {
                    ...setItem,
                    weightKg: e.target.value === '' ? 0 : Number(e.target.value),
                  })
                }
                placeholder="0"
                className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2 pr-9 text-sm text-[#F9FAFB] font-mono-num focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
                kg
              </span>
            </div>
          </div>
        </>
      )}

      <div className="col-span-2 flex justify-end">
        <button
          type="button"
          onClick={() => onRemove(setIndex)}
          disabled={!canRemove}
          aria-label={`Remove set ${setIndex + 1}`}
          className="rounded-lg p-2 text-[#9CA3AF] hover:bg-[#EF4444]/10 hover:text-[#EF4444] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
