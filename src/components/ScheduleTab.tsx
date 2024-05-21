import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { TabsContent } from "@/components/ui/tabs";
import ApiService from "@/ApiService";
import { Toaster } from "./ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton"

const enum Status {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export default function ScheduleTab({
  user,
  authUser,
  reservations,
  onUpdateReservation,
  loading,
}: {
  user: any;
  authUser: any;
  reservations: any;
    onUpdateReservation: (updatedReservation: any) => void;
  loading: boolean;
}) {
  const { toast } = useToast();

  async function handleReservationStateUpdate(
    status: Status,
    reservationId: string
  ) {
    try {
      const response = await ApiService.patch(
        `/reservation/${reservationId}?status=${status}`
      );
      if (response.status >= 200 && response.status < 300) {
        const updatedReservation = response.data;
        onUpdateReservation(updatedReservation);
        toast({
          title: "Reservation updated",
          description: "The reservation has been updated successfully.",
          duration: 2000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update reservation",
          description: "Failed to update the reservation. Please try again.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to update reservation:", error);
      toast({
        variant: "destructive",
        title: "Failed to update reservation",
        description: "An error occurred while updating the reservation.",
        duration: 2000,
      });
    }
  }

  return (
    <div>
      <Toaster />
      <TabsContent
        value={user.type === "CUSTOMER" ? "reservations" : "schedule"}
      >
        {loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-6 w-full" /></TableHead>
                <TableHead><Skeleton className="h-6 w-full" /></TableHead>
                <TableHead><Skeleton className="h-6 w-full" /></TableHead>
                <TableHead><Skeleton className="h-6 w-full" /></TableHead>
                {user.email === authUser.email && (
                  <TableHead><Skeleton className="h-6 w-full" /></TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                  {user.email === authUser.email && (
                    <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <>
            {user.type === "CUSTOMER" ? (
              reservations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Handyman</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date and Time</TableHead>
                      {user.email === authUser.email && (
                        <TableHead>Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          {reservation.handyman.firstName}{" "}
                          {reservation.handyman.lastName}
                        </TableCell>
                        <TableCell>{reservation.service.name}</TableCell>
                        <TableCell>{reservation.status}</TableCell>
                        <TableCell>
                          {new Date(reservation.dateTime).toLocaleString()}
                        </TableCell>
                        {user.email === authUser.email &&
                          reservation.status === Status.PENDING && (
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleReservationStateUpdate(
                                      Status.CANCELLED,
                                      reservation.id
                                    )
                                  }
                                >
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        {user.email === authUser.email &&
                          reservation.status === Status.ACCEPTED && (
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() =>
                                    handleReservationStateUpdate(
                                      Status.COMPLETED,
                                      reservation.id
                                    )
                                  }
                                >
                                  Complete
                                </Button>
                              </div>
                            </TableCell>
                          )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No reservations available.</p>
              )
            ) : reservations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date and Time</TableHead>
                    {user.email === authUser.email && (
                      <TableHead>Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        {reservation.customer.firstName}{" "}
                        {reservation.customer.lastName}
                      </TableCell>
                      <TableCell>{reservation.service.name}</TableCell>
                      <TableCell>{reservation.status}</TableCell>
                      <TableCell>
                        {new Date(reservation.dateTime).toLocaleString()}
                      </TableCell>
                      {user.email === authUser.email &&
                        reservation.status === Status.PENDING && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  handleReservationStateUpdate(
                                    Status.ACCEPTED,
                                    reservation.id
                                  )
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  handleReservationStateUpdate(
                                    Status.REJECTED,
                                    reservation.id
                                  )
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No reservations available.</p>
            )}
          </>
        )}
      </TabsContent>
    </div>
  );
}