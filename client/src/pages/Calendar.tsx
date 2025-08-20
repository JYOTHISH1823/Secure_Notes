import { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PasswordProtected } from "@/components/PasswordProtected";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Lock, 
  MapPin, 
  Users 
} from "lucide-react";
import API from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CalendarProps {
  isAuthenticated: boolean;
  onLogin?: () => void;
}

export default function Calendar({ isAuthenticated, onLogin }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30 min");
  const { toast } = useToast();

  // ✅ Fetch events
  useEffect(() => {
    if (isAuthenticated) fetchEvents();
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // ✅ Create Event
  const handleCreateEvent = async () => {
    try {
      const eventDateTime = new Date(selectedDate!);
      if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        eventDateTime.setHours(hours, minutes);
      }

      const res = await API.post("/events", {
        title,
        description,
        date: eventDateTime,
        duration,
      });

      setEvents([...events, res.data]);
      setCreating(false);
      setTitle("");
      setDescription("");
      setTime("");
      setDuration("30 min");

      toast({ title: "Event Created", description: "Your event has been added." });
    } catch (err) {
      console.error("Error creating event:", err);
      toast({ title: "Error", description: "Could not create event", variant: "destructive" });
    }
  };

  // ✅ Update Event
  const handleUpdateEvent = async (id: string) => {
    const newTitle = prompt("Update event title:");
    if (!newTitle) return;
    try {
      const res = await API.put(`/events/${id}`, { title: newTitle });
      setEvents(events.map((e) => (e._id === id ? res.data : e)));
      toast({ title: "Updated", description: "Event updated successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Could not update event", variant: "destructive" });
    }
  };

  // ✅ Delete Event
  const handleDeleteEvent = async (id: string) => {
    try {
      await API.delete(`/events/${id}`);
      setEvents(events.filter((e) => e._id !== id));
      toast({ title: "Deleted", description: "Event removed successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Could not delete event", variant: "destructive" });
    }
  };

  // ✅ Filter events by selected date
  const eventsForDate = selectedDate
    ? events.filter((event) => new Date(event.date).toDateString() === selectedDate.toDateString())
    : [];

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto" />
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">
              Please sign in to access your calendar and schedule events.
            </p>
          </div>
          <Button onClick={onLogin}>Sign In to Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and secure appointments</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
              />
            </CardContent>
          </Card>
        </div>

        {/* Events for Selected Date */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" /> Events for {selectedDate?.toLocaleDateString()}
              </CardTitle>
              <CardDescription>Your scheduled events and appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventsForDate.length > 0 ? (
                eventsForDate.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                  >
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleTimeString()}</p>
                      <p className="text-sm">{event.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleUpdateEvent(event._id)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No events scheduled for this date</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Event Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create New Event</h2>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event Title"
              className="mb-3"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event Description"
              className="mb-3"
            />
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mb-3"
            />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border rounded-md p-2 mb-4 bg-transparent"
            >
              <option>30 min</option>
              <option>1 hour</option>
              <option>2 hours</option>
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
              <Button onClick={handleCreateEvent}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}