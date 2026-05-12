export interface Bus {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  companyName: string;
  busNumber: string;
  contactNumber: string;
  terminalLocation: string;
  standNumber: string;
  isAC: boolean;
  type: "Luxury" | "Executive" | "Non-AC" | "Standard";
}

export interface Company {
  name: string;
  description: string;
  totalBuses: string;
  routes: string[];
  contactInfo: string;
  officeAddress: string;
}

export interface SearchFilters {
  origin: string;
  destination: string;
  date?: string;
}
