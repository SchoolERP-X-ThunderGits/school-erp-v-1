export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // Auto-dismiss duration in milliseconds
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}