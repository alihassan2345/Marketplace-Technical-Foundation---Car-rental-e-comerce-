"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";

interface Booking {
  _id: string;
  car: {
    _ref: string;
    name: string;
    imageUrl: string;
  };
  userName: string;
  status: string;
  rentalDate: string;
  returnDate: string;
}

const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState(""); // State for password input
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const [showPasswordPopup, setShowPasswordPopup] = useState(true); // State to control password popup
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  // Access the password from the .env file
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // Function to handle password submission
  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true); // Grant access if password is correct
      setShowPasswordPopup(false); // Hide the password popup
    } else {
      setErrorMessage("Incorrect password. Please try again."); // Show error message
      setPassword(""); // Clear the password input
    }
  };

  // Fetch bookings only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchBookings = async () => {
        try {
          const bookings = await client.fetch(`*[_type == "booking"]{
            _id,
            car->{name, "imageUrl": image.asset->url},
            userName,
            status,
            rentalDate,
            returnDate
          }`);
          setBookings(bookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [isAuthenticated]);

  // Show loading state if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        {showPasswordPopup && (
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <p className="text-gray-700 mb-6">Please enter the password to access the dashboard.</p>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <button
              onClick={handlePasswordSubmit}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition w-full"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }

  // Show loading state while fetching bookings
  if (loading) {
    return <div className="bg-gray-100 min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Render the admin dashboard if authenticated
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Manage Bookings</h1>

      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Booking ID</th>
              <th className="text-left p-4">Car names</th>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Cars</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Rental Date</th>
              <th className="text-left p-4">Return Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4">{booking._id}</td>
                <td className="p-4">{booking.car?.name || "N/A"}</td>
                <td className="p-4">{booking.userName}</td>
                <td className="p-4">
                  <Image
                    src={booking.car.imageUrl}
                    alt={booking.car.name || "Car Image"}
                    width={300}
                    height={150}
                    quality={100}
                    className="rounded-md"
                  />
                </td>
                <td className="p-4">{booking.status}</td>
                <td className="p-4">{new Date(booking.rentalDate).toLocaleDateString()}</td>
                <td className="p-4">{new Date(booking.returnDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-Friendly Layout */}
      <div className="mt-8 md:hidden">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="space-y-2">
              <p><strong>Booking ID:</strong> {booking._id}</p>
              <p><strong>Car:</strong> {booking.car?.name || "N/A"}</p>
              <p><strong>User:</strong> {booking.userName}</p>
              <p>
                <strong>Car Image:</strong>
                <Image
                  src={booking.car.imageUrl}
                  alt={booking.car.name || "Car Image"}
                  width={300}
                  height={150}
                  quality={100}
                  className="rounded-md"
                />
              </p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Rental Date:</strong> {new Date(booking.rentalDate).toLocaleDateString()}</p>
              <p><strong>Return Date:</strong> {new Date(booking.returnDate).toLocaleDateString()}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full">
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBookings;