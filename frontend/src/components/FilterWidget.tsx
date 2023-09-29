import FilterForm from "@components/FilterForm.tsx";
import { Filter, XCircle } from "lucide-react";
import { Button } from "@components/ui/button.tsx";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import qs from "qs";
import { cn } from "@lib/utils.ts";

function FilterWidget() {
  const [show, setShow] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const queryObject = qs.parse(searchParams.toString());

  function handleFilterRemove(key: string) {
    setSearchParams((prev) => {
      const prevObject = qs.parse(prev.toString());
      delete prevObject[key];
      return qs.stringify({ ...prevObject });
    });
  }

  return (
    <div className="flex space-x-4">
      <Button onClick={() => setShow(!show)}>
        <Filter className="w-4 h-4 mr-1" /> Add Filter
      </Button>
      <div className="flex flex-col space-y-4">
        <div className="min-w-[1px] min-h-[40px]">
          {show && <FilterForm onSubmit={() => setShow(false)} />}
        </div>
        <div className="flex items-center space-x-4">
          <div className="ml-3 mr-1">filters: </div>
          {Object.keys(queryObject).map((key) => (
            <Button
              key={key}
              onClick={() => handleFilterRemove(key)}
              variant="outline"
              className={cn("rounded-full")}
            >
              <div className="flex space-x-1">
                <span>{key}</span>:
                <span>{JSON.stringify(queryObject[key])}</span>
              </div>
              <XCircle className="w-4 h-4 ml-2" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterWidget;
