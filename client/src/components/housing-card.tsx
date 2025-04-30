import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Housing, Amenity } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface HousingCardProps {
  housing: Housing & {
    amenities: Amenity[];
    isSaved: boolean;
  };
}

export function HousingCard({ housing }: HousingCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to save properties");
      }
      
      if (housing.isSaved) {
        await apiRequest("DELETE", `/api/housings/${housing.id}/save`);
        return false;
      } else {
        await apiRequest("POST", `/api/housings/${housing.id}/save`);
        return true;
      }
    },
    onSuccess: (isSaved) => {
      // Update the cache
      queryClient.setQueryData(["/api/housings"], (old: any) => {
        if (!old) return old;
        return old.map((h: typeof housing) => 
          h.id === housing.id ? { ...h, isSaved } : h
        );
      });
      
      // Show toast
      toast({
        title: isSaved ? "Property saved" : "Property removed from saved list",
        description: isSaved 
          ? "You can find this property in your saved listings" 
          : "This property has been removed from your saved listings",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSaveToggle = () => {
    saveMutation.mutate();
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={housing.imageUrl} 
          alt={housing.title} 
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white rounded-full p-2 shadow-sm hover:text-primary"
            aria-label={housing.isSaved ? "Remove from favorites" : "Save to favorites"}
            onClick={handleSaveToggle}
            disabled={saveMutation.isPending || !user}
          >
            <Heart className={`h-4 w-4 ${housing.isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        {(housing.isNew || housing.isPopular) && (
          <div className="absolute bottom-3 left-3">
            {housing.isNew && (
              <Badge className="bg-green-100 text-green-800">
                New
              </Badge>
            )}
            {housing.isPopular && (
              <Badge className="bg-indigo-100 text-indigo-800">
                Popular
              </Badge>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg mb-1">{housing.title}</h3>
            <p className="text-slate-600 text-sm">{housing.location}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">${housing.price}</p>
            <p className="text-slate-600 text-sm">per month</p>
          </div>
        </div>
        
        <div className="flex items-center mt-4 text-sm text-slate-600 space-x-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{housing.bedrooms} {housing.bedrooms === 1 ? 'bed' : 'beds'}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{housing.bathrooms} {housing.bathrooms === 1 ? 'bath' : 'baths'}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{housing.sqft} sqft</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1">
          {housing.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity.id} className="inline-block px-2 py-1 text-xs font-medium rounded bg-indigo-50 text-primary">
              {amenity.name}
            </span>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Button 
            variant="link" 
            className="text-primary hover:text-indigo-800 text-sm p-0 h-auto font-medium"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HousingCard;
