import { Outlet } from "react-router-dom";

function ViewAdmin() {
  return (
    <div id="view-settings">
      <Outlet />
    </div>
  );
}

export default ViewAdmin;
