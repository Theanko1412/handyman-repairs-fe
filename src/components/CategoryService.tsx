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
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BookService from "./BookService";
import { useAuth } from "./AuthContext";

export default function CategoryService() {
  const { user: authUser } = useAuth();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [handymen, setHandymen] = useState<{ [key: string]: any }>({});
  const [selectedHandyman, setSelectedHandyman] = useState<any>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryResponse = await ApiService.get(`/category/${categoryId}`);
        setCategory(categoryResponse.data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch category details");
      }
    };

    const fetchServices = async () => {
      try {
        const response = await ApiService.get(`/service?categoryId=${categoryId}`);
        setData(response.data);
        setError(null);

        const handymanIds = [...new Set(response.data.map((service: any) => service.handymanId))];
        const handymanResponses = await Promise.all(handymanIds.map((id) => ApiService.get(`/handyman/${id}`)));
        const handymanData = handymanResponses.reduce((acc, curr) => {
          acc[curr.data.id] = curr.data;
          return acc;
        }, {});

        setHandymen(handymanData);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch services for category " + categoryId);
      }
    };

    fetchCategory();
    fetchServices();
  }, [categoryId]);

  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen p-4">
        {error && (
          <Alert variant="destructive" className="w-96">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <AlertTitle>Api Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {category && (
          <Card className="w-full mb-4">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {data &&
                  data.map((service: any) => (
                    console.log(service),
                    <Card className="w-80" key={service.id}>
                      <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Price: ${service.price}</p>
                        <p>Duration: {service.duration} minutes</p>
                      </CardContent>
                      <CardFooter>
                          <div className="flex items-center justify-center flex-wrap gap-2">
                            {authUser?.type === "CUSTOMER" && (
                              <BookService service={service} handymanId={service.handymanId} customer={authUser} />
                            )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Avatar onClick={() => setSelectedHandyman(handymen[service.handymanId])}>
                                <AvatarFallback>
                                  {getInitials(
                                    `${handymen[service.handymanId]?.firstName || ""} ${
                                      handymen[service.handymanId]?.lastName || ""
                                    }`
                                  )}
                                </AvatarFallback>
                              </Avatar>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Handyman Details</DialogTitle>
                                <DialogDescription>
                                  Information about the handyman
                                </DialogDescription>
                              </DialogHeader>
                              {selectedHandyman && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Name:</Label>
                                    <p className="col-span-3">
                                      {selectedHandyman.firstName} {selectedHandyman.lastName}
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Email:</Label>
                                    <p className="col-span-3">
                                      {selectedHandyman.email}
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Rating:</Label>
                                    <p className="col-span-3">
                                      {selectedHandyman.rating}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
