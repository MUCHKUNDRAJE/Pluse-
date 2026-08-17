import React from 'react';
import { Check, Truck, Hospital, UserCheck, Navigation } from 'lucide-react';
import { clsx } from 'clsx';

export interface StageStep {
  label: string;
  sublabel?: string;
}

interface StageStepperProps {
  stages: string[];
  currentStageIndex: number;
  onSelectStage?: (index: number) => void;
  className?: string;
}

export const StageStepper: React.FC<StageStepperProps> = ({
  stages,
  currentStageIndex,
  onSelectStage,
  className
}) => {
  const getStageIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Navigation className="w-4 h-4" />;
      case 1:
        return <Truck className="w-4 h-4" />;
      case 2:
        return <UserCheck className="w-4 h-4" />;
      case 3:
        return <Truck className="w-4 h-4" />;
      case 4:
        return <Hospital className="w-4 h-4" />;
      default:
        return <Check className="w-4 h-4" />;
    }
  };

  return (
    <div className={clsx("w-full py-2", className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStageIndex / Math.max(1, stages.length - 1)) * 100}%` }}
        />

        {stages.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isUpcoming = idx > currentStageIndex;

          return (
            <button
              key={stage}
              onClick={() => onSelectStage && onSelectStage(idx)}
              disabled={!onSelectStage}
              className={clsx(
                "relative z-10 flex flex-col items-center group focus:outline-none transition-all duration-300",
                onSelectStage ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md",
                  isCompleted && "bg-emerald-600 text-white ring-4 ring-emerald-100",
                  isCurrent && "bg-blue-600 text-white ring-4 ring-blue-100 scale-110 animate-bounce",
                  isUpcoming && "bg-slate-100 text-slate-400 border border-slate-300"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : getStageIcon(idx)}
              </div>

              <span
                className={clsx(
                  "mt-2 text-xs font-semibold max-w-[85px] text-center transition-colors line-clamp-2",
                  isCurrent && "text-blue-700 font-extrabold",
                  isCompleted && "text-emerald-700 font-bold",
                  isUpcoming && "text-slate-400"
                )}
              >
                {stage}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
