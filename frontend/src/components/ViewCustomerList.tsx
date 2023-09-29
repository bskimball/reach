import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@components/ui/dialog.tsx";
import { Button } from "@components/ui/button.tsx";
import { Plus } from "lucide-react";
import CustomerForm from "@components/CustomerForm.tsx";
import CustomerList from "@components/CustomerList.tsx";
import { useState } from "react";
import FilterWidget from "@components/FilterWidget.tsx";

function ViewCustomerList() {
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  return (
    <div id="view-customer-list">
      <div className="flex space-x-4 py-4">
        <div>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <Button asChild>
              <DialogTrigger>
                <Plus className="w-4 h-4 mr-1" /> Add Customer
              </DialogTrigger>
            </Button>
            <DialogContent>
              <CustomerForm onSubmit={() => setOpenCreate(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <FilterWidget />
        </div>
      </div>
      <div>
        <CustomerList />
      </div>
    </div>
  );
}

export default ViewCustomerList;
