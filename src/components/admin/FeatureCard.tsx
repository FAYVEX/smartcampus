
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export function FeatureCard({ title, description, icon: Icon, color, onClick }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-6 rounded-xl transition-all duration-300 
        transform hover:scale-105 hover:shadow-xl animate-fade-in
        bg-white/50 backdrop-blur-lg border border-gray-200
        flex flex-col items-center text-center"
    >
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
  );
}
