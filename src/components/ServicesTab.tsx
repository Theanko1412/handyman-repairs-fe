import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import EditService from "./EditService";
import AddService from "./AddService";
import { TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { z } from "zod";
import ApiService from "@/ApiService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "./ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import BookService from './BookService';
import DeleteService from './DeleteService';
import { Input } from './ui/input';

export default function ServicesTab({
  authUser,
  services,
  categories,
  onUpdate,
  onDelete,
  handyman,
  onAdd,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <TabsContent value="services">
        <div className="mb-4">
          <Input
            id="search"
            type="text"
            placeholder="Search by name or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="flex-grow flex-shrink">
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Price: ${service.price}</p>
                  <p>Duration: {service.duration} minutes</p>
                  <div className="text-sm text-muted-foreground">
                    {categories.find(
                      (category) => category.id === service.categoryId
                    )?.name}
                  </div>
                </CardContent>
                {handyman.email === authUser?.email && (
                  <CardFooter className="flex gap-2">
                    <EditService service={service} onUpdate={onUpdate} />
                    <DeleteService service={service} onDelete={onDelete} />
                  </CardFooter>
                )}
                {authUser.type === "CUSTOMER" && (
                  <CardFooter>
                    <BookService
                      handymanId={handyman.id}
                      service={service}
                      customer={authUser}
                    />
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <p>No services available.</p>
          </div>
        )}
        {handyman.email === authUser?.email && (
          <div className="pt-2">
            <AddService handymanId={handyman.id} onAdd={onAdd} />
          </div>
        )}
      </TabsContent>
    </div>
  );
}
