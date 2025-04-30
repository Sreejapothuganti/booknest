import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Amenity } from "@shared/schema";

interface SearchFilterProps {
  onFilterChange: (filters: {
    location: string;
    priceRange: string;
    housingType: string;
    amenities: string[];
  }) => void;
}

export function SearchFilter({ onFilterChange }: SearchFilterProps) {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [housingType, setHousingType] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isAddingAmenity, setIsAddingAmenity] = useState(false);

  // Fetch amenities from API
  const { data: amenities } = useQuery<Amenity[]>({
    queryKey: ["/api/amenities"],
  });

  // Filter options
  const priceRanges = [
    { value: "", label: "Any price" },
    { value: "500-1000", label: "$500 - $1000" },
    { value: "1000-1500", label: "$1000 - $1500" },
    { value: "1500-2000", label: "$1500 - $2000" },
    { value: "2000+", label: "$2000+" },
  ];

  const housingTypes = [
    { value: "", label: "Any type" },
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
  ];

  const handleRemoveAmenity = (amenity: string) => {
    setSelectedAmenities(prev => prev.filter(a => a !== amenity));
  };

  const handleAddAmenity = (amenity: string) => {
    if (!selectedAmenities.includes(amenity)) {
      setSelectedAmenities(prev => [...prev, amenity]);
    }
    setIsAddingAmenity(false);
  };

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange({
      location,
      priceRange,
      housingType,
      amenities: selectedAmenities
    });
  }, [location, priceRange, housingType, selectedAmenities, onFilterChange]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <Label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location</Label>
          <div className="relative">
            <Input 
              id="location" 
              placeholder="City, neighborhood, or address" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pr-10"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <MapPin className="h-4 w-4" />
            </span>
          </div>
        </div>
        
        <div>
          <Label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price Range</Label>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Any price" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="housing-type" className="block text-sm font-medium text-slate-700 mb-1">Housing Type</Label>
          <Select value={housingType} onValueChange={setHousingType}>
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              {housingTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {selectedAmenities.map((amenity) => (
            <Badge key={amenity} variant="secondary" className="bg-indigo-100 text-primary hover:bg-indigo-200">
              {amenity}
              <button onClick={() => handleRemoveAmenity(amenity)} className="ml-1 hover:text-indigo-800">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {isAddingAmenity ? (
            <Select onValueChange={handleAddAmenity}>
              <SelectTrigger className="h-6 px-3 py-1 text-sm">
                <SelectValue placeholder="Select amenity" />
              </SelectTrigger>
              <SelectContent>
                {amenities?.filter(a => !selectedAmenities.includes(a.name)).map((amenity) => (
                  <SelectItem key={amenity.id} value={amenity.name}>
                    {amenity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <button
              onClick={() => setIsAddingAmenity(true)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm hover:bg-indigo-100 hover:text-primary"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Amenity
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
