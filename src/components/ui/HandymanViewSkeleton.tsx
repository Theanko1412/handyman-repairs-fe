import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from "./card";
import { Skeleton } from "./skeleton";

export default function HandymanViewSkeleton() {
   return (
      <Card className="w-full mb-4">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-1/2" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-1/3" />
                </CardDescription>
                <CardDescription>
                  <Skeleton className="h-4 w-1/4" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-8 w-1/4" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
   );
}