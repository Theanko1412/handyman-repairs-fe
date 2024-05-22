import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export default function WorkshopTab({ workshop }: { workshop: any }) {
  return (
    <>
      <TabsContent value="workshop">
        {workshop ? (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{workshop.name}</CardTitle>
              <CardDescription>Workshop Information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Address:</p>
              <p className="text-lg">
                {workshop.streetNumber} {workshop.streetName},{" "}
                {workshop.cityName}, {workshop.countryName}
              </p>
            </CardContent>
          </Card>
        ) : (
          <p>No workshop information available.</p>
        )}
      </TabsContent>
    </>
  );
}
