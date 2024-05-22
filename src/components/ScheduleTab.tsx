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
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  async function handleReservationStateUpdate(
    status: Status,
    reservationId: string,
  ) {
    try {
      const response = await ApiService.patch(
        `/reservation/${reservationId}?status=${status}`,
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

  function sortByDateTime(a, b) {
    if (sortOrder === "asc") {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    } else {
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
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
                <TableHead>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
                {user.email === authUser.email && (
                  <TableHead>
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  {user.email === authUser.email && (
                    <TableCell>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
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
                      <TableHead className="flex items-center">
                        Date and Time
                        <Button
                          onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }
                          size="sm"
                          variant="link"
                          className="ml-2 p-0"
                        >
                          {sortOrder === "asc" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-arrow-down-narrow-wide"
                            >
                              <path d="m3 16 4 4 4-4" />
                              <path d="M7 20V4" />
                              <path d="M11 4h4" />
                              <path d="M11 8h7" />
                              <path d="M11 12h10" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-arrow-down-wide-narrow"
                            >
                              <path d="m3 16 4 4 4-4" />
                              <path d="M7 20V4" />
                              <path d="M11 4h10" />
                              <path d="M11 8h7" />
                              <path d="M11 12h4" />
                            </svg>
                          )}
                        </Button>
                      </TableHead>
                      {user.email === authUser.email && (
                        <TableHead>Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.sort(sortByDateTime).map((reservation) => (
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
                                      reservation.id,
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
                                      reservation.id,
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
                    <TableHead className="flex items-center">
                      Date and Time
                      <Button
                        onClick={() =>
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                        size="sm"
                        variant="link"
                        className="ml-2 p-0"
                      >
                        {sortOrder === "asc" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-arrow-down-narrow-wide"
                          >
                            <path d="m3 16 4 4 4-4" />
                            <path d="M7 20V4" />
                            <path d="M11 4h4" />
                            <path d="M11 8h7" />
                            <path d="M11 12h10" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-arrow-down-wide-narrow"
                          >
                            <path d="m3 16 4 4 4-4" />
                            <path d="M7 20V4" />
                            <path d="M11 4h10" />
                            <path d="M11 8h7" />
                            <path d="M11 12h4" />
                          </svg>
                        )}
                      </Button>
                    </TableHead>
                    {user.email === authUser.email && (
                      <TableHead>Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.sort(sortByDateTime).map((reservation) => (
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
                                    reservation.id,
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
                                    reservation.id,
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
