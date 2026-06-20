import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, ThemePreference } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
  { value: "system", label: "System", icon: <Monitor className="h-3.5 w-3.5" /> },
];

export const ThemeToggle = () => {
  const { preference, setPreference } = useTheme();

  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-secondary/40 p-1 gap-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setPreference(opt.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
            preference === opt.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={preference === opt.value}
        >
          {opt.icon}
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
