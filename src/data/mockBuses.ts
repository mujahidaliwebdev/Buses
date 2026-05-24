import { Bus } from '../types';

export const PAKISTAN_CITIES = [
  // Popular Cities
  "Lahore", "Islamabad", "Karachi", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala", "Sialkot", "Peshawar", "Quetta",
  // All Other Cities
  "18 Hazari", "Ahmadpur East", "Ahmedpur Sial", "Alipur", "Arifwala", "Attock", "Bahawalnagar", "Bahawalpur", "Bhakkar", "Bhalwal", "Bhera", "Bhowana", "Burewala",
  "Chak Jhumra", "Chakwal", "Chaubara", "Chichawatni", "Chiniot", "Chishtian", "Choa Saidan Shah", "Chowk Azam", "Chowk Munda", "Chunian",
  "Darya Khan", "Daska", "Depalpur", "Dera Ghazi Khan", "Dina", "Dunyapur", "Fateh Jang", "Fatehpur", "Feroze Wattwan", "Ferozewala", "Fort Abbas",
  "Garh Moor", "Gojra", "Gujar Khan", "Gujrat", "Hafizabad", "Haroonabad", "Hasan Abdal", "Hasilpur", "Hazro",
  "Isa Khel", "Jahanian", "Jalalpur Pirwala", "Jampur", "Jand", "Jaranwala", "Jatoi", "Jhang", "Jhelum",
  "Kabirwala", "Kahror Pacca", "Kahuta", "Kallar Kahar", "Kalur Kot", "Kamalia", "Kamoke", "Karor", "Kasur", "Khairpur Tamewali", "Khanewal",
  "Khanpur", "Kharian", "Khurrianwala", "Khushab", "Kot Addu", "Kot Chutta", "Kot Momin", "Kot Radha Kishan", "Kotli Sattian",
  "Lalian", "Larkana", "Lawa", "Layyah", "Liaquatpur", "Lodhran", "Mailsi", "Malakwal", "Manawala", "Mandi Bahauddin", "Mankera",
  "Mian Channu", "Mianwali", "Minchinabad", "Muridke", "Murree", "Muzaffargarh", "Nankana Sahib", "Narowal", "Noorpur Thal", "Nowshera Virkan", "Okara",
  "Pakpattan", "Pasrur", "Pattoki", "Phalia", "Pind Dadan Khan", "Pindi Bhattian", "Pindi Gheb", "Piplan", "Pir Mahal",
  "Quaidabad", "Rahim Yar Khan", "Raiwind", "Rajanpur", "Rang Pur", "Renala Khurd", "Rojhan",
  "Sadiqabad", "Safdarabad", "Sahiwal", "Sahiwal", "Sambrial", "Sammundri", "Sanawan", "Sangla Hill", "Sarai Alamgir", "Sargodha", "Shahkot", "Shahpur",
  "Shakargarh", "Sharaqpur", "Sheikhupura", "Shorkot", "Shujabad", "Sillanwali", "Sohawa", "Sukkar",
  "Talagang", "Tandlianwala", "Taunsa", "Taxila", "Toba Tek Singh", "Vehari", "Vehova", "Wazirabad", "Yazman", "Zafarwal"
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
    terminalLocation: "Thokar Niaz Baig, Lahore",
    standNumber: "Stand 4",
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
    terminalLocation: "Band Road, Lahore",
    standNumber: "Stand 1",
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
    terminalLocation: "Pindi Bypass, Lahore",
    standNumber: "Stand 15",
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
    terminalLocation: "Vehari Chowk, Multan",
    standNumber: "Stand 8",
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
    terminalLocation: "Yadgaar Chowk, Faisalabad",
    standNumber: "Stand 2",
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
    terminalLocation: "Niaz Baig, Lahore",
    standNumber: "Stand 5",
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
    terminalLocation: "Kalma Chowk, Lahore",
    standNumber: "Stand 3",
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
