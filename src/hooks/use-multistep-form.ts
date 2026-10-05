import { useState } from 'react';

/**
 * Tracks the active step of a multistep form. Steps are addressed by index so
 * the form can keep every field's value in its own state while only the
 * current step's inputs are rendered.
 */
export default function useMultistepForm(stepCount: number) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // Furthest step the user has reached; earlier steps can be revisited freely.
  const [furthestStepIndex, setFurthestStepIndex] = useState(0);

  function goTo(index: number) {
    const clamped = Math.min(Math.max(index, 0), stepCount - 1);
    setCurrentStepIndex(clamped);
    setFurthestStepIndex((furthest) => Math.max(furthest, clamped));
  }

  return {
    currentStepIndex,
    furthestStepIndex,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === stepCount - 1,
    goTo,
    next: () => goTo(currentStepIndex + 1),
    back: () => goTo(currentStepIndex - 1),
  };
}
