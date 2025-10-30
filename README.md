# ticket-booking-system-api
Concurrent ticket booking system with seat locking and confirmation using Node.js and Express.js.

## Overview
This project implements a robust ticket booking system that handles concurrent seat reservation requests safely using a seat locking mechanism. It demonstrates best practices for managing in-memory state, handling concurrent access, and preventing race conditions during the booking process.

## Seat Locking Mechanism

### How It Works
The seat locking mechanism ensures that when a seat is locked by a user, it cannot be locked or booked by other users until:
- The seat is confirmed (booking completed)
- The lock expires automatically (default: 1 minute)

### Key Features
1. **Temporary Seat Reservation**: Users can lock seats temporarily before confirming their booking
2. **Automatic Lock Expiration**: Locks expire after a configurable timeout (default: 60 seconds)
3. **Race Condition Prevention**: Prevents double booking through atomic lock operations
4. **Clear Status Messages**: Provides detailed success and error messages for different scenarios

### Seat States
- **Available**: Seat is free and can be locked
- **Locked**: Seat is temporarily reserved by a user (with expiration time)
- **Booked**: Seat is permanently reserved after confirmation

## Concurrent Access Design

### Thread-Safe Operations
The system handles concurrent requests safely by:
- Using in-memory data structures to track seat states
- Implementing atomic operations for seat status changes
- Validating seat availability before any state transition
- Checking lock ownership before confirmation

### Concurrency Scenarios Handled
1. **Multiple users trying to lock the same seat**: Only the first request succeeds
2. **Lock expiration during checkout**: Automatic cleanup of expired locks
3. **Confirmation without valid lock**: Rejected with appropriate error message
4. **Simultaneous booking attempts**: Sequential processing ensures data consistency

## API Endpoints

### 1. View Available Seats
```
GET /seats
```
Returns the current status of all seats

### 2. Lock a Seat
```
POST /lock
Body: { "seatId": "A1", "userId": "user123" }
```
Temporarily locks a seat for the specified user

### 3. Confirm Booking
```
POST /confirm
Body: { "seatId": "A1", "userId": "user123" }
```
Confirms the booking for a previously locked seat

## Technology Stack
- **Node.js**: Runtime environment
- **Express.js**: Web framework for API endpoints
- **In-memory storage**: Simple data structure for seat state management

## Testing Concurrent Requests
The system can be tested with concurrent requests to demonstrate:
- Proper lock enforcement
- Prevention of double booking
- Reliable seat allocation under load
- Correct handling of edge cases

## Error Handling
The API provides clear error messages for:
- Attempting to lock an already locked seat
- Attempting to lock an already booked seat
- Confirming a seat without a valid lock
- Lock expiration scenarios
- Invalid seat IDs or user IDs

## Installation and Usage
```bash
npm install
node index.js
```

## Configuration
- Lock timeout duration can be configured (default: 60 seconds)
- Number of seats can be customized
- Seat naming convention is flexible

## Future Enhancements
- Database integration for persistent storage
- User authentication and session management
- Payment gateway integration
- Real-time seat availability updates using WebSockets
- Load balancing for high-traffic scenarios
