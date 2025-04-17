/**
 * Formats a date string to a human-readable format
 * @param dateString ISO date string to format
 * @param options Optional DateTimeFormatOptions to customize the format
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string => {
  return new Date(dateString).toLocaleString(undefined, options);
};

/**
 * Formats a date string to a short date format (e.g., MM/DD/YYYY)
 * @param dateString ISO date string to format
 * @returns Formatted short date string
 */
export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Formats a date string to a time format (e.g., HH:MM)
 * @param dateString ISO date string to format
 * @returns Formatted time string
 */
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}; 