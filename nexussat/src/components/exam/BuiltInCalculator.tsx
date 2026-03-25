"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const BUTTONS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0",  ".", "⌫", "="],
];

export default function BuiltInCalculator() {
  const [display, setDisplay] = useState("0");
  const [pending, setPending] = useState<{ value: number; op: string } | null>(null);
  const [fresh,   setFresh  ] = useState(true);  // next digit replaces display

  function press(key: string) {
    if (key === "C") {
      setDisplay("0"); setPending(null); setFresh(true); return;
    }
    if (key === "⌫") {
      setDisplay((d) => d.length > 1 ? d.slice(0, -1) : "0"); return;
    }
    if (key === "±") {
      setDisplay((d) => d.startsWith("-") ? d.slice(1) : "-" + d); return;
    }
    if (key === "%") {
      setDisplay((d) => String(parseFloat(d) / 100)); return;
    }

    const ops = ["÷", "×", "−", "+"];
    if (ops.includes(key)) {
      setPending({ value: parseFloat(display), op: key });
      setFresh(true);
      return;
    }

    if (key === "=") {
      if (!pending) return;
      const a = pending.value;
      const b = parseFloat(display);
      let result = 0;
      if (pending.op === "+") result = a + b;
      if (pending.op === "−") result = a - b;
      if (pending.op === "×") result = a * b;
      if (pending.op === "÷") result = b !== 0 ? a / b : NaN;
      setDisplay(String(isNaN(result) ? "Error" : result));
      setPending(null);
      setFresh(true);
      return;
    }

    // Digit or decimal
    if (key === "." && display.includes(".") && !fresh) return;
    if (fresh) {
      setDisplay(key === "." ? "0." : key);
      setFresh(false);
    } else {
      setDisplay((d) => d === "0" && key !== "." ? key : d + key);
    }
  }

  return (
    <div className="card w-52 space-y-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Calculator</p>

      {/* Display */}
      <div className="bg-surface rounded-lg px-3 py-2 text-right font-mono text-lg text-slate-100 overflow-hidden">
        {display.length > 12 ? parseFloat(display).toExponential(4) : display}
      </div>

      {/* Button grid */}
      <div className="space-y-1">
        {BUTTONS.map((row, ri) => (
          <div key={ri} className="grid grid-cols-4 gap-1">
            {row.map((key) => {
              const isOp     = ["÷","×","−","+","="].includes(key);
              const isClear  = key === "C";
              const isAction = ["±","%","⌫"].includes(key);
              const isZero   = key === "0";

              return (
                <button
                  key={key}
                  onClick={() => press(key)}
                  className={cn(
                    "h-9 rounded-lg text-sm font-medium transition-colors",
                    isZero   && "col-span-1",
                    isOp     && "bg-brand-600 hover:bg-brand-500 text-white",
                    isClear  && "bg-red-500/20 hover:bg-red-500/30 text-red-300",
                    isAction && "bg-surface-muted hover:bg-white/10 text-slate-300",
                    !isOp && !isClear && !isAction && "bg-surface hover:bg-white/10 text-slate-200"
                  )}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
