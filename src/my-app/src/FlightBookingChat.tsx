import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Plane, Calendar as CalendarIcon } from "lucide-react";
import { ChatMessage } from "@/components/ui/ChatMessage";
import { FlightBookingFlow } from "@/types/FlightBooking";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// ✅ Define step control type
type BookingStep = 
  | "cities"
  | "date"
  | "passengers"
  | "confirmation"
  | "flightSelection"
  | "passengerDetails";

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
}

interface FlightBookingChatProps {
  onBackToWelcome: () => void;
}

export const FlightBookingChat = ({ onBackToWelcome }: FlightBookingChatProps) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    type: "bot",
    content: "Fantastic! I'm here to assist you with that. 🛫 Could you please tell me your origin and destination cities? 🌏✨",
    timestamp: new Date(),
  }]);

  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState<BookingStep>("cities");
  const [bookingData, setBookingData] = useState<Partial<FlightBookingFlow>>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, seniors: 0, infants: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (type: "bot" | "user", content: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), type, content, timestamp: new Date() }]);
  };

  const getNextBotMessage = (step: BookingStep, data: Partial<FlightBookingFlow>) => {
    switch (step) {
      case "date":
        return "Please provide the date of your onward travel.";
      case "passengers":
        return "Noted. Please provide the number of passengers, specifying adults, children, senior citizens, and infants.";
      case "confirmation": {
        const { origin, destination, date, passengers } = data;
        return `Please confirm the following details:
- Origin: ${origin}
- Destination: ${destination}
- Type: One-way
- Date of Onward Travel (DOT): ${date}
- Passengers: ${passengers}
Type \"yes,\" \"confirm,\" or \"proceed\" to confirm.`;
      }
      case "flightSelection":
        return "Please select the onward flight below ⤵️.";
      case "passengerDetails":
        return "Please provide the first name, last name, and gender of the first adult passenger.";
      default:
        return "";
    }
  };

const handleDateSelect = (date: Date | undefined) => {
  if (!date) return;

  setSelectedDate(date);
  const formattedDate = format(date, "yyyy-MM-dd");  // ✅ Use hyphen format
  addMessage("user", `Selected date: ${formattedDate}`);

  const updatedData = { ...bookingData, date: formattedDate };
  setBookingData(updatedData);
  setCurrentStep("passengers");

  setTimeout(() => {
    const botMessage = getNextBotMessage("passengers", updatedData);
    if (botMessage) {
      addMessage("bot", botMessage);
    }
  }, 1000);
};


  const handlePassengerConfirm = () => {
    const summary = `${passengers.adults} Adults, ${passengers.children} Children, ${passengers.seniors} Senior Citizens, ${passengers.infants} Infants`;
    addMessage("user", summary);
    const updated = { ...bookingData, passengers: summary };
    setBookingData(updated);
    setCurrentStep("confirmation");
    setTimeout(() => addMessage("bot", getNextBotMessage("confirmation", updated)), 1000);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    addMessage("user", currentInput);
    const updated = { ...bookingData };

    switch (currentStep) {
      case "cities": {
  const lower = currentInput.toLowerCase();
  const [origin, destination] = lower.includes(" to ")
    ? currentInput.split(/ to /i)
    : [currentInput, ""];

  updated.origin = origin.trim().toUpperCase();
  updated.destination = destination.trim().toUpperCase();
  setCurrentStep("date");
  break;
}
      case "confirmation": {
        if (["yes", "confirm", "proceed"].some((word) => currentInput.toLowerCase().includes(word))) {
          setCurrentStep("flightSelection");
          try {
            const res = await fetch(`http://localhost:5000/api/flight?from=${updated.origin}&to=${updated.destination}&date=${updated.date}`);
            const flights = await res.json();
            if (Array.isArray(flights) && flights.length) {
              flights.forEach((f: any) => addMessage("bot", `✈️ ${f.flight} | Departure: ${f.time} | Price: ${f.price}`));
            } else {
              addMessage("bot", "No flights found for the selected route and date. Please try different details.");
            }
          } catch (err) {
            addMessage("bot", "Failed to fetch flight data. Please try again later.");
          }
        }
        break;
      }
      case "flightSelection":
        setCurrentStep("passengerDetails");
        break;
      case "passengerDetails":
        updated.passengerDetails = currentInput;
        break;
    }

    setBookingData(updated);
    setCurrentInput("");

    setTimeout(() => {
      const nextStep = currentStep === "cities"
        ? "date"
        : currentStep === "confirmation"
        ? "flightSelection"
        : "passengerDetails";
      const botMsg = getNextBotMessage(nextStep, updated);
      if (botMsg) addMessage("bot", botMsg);
    }, 1000);
  };

  const renderInputArea = () => {
    if (currentStep === "date") {
      return (
        <div className="flex flex-col gap-4 pt-4 border-t">
          <div className="text-sm text-gray-600">Select your travel date:</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}> 
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    }

    if (currentStep === "passengers") {
  return (
    <div className="flex flex-col gap-4 pt-4 border-t">
      <div className="text-sm text-gray-600">Select number of passengers:</div>
      <div className="grid grid-cols-2 gap-4">
        {["adults", "children", "seniors", "infants"].map((key) => (
          <div className="space-y-2" key={key}>
            <label className="text-sm font-medium capitalize">{key}</label>
            <Select
              value={passengers[key as keyof typeof passengers].toString()}
              onValueChange={(val) =>
                setPassengers((prev) => ({
                  ...prev,
                  [key]: parseInt(val),
                }))
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i)
                  .slice(key === "adults" ? 1 : 0)
                  .map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <Button onClick={handlePassengerConfirm} className="w-full">
        Confirm Passengers
      </Button>
    </div>
  );
}


    return (
      <div className="flex gap-2 pt-4 border-t">
        <Input
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your response..."
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={!currentInput.trim()} className="px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl min-h-screen flex flex-col">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBackToWelcome} className="mr-4 p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center">
          <Plane className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Flight Booking Assistant</h1>
        </div>
      </div>

      <Card className="flex-1 p-6 mb-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
          <div ref={messagesEndRef} />
        </div>

        {renderInputArea()}
      </Card>
    </div>
  );
};
