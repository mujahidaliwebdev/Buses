import { Bus } from '../types';

export const PAKISTAN_CITIES = [
  "Lahore", "Karachi", "Islamabad", "Faisalabad", "Multan", 
  "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Rawalpindi",
  "Sargodha", "Bahawalpur", "Sukkur", "Larkana", "Sheikhupura"
];

export const BUS_COMPANIES = [
  "Daewoo Express",
  "Faisal Movers",
  "Sania Express",
  "Bilal Travels",
  "Skyways",
  "Manthar Transport",
  "Road Master",
  "Silk Line",
  "Waraich Express"
];

export const MOCK_BUSES: Bus[] = [
  {
    id: "1",
    origin: "Lahore",
    destination: "Faisalabad",
    departureTime: "08:00 AM",
    arrivalTime: "10:30 AM",
    duration: "2h 30m",
    fare: 1200,
    companyName: "Daewoo Express",
    busNumber: "LZ-552",
    contactNumber: "042-111-007-007",
    isAC: true,
    type: "Luxury"
  },
  {
    id: "2",
    origin: "Lahore",
    destination: "Faisalabad",
    departureTime: "09:30 AM",
    arrivalTime: "12:00 PM",
    duration: "2h 30m",
    fare: 950,
    companyName: "Faisal Movers",
    busNumber: "FM-101",
    contactNumber: "0311-1222260",
    isAC: true,
    type: "Executive"
  },
  {
    id: "3",
    origin: "Lahore",
    destination: "Islamabad",
    departureTime: "07:00 AM",
    arrivalTime: "11:30 AM",
    duration: "4h 30m",
    fare: 1800,
    companyName: "Road Master",
    busNumber: "RM-990",
    contactNumber: "0310-1111111",
    isAC: true,
    type: "Luxury"
  },
  {
    id: "4",
    origin: "Multan",
    destination: "Lahore",
    departureTime: "10:00 AM",
    arrivalTime: "02:30 PM",
    duration: "4h 30m",
    fare: 1400,
    companyName: "Skyways",
    busNumber: "SW-442",
    contactNumber: "042-111-555-444",
    isAC: true,
    type: "Standard"
  },
  {
    id: "5",
    origin: "Faisalabad",
    destination: "Lahore",
    departureTime: "11:00 AM",
    arrivalTime: "01:30 PM",
    duration: "2h 30m",
    fare: 650,
    companyName: "Local Express",
    busNumber: "LEC-001",
    contactNumber: "041-222-3333",
    isAC: false,
    type: "Non-AC"
  },
  {
    id: "6",
    origin: "Lahore",
    destination: "Faisalabad",
    departureTime: "06:00 AM",
    arrivalTime: "08:30 AM",
    duration: "2h 30m",
    fare: 800,
    companyName: "Sania Express",
    busNumber: "SE-221",
    contactNumber: "0300-1234567",
    isAC: true,
    type: "Standard"
  },
  {
    id: "7",
    origin: "Lahore",
    destination: "Faisalabad",
    departureTime: "02:00 PM",
    arrivalTime: "04:30 PM",
    duration: "2h 30m",
    fare: 1500,
    companyName: "Silk Line",
    busNumber: "SL-778",
    contactNumber: "0321-7778881",
    isAC: true,
    type: "Luxury"
  }
];

export const POPULAR_ROUTES = [
  { from: "Lahore", to: "Faisalabad", count: "40+ Buses daily" },
  { from: "Faisalabad", to: "Lahore", count: "45+ Buses daily" },
  { from: "Lahore", to: "Multan", count: "25+ Buses daily" },
  { from: "Multan", to: "Lahore", count: "30+ Buses daily" },
  { from: "Lahore", to: "Islamabad", count: "50+ Buses daily" },
  { from: "Islamabad", to: "Lahore", count: "55+ Buses daily" }
];
