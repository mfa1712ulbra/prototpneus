"use client";

import { useState } from "react";
import type { Vehicle, Tire } from "@/lib/data";
import { TireInfoDialog } from "./tire-info-dialog";
import { cn } from "@/lib/utils";

type VehicleDiagramProps = {
  vehicle: Vehicle;
};

// Tire positions for different models
const tirePositions: Record<string, Record<number, string>> = {
  "6x2": { // 6 tires
    1: "top-[10%] left-[5%]",
    2: "top-[10%] right-[5%]",
    3: "bottom-[10%] left-[5%]",
    4: "bottom-[10%] right-[5%]",
    5: "bottom-[10%] left-[25%]",
    6: "bottom-[10%] right-[25%]",
  },
  "6x4": { // 10 tires
    1: "top-[5%] left-[5%]",
    2: "top-[5%] right-[5%]",
    3: "bottom-[25%] left-[5%]",
    4: "bottom-[25%] right-[5%]",
    5: "bottom-[25%] left-[25%]",
    6: "bottom-[25%] right-[25%]",
    7: "bottom-[5%] left-[5%]",
    8: "bottom-[5%] right-[5%]",
    9: "bottom-[5%] left-[25%]",
    10: "bottom-[5%] right-[25%]",
  },
  "4x2": { // 4 tires
    1: "top-[15%] left-[5%]",
    2: "top-[15%] right-[5%]",
    3: "bottom-[15%] left-[5%]",
    4: "bottom-[15%] right-[5%]",
  },
};

export function VehicleDiagram({ vehicle }: VehicleDiagramProps) {
  const [selectedTire, setSelectedTire] = useState<Tire | null>(null);
  const positions = tirePositions[vehicle.model] || tirePositions['6x2'];

  const handleSave = (updatedTire: Tire) => {
    // Here you would typically update the state or call an API
    console.log("Saving tire:", updatedTire);
  };

  return (
    <div className="w-full">
      <div className="relative mx-auto h-96 w-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-2">
        {/* Chassis representation */}
        <div className="absolute left-1/2 top-[5%] h-[90%] w-1 -translate-x-1/2 bg-gray-200"></div>
        <div className="absolute left-1/2 top-[10%] h-2 w-24 -translate-x-1/2 rounded-sm bg-gray-300"></div>
        <div className="absolute bottom-[10%] left-1/2 h-2 w-32 -translate-x-1/2 rounded-sm bg-gray-300"></div>

        {vehicle.tires.map((tire) => (
          <button
            key={tire.id}
            onClick={() => setSelectedTire(tire)}
            className={cn(
              "absolute flex h-10 w-10 items-center justify-center rounded-full border-2 bg-gray-600 font-bold text-white shadow-md transition-transform hover:scale-110",
              tire.treadDepth < 5 ? "border-red-500" : "border-gray-800",
              positions[tire.position]
            )}
            aria-label={`Inspecionar pneu ${tire.position}`}
          >
            {tire.position}
          </button>
        ))}
      </div>
      {selectedTire && (
        <TireInfoDialog
          tire={selectedTire}
          isOpen={!!selectedTire}
          onOpenChange={(open) => {
            if (!open) setSelectedTire(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
