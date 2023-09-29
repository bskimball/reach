import { useEffect, useState } from "react";
import { Switch } from "@components/ui/switch.tsx";
import { Moon, Sun } from "lucide-react";

function DarkModeToggle() {
  const [checked, setChecked] = useState<boolean>(
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [checked]);

  return (
    <div className="flex items-center space-x-3">
      {checked ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}

export default DarkModeToggle;
