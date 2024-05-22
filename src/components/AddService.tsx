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
import { Toaster } from "./ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddService({
  handymanId,
  onAdd,
}: {
  handymanId: string;
  onAdd: (newService: any) => void;
}) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ApiService.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const AddServiceSchema = z.object({
    name: z
      .string()
      .trim()
      .min(3, {
        message: "Name must be at least 3 characters long",
      })
      .max(50, {
        message: "Name must be at most 50 characters long",
      }),
    description: z
      .string()
      .trim()
      .min(3, {
        message: "Description must be at least 3 characters long",
      })
      .max(200, {
        message: "Description must be at most 200 characters long",
      }),
    price: z.coerce
      .number()
      .int()
      .min(1, {
        message: "Price must be at least 1",
      })
      .max(1000, {
        message: "Price must be at most 1000",
      }),
    duration: z.coerce
      .number()
      .int()
      .min(1, {
        message: "Duration must be at least 1",
      })
      .max(24 * 60, {
        message: "Duration must be at most 1440",
      }),
    categoryId: z.string().uuid({
      message: "Category is required",
    }),
  });

  const form = useForm<z.infer<typeof AddServiceSchema>>({
    resolver: zodResolver(AddServiceSchema),
  });

  async function onSubmit(data: z.infer<typeof AddServiceSchema>) {
    const formData = { ...data, handymanId };
    try {
      const response = await ApiService.post(`/service`, formData);

      if (response.status >= 200 && response.status < 300) {
        toast({
          title: "Service added",
          description: "Service has been added successfully",
          duration: 2000,
        });
        setIsDialogOpen(false);
        onAdd(response.data);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add service",
          description: "Failed to add service. Please try again.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to add service:", error);
      toast({
        variant: "destructive",
        title: "Failed to add service",
        description: "An error occurred. Please try again.",
        duration: 2000,
      });
    }
  }

  return (
    <div>
      <Toaster />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)}>Add Service</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
            <DialogDescription>Add a new service</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {form.formState.errors.name && (
                      <FormDescription>
                        {form.formState.errors.name.message}
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {form.formState.errors.description && (
                      <FormDescription>
                        {form.formState.errors.description.message}
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    {form.formState.errors.price && (
                      <FormDescription>
                        {form.formState.errors.price.message}
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    {form.formState.errors.duration && (
                      <FormDescription>
                        {form.formState.errors.duration.message}
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {form.formState.errors.categoryId && (
                      <FormDescription>
                        {form.formState.errors.categoryId.message}
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
