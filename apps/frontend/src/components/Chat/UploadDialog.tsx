import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";

type UploadDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function UploadDialog({ open, onClose, onSelect }: UploadDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="
              relative w-96 p-6
              rounded-2xl
              bg-gradient-to-br from-amber-50 via-pink-50 to-emerald-50
              shadow-[0_12px_40px_rgba(0,0,0,0.25)]
              border-2 border-dashed border-emerald-400
            "
            initial={{ scale: 0.85, rotate: -2, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.85, rotate: 2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Upload className="text-emerald-600" />
              <h3 className="text-xl font-bold text-emerald-700">
                Add an Image
              </h3>
            </div>

            {/* Upload box */}
            <label
              className="
                flex flex-col items-center justify-center
                h-40 w-full cursor-pointer
                rounded-xl
                border-2 border-dashed border-emerald-400
                bg-white/60
                hover:bg-white/80
                transition
              "
            >
              <Upload size={32} className="text-emerald-500 mb-2" />
              <p className="font-bold text-emerald-700">
                Click to upload
              </p>
              <p className="text-sm text-emerald-600">
                PNG, JPG, WEBP
              </p>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  onSelect(e);
                  onClose();
                }}
              />
            </label>

            {/* Footer hint */}
            <p className="mt-4 text-xs text-gray-600 text-center">
              Images will be added directly to the canvas
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
