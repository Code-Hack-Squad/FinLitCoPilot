// Completely silent haptics utility - audio completely removed for clean professional institutional usage
class ProfessionalHaptics {
  public tap(intensity: 'light' | 'medium' | 'heavy' = 'light') {
    // Only optional mobile physical vibration if supported by device
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        const duration = intensity === 'light' ? 6 : intensity === 'medium' ? 12 : 20;
        navigator.vibrate(duration);
      } catch (e) {
        // Ignore
      }
    }
  }

  public toggleSound() {
    return false;
  }

  public isSoundEnabled() {
    return false;
  }
}

export const haptics = new ProfessionalHaptics();
