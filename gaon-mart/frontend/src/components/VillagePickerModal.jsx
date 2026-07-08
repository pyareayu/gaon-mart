import { useVillage } from "../context/VillageContext";

export default function VillagePickerModal() {
  const { villages, village, setVillage, pickerOpen, setPickerOpen } = useVillage();

  if (!pickerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-earth-900/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-xl2 rounded-t-2xl shadow-card max-h-[85vh] flex flex-col">
        <div className="p-5 border-b border-earth-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-700 text-lg">Choose your village</h2>
            <p className="text-sm text-earth-800/60">
              We deliver across Muzaffarpur — pick your nearest GaonMart godown
            </p>
          </div>
          {village && (
            <button
              onClick={() => setPickerOpen(false)}
              className="text-earth-800/50 hover:text-earth-900 text-xl px-2"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>
        <div className="overflow-y-auto p-3 grid sm:grid-cols-2 gap-2">
          {villages.map((v) => (
            <button
              key={v.id}
              onClick={() => setVillage(v)}
              className={`text-left p-4 rounded-xl border-2 transition-colors focus-ring ${
                village?.id === v.id
                  ? "border-leaf-500 bg-leaf-50"
                  : "border-earth-100 hover:border-leaf-400"
              }`}
            >
              <div className="font-semibold text-earth-900">{v.name}</div>
              <div className="text-xs text-earth-800/60">{v.block} block</div>
              <div className="text-xs text-leaf-600 mt-1">⏱ {v.etaMins} min delivery</div>
              <div className="text-xs text-earth-800/50 mt-0.5">{v.tagline}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
