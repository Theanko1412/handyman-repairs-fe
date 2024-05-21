import Header from "./Header";
import ApiService from "../ApiService";
import { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import BasicSkeleton from "./ui/BasicSkeleton";

export default function Handyman() {
  const [data, setData] = useState<any>(null);
  const [workshop, setWorkshop] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.get("/handyman");
        setData(response.data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch handymen");
      } finally {
        setLoading(false);
      }
    };

    const fetchWorkshop = async () => {
      try {
        console.log("fetching workshop");
        const response = await ApiService.get("/home-or-workshop");
        console.log("response", response.data);
        setWorkshop(response.data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch workshop");
      }
    };

    fetchData();
    fetchWorkshop();
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {loading ? (
        <BasicSkeleton />
        ): (
          <Card className="w-full mb-4">
          <CardHeader>
            <CardTitle>Handymen</CardTitle>
            <CardDescription>Available handymen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center flex-wrap gap-4">
              {data &&
                data
                  .filter((handyman: any) => !handyman.isSuspended)
                  .sort((a: any, b: any) => b.rating - a.rating)
                  .map((handyman: any) => (
                    <Card className="w-80" key={handyman.id}>
                      <CardHeader>
                        <CardTitle>{handyman.firstName} {handyman.lastName}</CardTitle>
                        <CardDescription>Rating: {handyman.rating}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div>
                          {workshop &&
                            workshop
                              .filter((ws: any) => ws.id === handyman.homeOrWorkshopId)
                              .map((ws: any) => (
                                <div key={ws.id}>
                                  <p className="text-sm">{ws.streetNumber} {ws.streetName}</p>
                                  <p className="text-lg">{ws.countryName}, {ws.cityName}</p>
                                </div>
                              ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center justify-center flex-wrap gap-2">
                          <Button asChild>
                            <Link to={`/handyman/${handyman.id}`}>View</Link>
                          </Button>
                          <p className="text-sm">Services: {handyman.serviceIds.length}</p>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
