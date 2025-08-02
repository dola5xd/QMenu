"use client";

import { useState, useEffect } from "react";
import { Input } from "@/_components/ui/input";
import { generatePalette } from "@/_lib/utils";

export default function ColorPalettePicker() {
  const [primaryColor, setPrimaryColor] = useState("#4e342e");
  const [palette, setPalette] = useState(generatePalette("#4e342e"));

  useEffect(() => {
    setPalette(generatePalette(primaryColor));
  }, [primaryColor]);

  return (
    <div className="flex flex-col gap-6">
      {/* Color Picker */}
      <div>
        <label className="text-sm font-medium">Pick Base Color</label>
        <Input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          className="w-16 mt-1"
        />
      </div>

      {/* Generated Palette Preview */}
      <div>
        <p className="text-sm mb-2 text-muted-foreground">Generated Palette:</p>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(palette).map(([label, hex]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 rounded-full border"
                style={{ backgroundColor: hex }}
              />
              <span className="text-xs text-center">{label}</span>
              <span className="text-[10px] text-muted-foreground">{hex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
