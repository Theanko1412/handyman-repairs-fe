import Header from "./Header";
import ApiService from "../ApiService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "./AuthContext";
import { Button } from "./ui/button";
import EditService from "./EditService";
import AddService from "./AddService";
import ServicesTab from "./ServicesTab";
import InfoTab from "./InfoTab";
import WorkshopTab from "./WorkshopTab";
import ScheduleTab from "./ScheduleTab";
import { Skeleton } from "@/components/ui/skeleton";
import HandymanViewSkeleton from "./ui/HandymanViewSkeleton";

export default function HandymanView() {
  const { user: authUser } = useAuth();
  const { handymanId } = useParams<{ handymanId: string }>();
  const [handyman, setHandyman] = useState<any>(null);
  const [workshop, setWorkshop] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHandyman = async () => {
      try {
        const handymanResponse = await ApiService.get(
          `/handyman/${handymanId}`
        );
        setHandyman(handymanResponse.data);

        if (handymanResponse.data.homeOrWorkshopId) {
          const workshopResponse = await ApiService.get(
            `/home-or-workshop/${handymanResponse.data.homeOrWorkshopId}`
          );
          setWorkshop(workshopResponse.data);
        }

        if (handymanResponse.data.scheduleId) {
          const scheduleResponse = await ApiService.get(
            `/schedule/${handymanResponse.data.scheduleId}`
          );
          setSchedule(scheduleResponse.data);

          const reservationResponses = await Promise.all(
            scheduleResponse.data.reservationIds.map(async (id: string) => {
              const reservation = await ApiService.get(`/reservation/${id}`);
              const customer = await ApiService.get(
                `/customer/${reservation.data.customerId}`
              );
              const service = await ApiService.get(
                `/service/${reservation.data.serviceId}`
              );
              return {
                ...reservation.data,
                customer: customer.data,
                service: service.data,
              };
            })
          );
          setReservations(reservationResponses);
        }

        if (handymanResponse.data.serviceIds) {
          const serviceResponses = await Promise.all(
            handymanResponse.data.serviceIds.map((id: string) =>
              ApiService.get(`/service/${id}`)
            )
          );
          setServices(serviceResponses.map((res) => res.data));
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch handyman details");
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

    fetchHandyman();
    fetchCategories();
  }, [handymanId]);

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
  };

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
        <>
          {loading ? (
            <HandymanViewSkeleton />
          ) : (
            <Card className="w-full mb-4">
              <CardHeader>
                <CardTitle>
                  {handyman.firstName} {handyman.lastName}
                </CardTitle>
                <CardDescription>Email: {handyman.email}</CardDescription>
                <CardDescription>Rating: {handyman.rating}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info">
                  <TabsList>
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="workshop">Workshop</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  </TabsList>

                  <InfoTab user={handyman} />

                  <WorkshopTab workshop={workshop} />

                  <ServicesTab
                    authUser={authUser}
                    categories={categories}
                    services={services}
                      onUpdate={handleServiceUpdate}
                      onDelete={handleServiceDelete}
                    handyman={handyman}
                    onAdd={handleServiceAdd}
                  />

                  <ScheduleTab
                    user={handyman}
                    authUser={authUser}
                    onUpdateReservation={handleReservationUpdate}
                    reservations={reservations}
                    loading={loading}
                  />
                </Tabs>
              </CardContent>
            </Card>
          )}
        </>
      </div>
    </div>
  );
}
