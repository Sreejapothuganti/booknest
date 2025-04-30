import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import DashboardHeader from "@/components/dashboard-header";
import SearchFilter from "@/components/search-filter";
import ResultsTabs from "@/components/results-tabs";
import HousingCard from "@/components/housing-card";
import Pagination from "@/components/pagination";
import { Housing, Amenity } from "@shared/schema";
import { Loader2 } from "lucide-react";

type HousingWithAmenities = Housing & {
  amenities: Amenity[];
  isSaved: boolean;
};

export default function HomePage() {
  // Filters state
  const [filters, setFilters] = useState({
    location: "",
    priceRange: "",
    housingType: "",
    amenities: [] as string[],
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("available");
  const itemsPerPage = 6;
  
  // Load housing data
  const {
    data: allHousings,
    isLoading: isLoadingHousings,
    error: housingsError,
  } = useQuery<HousingWithAmenities[]>({
    queryKey: [activeTab === "available" ? "/api/housings" : "/api/saved-housings"],
  });
  
  // Filter housings based on criteria
  const filteredHousings = allHousings?.filter((housing) => {
    // Location filter
    if (filters.location && !housing.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (min && max && (housing.price < min || housing.price > max)) {
        return false;
      } else if (min && !max && housing.price < min) {
        return false;
      }
    }
    
    // Housing type filter (Would need to be added to the housing model)
    
    // Amenities filter
    if (filters.amenities.length > 0) {
      const housingAmenityNames = housing.amenities.map(a => a.name);
      if (!filters.amenities.every(amenity => housingAmenityNames.includes(amenity))) {
        return false;
      }
    }
    
    return true;
  }) || [];
  
  // Calculate pagination
  const totalItems = filteredHousings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);
  
  // Get current page items
  const currentHousings = filteredHousings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset to first page when tab changes
  };
  
  // Tabs configuration
  const tabs = [
    { id: "available", label: "Available", count: allHousings?.length || 0 },
    { id: "saved", label: "Saved", count: allHousings?.filter(h => h.isSaved).length || 0 },
    { id: "book-clubs", label: "Near Book Clubs", count: 12 }, // Mock count for now
  ];

  return (
    <Layout>
      <DashboardHeader />
      
      <SearchFilter onFilterChange={handleFilterChange} />
      
      <ResultsTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      {isLoadingHousings ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : housingsError ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error loading housing data</h3>
          <p className="text-slate-600">{housingsError.message || "Please try again later"}</p>
        </div>
      ) : filteredHousings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-slate-900 mb-2">No housings found</h3>
          <p className="text-slate-600">Try adjusting your filters to see more results</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentHousings.map((housing) => (
              <HousingCard key={housing.id} housing={housing} />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </Layout>
  );
}
