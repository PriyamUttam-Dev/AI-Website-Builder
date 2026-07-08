import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="h-full overflow-auto">
      <h2 className="text-sm font-semibold mb-4 text-white/85">Build steps</h2>
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={`${step.id}-${idx}`}
            className={`p-3 rounded-xl cursor-pointer transition ${
              currentStep === step.id
                ? 'bg-white/5 ring-1 ring-white/10'
                : 'hover:bg-white/[0.04] ring-1 ring-transparent hover:ring-white/10'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div className="flex items-center gap-2">
              {step.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-emerald-300" />
              ) : step.status === 'in-progress' ? (
                <Clock className="w-5 h-5 text-blue-400" />
              ) : (
                <Circle className="w-5 h-5 text-white/25" />
              )}
              <h3 className="text-sm font-medium text-white/90">{step.title}</h3>
            </div>
            <p className="text-xs text-white/55 mt-2 leading-5">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}