export interface Bus {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  companyName: string;
  busNumber: string;
  contactNumber: string;
  isAC: boolean;
  type: "Luxury" | "Executive" | "Non-AC" | "Standard";
}

export interface SearchFilters {
  origin: string;
  destination: string;
  date?: string;
}
