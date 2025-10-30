// Ticket Booking System with Seat Locking and Confirmation
// Node.js + Express.js Application

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// ============================================
// IN-MEMORY SEAT DATA STRUCTURE
// ============================================
// This section contains the in-memory data structure for managing seats
// Each seat has:
// - id: unique seat identifier
// - status: 'available', 'locked', 'booked'
// - lockedBy: user ID who locked the seat (null if not locked)
// - lockedAt: timestamp when the seat was locked (null if not locked)
// - bookedBy: user ID who booked the seat (null if not booked)

const LOCK_TIMEOUT = 60000; // 1 minute in milliseconds

let seats = [
  { id: 'A1', status: 'available', lockedBy: null, lockedAt: null, bookedBy: null },
  { id: 'A2', status: 'available', lockedBy: null, lockedAt: null, bookedBy: null },
  { id: 'A3', status: 'available', lockedBy: null, lockedAt: null, bookedBy: null },
  { id: 'A4', status: 'available', lockedBy: null, lockedAt: null, bookedBy: null },
  { id: 'A5', status: 'available', lockedBy: null, lockedAt: null, bookedBy: null },
  { id: 'B1', status: 'available', lockedBy: null, lockedAt: null, bookedBy: null },
  { id: 'B2', status: 'available', lockedBy: null, lockedAt: null, bookedBy: null },
  { id: 'B3', status: 'available', lockedBy: null, lockedAt: null, bookedBy: null },
  { id: 'B4', status: 'available', lockedBy: null, lockedAt: null, bookedBy: null },
  { id: 'B5', status: 'available', lockedBy: null, lockedAt: null, bookedBy: null },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Function to check and release expired locks
const releaseExpiredLocks = () => {
  const now = Date.now();
  seats.forEach(seat => {
    if (seat.status === 'locked' && seat.lockedAt && (now - seat.lockedAt) > LOCK_TIMEOUT) {
      seat.status = 'available';
      seat.lockedBy = null;
      seat.lockedAt = null;
    }
  });
};

// ============================================
// API ENDPOINTS
// ============================================

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Ticket Booking System API',
    endpoints: [
      'GET /seats - View all available seats',
      'POST /lock-seat - Lock a seat for booking',
      'POST /confirm-booking - Confirm a locked seat',
    ],
  });
});

// 1. Endpoint to view all seats
app.get('/seats', (req, res) => {
  // Release any expired locks before returning seat status
  releaseExpiredLocks();

  // Return current seat status
  res.json({
    success: true,
    message: 'Seats retrieved successfully',
    data: seats,
  });
});

// 2. Endpoint to lock a seat
app.post('/lock-seat', (req, res) => {
  // Release any expired locks before processing
  releaseExpiredLocks();

  const { seatId, userId } = req.body;

  // Validate request body
  if (!seatId || !userId) {
    return res.status(400).json({
      success: false,
      message: 'seatId and userId are required',
    });
  }

  // Find the seat
  const seat = seats.find(s => s.id === seatId);

  if (!seat) {
    return res.status(404).json({
      success: false,
      message: 'Seat not found',
    });
  }

  // Check if seat is already booked
  if (seat.status === 'booked') {
    return res.status(400).json({
      success: false,
      message: 'Seat is already booked',
    });
  }

  // Check if seat is already locked by another user
  if (seat.status === 'locked' && seat.lockedBy !== userId) {
    return res.status(400).json({
      success: false,
      message: 'Seat is already locked by another user',
    });
  }

  // Lock the seat
  seat.status = 'locked';
  seat.lockedBy = userId;
  seat.lockedAt = Date.now();

  res.json({
    success: true,
    message: 'Seat locked successfully',
    data: {
      seatId: seat.id,
      lockedBy: seat.lockedBy,
      expiresIn: `${LOCK_TIMEOUT / 1000} seconds`,
    },
  });
});

// 3. Endpoint to confirm booking
app.post('/confirm-booking', (req, res) => {
  // Release any expired locks before processing
  releaseExpiredLocks();

  const { seatId, userId } = req.body;

  // Validate request body
  if (!seatId || !userId) {
    return res.status(400).json({
      success: false,
      message: 'seatId and userId are required',
    });
  }

  // Find the seat
  const seat = seats.find(s => s.id === seatId);

  if (!seat) {
    return res.status(404).json({
      success: false,
      message: 'Seat not found',
    });
  }

  // Check if seat is locked by this user
  if (seat.status !== 'locked' || seat.lockedBy !== userId) {
    return res.status(400).json({
      success: false,
      message: 'Seat is not locked by you. Please lock the seat first.',
    });
  }

  // Confirm the booking
  seat.status = 'booked';
  seat.bookedBy = userId;
  seat.lockedBy = null;
  seat.lockedAt = null;

  res.json({
    success: true,
    message: 'Booking confirmed successfully',
    data: {
      seatId: seat.id,
      bookedBy: seat.bookedBy,
    },
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`Ticket Booking System API running on port ${PORT}`);
  console.log(`Server started at: ${new Date().toLocaleString()}`);
});

// Optional: Periodic cleanup of expired locks
setInterval(releaseExpiredLocks, 10000); // Check every 10 seconds
