import * as React from "react";
import { Check, ChevronsUpDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import Header from "./Header";
import ApiService from "../ApiService";
import BasicSkeleton from "./ui/BasicSkeleton";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";

export default function Service() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [handymen, setHandymen] = useState({});
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await ApiService.get(`/service`);
        setServices(response.data);

        const handymanIds = [
          ...new Set(response.data.map((service) => service.handymanId)),
        ];
        const handymanResponses = await Promise.all(
          handymanIds.map((id) => ApiService.get(`/handyman/${id}`))
        );
        const handymanData = handymanResponses.reduce((acc, curr) => {
          acc[curr.data.id] = curr.data;
          return acc;
        }, {});
        setHandymen(handymanData);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await ApiService.get(`/category`);
        setCategories(response.data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch categories");
      }
    };

    fetchServices();
    fetchCategories();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearchTerm =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === null || service.categoryId === selectedCategory;

    return matchesSearchTerm && matchesCategory;
  });

  const getInitials = (name) => {
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const handleCategorySelect = (categoryId) => {
    if (categoryId === value) {
      setValue("");
      setSelectedCategory(null);
    } else {
      setValue(categoryId);
      setSelectedCategory(categoryId === "all" ? null : categoryId);
    }
    setOpen(false);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {loading ? (
          <BasicSkeleton />
        ) : (
          <Card className="w-full mb-4">
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Available services for booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? categories.find((category) => category.id === value)
                            ?.name
                        : "Select category..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          <CommandItem
                            key="all"
                            value="all"
                            onSelect={() => handleCategorySelect("all")}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === "all" ? "opacity-100" : "opacity-0"
                              )}
                            />
                            All Categories
                          </CommandItem>
                          {categories.map((category) => (
                            <CommandItem
                              key={category.id}
                              value={category.id}
                              onSelect={() => handleCategorySelect(category.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === category.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {category.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                {filteredServices.map((service) => (
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>Book</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Make Reservation</DialogTitle>
                              <DialogDescription>
                                Complete your reservation by filling out the form
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4"></div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Book</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Avatar
                              onClick={() =>
                                setSelectedHandyman(
                                  handymen[service.handymanId]
                                )
                              }
                            >
                              <AvatarFallback>
                                {getInitials(
                                  `${
                                    handymen[service.handymanId]?.firstName ||
                                    ""
                                  } ${
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
                                    {selectedHandyman.firstName}{" "}
                                    {selectedHandyman.lastName}
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
