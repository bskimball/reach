import { format } from "date-fns";

export default function Footer() {
  return (
    <footer>
      <div className="container py-6">
        <div>&copy; {format(new Date(), "yyyy")} BDKinc</div>
      </div>
    </footer>
  );
}
