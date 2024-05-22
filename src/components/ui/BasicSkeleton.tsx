import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "./card";
import { Skeleton } from "./skeleton";

export default function BasicSkeleton() {
  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-1/3" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/4" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center flex-wrap gap-4">
          {[...Array(4)].map((_, i) => (
            <Card className="w-80" key={i}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-2/3" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-1/4" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-center flex-wrap gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
