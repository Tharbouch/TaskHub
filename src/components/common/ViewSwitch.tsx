import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ViewSwitch({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
}) {
  return (
    <div className="inline-flex rounded-md shadow-sm">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="sm"
        className="rounded-r-none"
        onClick={() => setViewMode("grid")}
      >
        <LayoutGrid className="h-4 w-4 mr-2" /> Grid View
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "outline"}
        size="sm"
        className="rounded-l-none"
        onClick={() => setViewMode("table")}
      >
        <List className="h-4 w-4 mr-2" /> Table View
      </Button>
    </div>
  );
}
