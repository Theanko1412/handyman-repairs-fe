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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BasicSkeleton from "./ui/BasicSkeleton";

export default function Category() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching categories");
        const response = await ApiService.get("/category");
        console.log("response", response.data);
         setData(response.data);
         setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {loading ? (
        <BasicSkeleton />
        ): (
          <Card className="w-full mb-4">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Available service categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center flex-wrap gap-4">
              {data && data.map((category: any) => (
                <Card className="w-80" key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center justify-center flex-wrap gap-2">
                      <Button asChild>
                        <Link to={`/category/${category.id}`}>View</Link>
                      </Button>
                      <p className="text-sm">Services: {category.serviceIds.length}</p>
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
