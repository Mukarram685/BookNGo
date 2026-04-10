export interface PassengerDetail {
    seatNumber: number;
    passengerName: string;
    passengerCNIC: string;
    passengerPhone: string;
    gender: 'Male' | 'Female';
}

export interface BookingRequest {
    scheduleId: string;
    seats: PassengerDetail[];
    paymentIntentId?: string;
}

export interface TicketDetails {
    pnr: string;
    bookingId: string;
    bookerName: string;
    bookerPhone: string;
    fromCity: string;
    toCity: string;
    fromTerminal: string;
    toTerminal: string;
    travelDate: string;
    departureTime: string;
    arrivalTime: string;
    busNumber: string;
    busType: string;
    companyName: string;
    totalFare: number;
    totalSeats: number;
    passengers: PassengerDetail[];
}

export interface BookingResponse {
    success: boolean;
    message: string;
    ticket: TicketDetails;
}
