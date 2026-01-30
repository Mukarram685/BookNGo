export interface BusSchedule {
    _id: string;
    busName: string; // Mapped from company.name or bus.name
    busType: string; // e.g., "AC Sleeper Coach"
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
    amenities: string[];   // e.g., ["Free Wi-Fi", "Charging Point"]
    status: 'AVAILABLE' | 'FULL' | 'CANCELLED';
    image?: string;        // URL or local asset path
}
