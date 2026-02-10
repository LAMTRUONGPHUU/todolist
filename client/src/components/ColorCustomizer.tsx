import { useState } from "react";
import { Palette, X } from "lucide-react";
import type { TodoStatus } from "@/types/todo";
import { STATUS_COLUMNS, STATUS_LABEL } from "@/constants/todo";
import { COLOR_OPTIONS } from "@/constants/statusColors";
import { useStatusColors } from "@/contexts/ColorContext";

export const ColorCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { statusColors, updateStatusColor, resetColors } = useStatusColors();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all hover:scale-110"
        title="Customize colors"
      >
        <Palette className="h-6 w-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Customize Status Colors</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Color Selectors */}
            <div className="space-y-4">
              {STATUS_COLUMNS.map((status) => (
                <div key={status} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {STATUS_LABEL[status]}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_OPTIONS.map((colorOption) => {
                      const isSelected = statusColors[status].bg.includes(colorOption.value);
                      return (
                        <button
                          key={colorOption.value}
                          onClick={() => updateStatusColor(status, colorOption.value)}
                          className={`h-10 w-full rounded border-2 transition ${isSelected
                              ? "border-gray-900 ring-2 ring-gray-400"
                              : "border-transparent hover:border-gray-300"
                            } bg-${colorOption.value}-100`}
                          title={colorOption.name}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Reset Button */}
            <button
              onClick={resetColors}
              className="mt-6 w-full rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
            >
              Reset to Default Colors
            </button>
          </div>
        </div>
      )}
    </>
  );
};
