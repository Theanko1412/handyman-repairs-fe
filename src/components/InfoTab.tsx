import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export default function InfoTab({ user }: { user: any }) {
  return (
    <div>
      <TabsContent value="info">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
                 <CardDescription>
                    {user.type === "HANDYMAN" ? "Handyman details" : "User details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>First Name:</strong> {user.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {user.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {user.type === "HANDYMAN" && (
                <p>
                <strong>Rating:</strong> {user.rating}
              </p>
                )}
              <p>
                <strong>Suspended:</strong>{" "}
                {user.isSuspended ? "Yes" : "No"}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
