
import { Button } from "@/components/ui/button";
import { ClipboardList, MapPin } from "lucide-react";

type SafetyNavButtonsProps = {
  onNavigate: (path: string) => void;
};

export function SafetyNavButtons({ onNavigate }: SafetyNavButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button
        variant="outline"
        size="lg"
        className="p-8 h-auto flex flex-col items-center gap-4"
        onClick={() => onNavigate('/incident-report')}
      >
        <ClipboardList className="w-8 h-8" />
        <div className="text-center">
          <h3 className="font-semibold">Report Incident</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            File a detailed incident report
          </p>
        </div>
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="p-8 h-auto flex flex-col items-center gap-4"
        onClick={() => onNavigate('/safety-map')}
      >
        <MapPin className="w-8 h-8" />
        <div className="text-center">
          <h3 className="font-semibold">Campus Safety Map</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            View nearby security locations
          </p>
        </div>
      </Button>
    </div>
  );
}
