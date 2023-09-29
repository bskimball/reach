import DemographicForm from "@components/DemographicForm.tsx";
import DemographicList from "@components/DemographicList.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@components/ui/dialog.tsx";
import { useState } from "react";
import { Button } from "@components/ui/button.tsx";
import { Plus } from "lucide-react";

function DemographicWidget({ customerId }: { customerId: number }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="demographic-widget">
      <div className="py-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <Button asChild>
            <DialogTrigger>
              <Plus className="w-4 h-4 mr-1" /> Add Demographic
            </DialogTrigger>
          </Button>
          <DialogContent>
            <DemographicForm
              customerId={customerId}
              onSubmit={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <DemographicList customerId={customerId} />
      </div>
    </div>
  );
}

export default DemographicWidget;
