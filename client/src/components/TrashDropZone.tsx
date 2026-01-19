import { useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

export const TrashDropZone = ({ isDragging }: { isDragging: boolean }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "TRASH",
  });

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          ref={setNodeRef}
          key="trash-zone"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`fixed right-0 top-0 z-50 flex h-screen w-24 flex-col items-center justify-center border-l-2 border-dashed
            ${isOver
              ? "border-red-600 bg-red-100/80 text-red-700"
              : "border-gray-300 bg-white/80 text-gray-500"
            }`}
        >
          <Trash2 size={36} />
          <span className="mt-2 text-xs font-medium">Drop to delete</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
