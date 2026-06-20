import { Link } from "react-router-dom";
import { TrainFront } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <TrainFront className="h-12 w-12 text-primary mb-4" strokeWidth={1.5} />
      <h1 className="font-display text-3xl font-semibold mb-2">Wrong platform</h1>
      <p className="text-muted-foreground mb-6 max-w-sm">
        This page doesn't exist on the LkoMetro network. Let's get you back to the route planner.
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Back to LkoMetro
      </Link>
    </div>
  );
};

export default NotFound;
