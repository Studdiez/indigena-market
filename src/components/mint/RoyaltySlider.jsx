import React from "react";
import { Slider } from "@/components/ui/slider";
import { Leaf } from "lucide-react";

export default function RoyaltySlider({ royalty, setRoyalty, sevaAllocation, setSevaAllocation }) {
  return (
    <div className="space-y-6">
      {/* Royalty */}
      <div className="rounded-2xl bg-[#1A1A1A] border border-[#333] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold">Royalty Percentage</p>
            <p className="text-xs text-gray-500 mt-0.5">Earn on every resale</p>
          </div>
          <div className="text-2xl font-bold text-[#FDB910]">{royalty}%</div>
        </div>
        <Slider
          value={[royalty]}
          onValueChange={([val]) => setRoyalty(val)}
          min={5}
          max={30}
          step={1}
          className="[&_[role=slider]]:bg-[#FDB910] [&_[role=slider]]:border-[#FDB910] [&_.range]:bg-[#FDB910]"
        />
        <div className="flex justify-between mt-2 text-[10px] text-gray-600">
          <span>5%</span>
          <span>30%</span>
        </div>
      </div>

      {/* SEVA Allocation */}
      <div className="rounded-2xl bg-[#1A1A1A] border border-[#2A5C3E]/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#2A5C3E]" />
            <div>
              <p className="text-sm font-semibold">SEVA Impact</p>
              <p className="text-xs text-gray-500 mt-0.5">Donate royalties to cultural causes</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-[#2A5C3E]">{sevaAllocation}%</div>
        </div>
        <Slider
          value={[sevaAllocation]}
          onValueChange={([val]) => setSevaAllocation(val)}
          min={0}
          max={100}
          step={5}
          className="[&_[role=slider]]:bg-[#2A5C3E] [&_[role=slider]]:border-[#2A5C3E] [&_.range]:bg-[#2A5C3E]"
        />
        <div className="flex justify-between mt-2 text-[10px] text-gray-600">
          <span>0% (Keep all)</span>
          <span>100% (Full donation)</span>
        </div>
        {sevaAllocation > 0 && (
          <p className="text-xs text-[#2A5C3E] mt-3">
            ✦ {sevaAllocation}% of your {royalty}% royalties go to cultural preservation
          </p>
        )}
      </div>
    </div>
  );
}