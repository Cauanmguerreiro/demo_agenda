import { BrandColors, TerminologyConfig, DemoConfig } from '../config/defaultConfig';

export function applyBrandColorsToDocument(colors: BrandColors): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  
  root.style.setProperty('--brand-primary', colors.primary);
  root.style.setProperty('--brand-primary-hover', colors.primaryHover || colors.primary);
  root.style.setProperty('--brand-secondary', colors.secondary);
  root.style.setProperty('--brand-accent', colors.accent);
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--surface', colors.surface);
  root.style.setProperty('--text-primary', colors.textPrimary);
}

export function getLabel(
  terminology: TerminologyConfig,
  key: keyof TerminologyConfig,
  fallback: string = ''
): string {
  return (terminology && terminology[key]) || fallback;
}

export function downloadJsonFile(data: unknown, filename: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const STORAGE_KEY_DEMO = 'applet_scheduling_demo_id';
export const STORAGE_KEY_CUSTOM_CONFIG = 'applet_scheduling_custom_config';
export const STORAGE_KEY_APPOINTMENTS = 'applet_scheduling_appointments';
export const STORAGE_KEY_CLIENTS = 'applet_scheduling_clients';
export const STORAGE_KEY_SERVICES = 'applet_scheduling_services';
export const STORAGE_KEY_SETTINGS = 'applet_scheduling_business_settings';

export function getStoredDemoId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_DEMO);
  } catch {
    return null;
  }
}

export function setStoredDemoId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_DEMO, id);
  } catch {
    // ignore
  }
}

export function clearLocalStorageDemoData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_CONFIG);
    localStorage.removeItem(STORAGE_KEY_APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEY_CLIENTS);
    localStorage.removeItem(STORAGE_KEY_SERVICES);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
  } catch {
    // ignore
  }
}
