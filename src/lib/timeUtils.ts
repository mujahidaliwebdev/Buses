/**
 * Calculates the duration between two time strings (e.g., "08:00 AM" and "11:00 AM")
 * Returns format: "3h 0m"
 */
export function calculateDuration(departure: string, arrival: string): string {
  try {
    if (!departure || !arrival) return "";

    const parseTime = (timeStr: string) => {
      // Handle various formats but primarily looking for "HH:mm AM/PM"
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return null;

      let [_, hours, minutes, period] = match;
      let h = parseInt(hours);
      const m = parseInt(minutes);

      if (period.toUpperCase() === "PM" && h < 12) h += 12;
      if (period.toUpperCase() === "AM" && h === 12) h = 0;

      return h * 60 + m;
    };

    const depMinutes = parseTime(departure);
    const arrMinutes = parseTime(arrival);

    if (depMinutes === null || arrMinutes === null) return "";

    let diff = arrMinutes - depMinutes;
    
    // If arrival is on the next day
    if (diff < 0) {
      diff += 24 * 60;
    }

    const h = Math.floor(diff / 60);
    const m = diff % 60;

    return `${h}h ${m}m`;
  } catch (error) {
    console.error("Error calculating duration:", error);
    return "";
  }
}
