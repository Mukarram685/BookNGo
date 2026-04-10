import { Wifi, Charger, Food, Drink, Seat, AC } from '../assets/svg';
export interface BusSchedule {
    _id: string;
    busId: string;
    busName: string;
    busType: string;
    busNumber: string;
    fromCity: string;
    toCity: string;
    departureTime: string; // ISO string or "8:00 AM"
    arrivalTime: string;   // ISO string or "12:30 PM"
    duration: string;      // e.g., "4h 30m"
    date: string;          // e.g., "2024-05-25"
    price: number;
    seatsAvailable: number;
    totalSeats: number;
    seatLayout: '2x2' | '2x1' | '3x2' | 'sleeper';
    bookedSeats: number[];
    amenities: string[];   // e.g., ["Free Wi-Fi", "Charging Point"]
    status: 'AVAILABLE' | 'FULL' | 'CANCELLED';
    image?: string;        // URL or local asset path
}

export const amenityIcons = {
  'Wifi': Wifi,
  'Charging Point': Charger,
  'Food': Food,
  'Water': Drink,
  'Comfortable Seats': Seat,
  'AC': AC,
  'Snacks': Food,
  'Water Bottle': Drink,
};
