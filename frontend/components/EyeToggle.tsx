import { Eye, EyeOff } from "lucide-react";

import { Button } from "./ui/button";

export function EyeToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      variant="icon"
      onClick={onToggle}
      className="text-muted-foreground absolute inset-y-0 right-0 rounded-l-none"
    >
      {show ? <EyeOff /> : <Eye />}
    </Button>
  );
}
