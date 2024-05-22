import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { z } from "zod";
import ApiService from "@/ApiService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "./ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormItem,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Input } from "./ui/input";

const BookServiceSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z
    .string({
      required_error: "A time is required.",
    })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
});

export default function BookService({
  handymanId,
  service,
  customer,
}: {
  handymanId: any;
  service: any;
  customer: any;
}) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [handyman, setHandyman] = useState<any>(null);

  useEffect(() => {
    const fetchHandyman = async () => {
      try {
        const response = await ApiService.get(`/handyman/${handymanId}`);
        setHandyman(response.data);
      } catch (error) {
        console.error("Failed to fetch handyman details:", error);
      }
    };

    fetchHandyman();
  }, [handymanId]);

  const form = useForm<z.infer<typeof BookServiceSchema>>({
    resolver: zodResolver(BookServiceSchema),
  });

  async function onSubmit(data: z.infer<typeof BookServiceSchema>) {
    const dateTimeString = format(
      new Date(`${format(data.date, "yyyy-MM-dd")}T${data.time}:00`),
      "yyyy-MM-dd'T'HH:mm:ssXXX",
    );

    try {
      const response = await ApiService.post("/reservation", {
        customerId: customer.id,
        scheduleId: handyman.scheduleId,
        serviceId: service.id,
        dateTime: dateTimeString,
      });
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: "Reservation successful",
          description: "Your reservation has been successfully booked.",
          duration: 2000,
        });
        setIsDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Reservation failed",
          description: response.data.message,
          duration: 10000,
        });
      }
    } catch (error) {
      console.error("Failed to book reservation:", error);
      toast({
        variant: "destructive",
        title: "Reservation failed",
        description: error.response.data.message,
        duration: 10000,
      });
    }
  }

  return (
    <div>
      <Toaster />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)}>Book</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {service.name} service</DialogTitle>
            <DialogDescription>
              Choose a date and time to book the service
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => new Date() > date}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="time"
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Book</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
