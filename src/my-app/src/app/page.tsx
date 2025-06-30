'use client';

import { useState } from 'react';
import { FlightBookingChat } from '@/FlightBookingChat';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function Home() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <FlightBookingChat onBackToWelcome={() => setStarted(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-7xl flex flex-col items-center text-center gap-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-4">
            ✈️ Flight Booking Assistant
          </h1>
          <p className="max-w-3xl text-lg sm:text-xl text-gray-700 mx-auto">
            Your personal travel companion for seamless flight bookings.
            Let me help you find the perfect flight for your journey! 🛫
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-4">
          <Card
            icon={<MapPin className="text-blue-500" size={32} />}
            title="Worldwide Destinations"
            description="Book flights to any destination across the globe"
          />
          <Card
            icon={<Calendar className="text-green-600" size={32} />}
            title="Flexible Dates"
            description="Choose your perfect travel dates with ease"
          />
          <Card
            icon={<Users className="text-purple-600" size={32} />}
            title="Group Bookings"
            description="Book for multiple passengers effortlessly"
          />
        </div>

        {/* Action Button */}
        <Button
          onClick={() => setStarted(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-full shadow-lg transition-all flex items-center gap-2"
        >
          ✈️ Book a Flight
        </Button>
      </div>
    </div>
  );
}

// Reusable Card Component
type CardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function Card({ icon, title, description }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
}
