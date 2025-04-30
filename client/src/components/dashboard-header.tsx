import { Button } from "@/components/ui/button";
import { PlusCircle, SlidersHorizontal } from "lucide-react";

interface DashboardHeaderProps {
  onOpenFilters?: () => void;
  onSaveSearch?: () => void;
}

export function DashboardHeader({ onOpenFilters, onSaveSearch }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Find your perfect reading haven</h2>
        <p className="text-slate-600">Discover housing options for book lovers with the amenities you need</p>
      </div>
      <div className="mt-4 lg:mt-0 w-full lg:w-auto flex flex-col sm:flex-row sm:space-x-3">
        <Button 
          variant="default" 
          className="mb-2 sm:mb-0"
          onClick={onSaveSearch}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Save New Search
        </Button>
        <Button 
          variant="outline" 
          onClick={onOpenFilters}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}

export default DashboardHeader;
