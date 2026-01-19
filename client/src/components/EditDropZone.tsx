
import { useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";

export const EditDropZone = ({ isDragging }: { isDragging: boolean }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "EDIT",
  });

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          ref={setNodeRef}
          key="edit-zone"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`fixed left-0 top-0 z-50 flex h-screen w-24 flex-col items-center justify-center border-r-2 border-dashed
            ${isOver
              ? "border-blue-600 bg-blue-100/80 text-blue-700"
              : "border-gray-300 bg-white/80 text-gray-500"
            }`}
        >
          <Pencil size={36} />
          <span className="mt-2 text-xs font-medium">Drop to edit</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
