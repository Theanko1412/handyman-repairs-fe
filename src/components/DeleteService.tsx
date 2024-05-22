import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { z } from "zod";
import ApiService from "@/ApiService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { coerce } from "zod";
import { Toaster } from "./ui/toaster";
import { toast, useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DeleteService({
  service,
  onDelete,
}: {
  service: any;
  onDelete: (deletedService: any) => void;
}) {
  async function handleDelete() {
    try {
      await ApiService.delete(`/service/${service.id}`);
      toast({
        title: "Service deleted",
        description: "The service has been deleted",
        duration: 2000,
      });
      onDelete(service);
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete service",
        description: "An error occurred while deleting the service",
        duration: 2000,
      });
    }
  }

  return (
    <div>
      <Toaster />
      <Dialog>
        <DialogTrigger>
          <Button variant="destructive">Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
