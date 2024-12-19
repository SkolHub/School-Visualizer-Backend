export interface TimeSlot {
  displayName: string;
  color: string;
  symbolName: string;
  endTime: Date | null;
  startTime: Date | null;
  nextTimeSlot: {
    displayName: string;
    color: string;
    symbolName: string;
  } | null;
}