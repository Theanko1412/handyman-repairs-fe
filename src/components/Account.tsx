"use client";

import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "./AuthContext";
import ApiService from "../ApiService";
import Header from "./Header";
import { Button } from "./ui/button";
import ServicesTab from "./ServicesTab";
import InfoTab from "./InfoTab";
import ScheduleTab from "./ScheduleTab";

interface Reservation {
  id: string;
  status: string;
  customerId: string;
  scheduleId: string;
  serviceId: string;
  dateTime: string;
  customer?: any;
  service?: any;
}

export default function Account() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [workshop, setWorkshop] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const email = authUser?.email;
        if (!email) {
          console.error("No email found for the user");
          return;
        }

        const response = await ApiService.get('/auth/user', {
          params: { email },
        });
        setUser(response.data);

        if (response.data.type === "HANDYMAN") {
          if (response.data.scheduleId) {
            const scheduleResponse = await ApiService.get(`/schedule/${response.data.scheduleId}`);
            setSchedule(scheduleResponse.data);

            const reservationResponses = await Promise.all(scheduleResponse.data.reservationIds.map(async (id: string) => {
              const reservation = await ApiService.get(`/reservation/${id}`);
              const customer = await ApiService.get(`/customer/${reservation.data.customerId}`);
              const service = await ApiService.get(`/service/${reservation.data.serviceId}`);
              return { ...reservation.data, customer: customer.data, service: service.data };
            }));
            setReservations(reservationResponses);
          }

          if (response.data.homeOrWorkshopId) {
            const workshopResponse = await ApiService.get(`/home-or-workshop/${response.data.homeOrWorkshopId}`);
            setWorkshop(workshopResponse.data);
          }

          if (response.data.serviceIds) {
            const serviceResponses = await Promise.all(response.data.serviceIds.map((id: string) => ApiService.get(`/service/${id}`)));
            setServices(serviceResponses.map(res => res.data));
          }
        } else if (response.data.type === "CUSTOMER") {
          const reservationResponses = await Promise.all(response.data.reservationIds.map(async (id: string) => {
            const reservation = await ApiService.get(`/reservation/${id}`);
            const service = await ApiService.get(`/service/${reservation.data.serviceId}`);
            const schedule = await ApiService.get(`/schedule/${reservation.data.scheduleId}`);
            const handyman = await ApiService.get(`/handyman/${schedule.data.handymanId}`);
            return { ...reservation.data, service: service.data, handyman: handyman.data};
          }));
          setReservations(reservationResponses);
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await ApiService.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    if (authUser) {
      fetchUserDetails();
      fetchCategories();
    }
  }, [authUser]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleServiceUpdate = (updatedService: any) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  const handleServiceDelete = (deletedService: any) => {
    setServices((prevServices) =>
      prevServices.filter((service) => service.id !== deletedService.id)
    );
  }

  const handleServiceAdd = (newService: any) => {
    setServices((prevServices) => [...prevServices, newService]);
  }
  
  const handleReservationUpdate = (updatedReservation: any) => {
    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === updatedReservation.id
          ? { ...reservation, status: updatedReservation.status }
          : reservation
      )
    );
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {error && (
          <Alert variant="destructive" className="w-96">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <AlertTitle>Api Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {user && (
          <Card className="w-full mb-4">
            <CardHeader>
              <CardTitle>{user.firstName} {user.lastName}</CardTitle>
              <CardDescription>Email: {user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="info">
                <TabsList>
                  <TabsTrigger value="info">Info</TabsTrigger>
                  {user.type === "HANDYMAN" && (
                    <>
                      <TabsTrigger value="workshop">Workshop</TabsTrigger>
                      <TabsTrigger value="services">Services</TabsTrigger>
                    </>
                  )}
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value={user.type === "CUSTOMER" ? "reservations" : "schedule"}>
                    {user.type === "CUSTOMER" ? "Reservations" : "Schedule"}
                  </TabsTrigger>
                </TabsList>

                <InfoTab user={user} />

                <TabsContent value="notifications">
                  <p>No notifications available.</p>
                </TabsContent>

                <ScheduleTab user={user} authUser={authUser} onUpdateReservation={handleReservationUpdate} loading={loading} reservations={reservations} />

                {user.type === "HANDYMAN" && (
                  <>
                    <ServicesTab authUser={ authUser } categories={categories} services={ services } onUpdate={handleServiceUpdate} onDelete={handleServiceDelete} handyman={user} onAdd={handleServiceAdd} />

                    <TabsContent value="workshop">
                      {workshop ? (
                        <Card className="mb-4">
                          <CardHeader>
                            <CardTitle>{workshop.name}</CardTitle>
                            <CardDescription>Workshop Information</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>Address: {workshop.streetNumber} {workshop.streetName}, {workshop.cityName}, {workshop.countryName}</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <p>No workshop information available.</p>
                      )}
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
