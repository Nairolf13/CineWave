import React, { useRef, useCallback, useEffect, useState } from "react";
import { cn } from "../../utils/cn";

export function Slider({
  className,
  min = 0,
  max = 100,
  step = 1,
  value = [0],
  onValueChange,
  ...props
}) {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  
  const updateValue = useCallback((clientX) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const width = rect.width;
    const offset = clientX - rect.left;
    
    let percentage = offset / width;
    percentage = Math.max(0, Math.min(percentage, 1));
    
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(steppedValue, max));
    
    setCurrentValue([clampedValue]);
    onValueChange?.([clampedValue]);
  }, [min, max, step, onValueChange]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    updateValue(e.clientX);
  }, [updateValue]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    updateValue(e.clientX);
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // Update internal state when prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const percentage = ((currentValue[0] - min) / (max - min)) * 100;
  
  return (
    <div
      ref={sliderRef}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      onMouseDown={handleMouseDown}
      {...props}
    >
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="absolute h-full bg-slate-900"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div
        className="absolute h-4 w-4 rounded-full border border-slate-200 bg-white shadow-sm"
        style={{ left: `calc(${percentage}% - 0.5rem)` }}
      />
    </div>
  );
}

export { Slider as default };
