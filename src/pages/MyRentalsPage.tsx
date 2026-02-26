import Navbar from "../components/Navbar";
import { useGetMyRentalsQuery, useReturnMovieMutation } from "../store/api/rentalApi";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Rental } from "../lib/types";

const MyRentalsPage = () => {
  const { data, isLoading, error } = useGetMyRentalsQuery({ page: 1 });
  const [returnMovie, { isLoading: returning }] = useReturnMovieMutation();

  const handleReturn = async (rentalId: number) => {
    try {
      await returnMovie(rentalId).unwrap();
      toast.success("Movie returned!");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to return movie");
    }
  };

  
  const rentals = data?.results ?? [];

  const active = (rentals.filter(rent => rent.status !== "RETURNED")) || [];
  const history = (rentals.filter(rent => rent.status === "RETURNED")) || [];

  if (error) {
    return <p>Failed to load rentals.</p>;
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";

    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) return "—";

    return format(parsed, "MMM d, yyyy");
  };
  



  return (

    
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-black text-foreground">My Rentals</h1>

        {/* Active */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">Active Rentals</h2>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>
          ) : active.length === 0 ? (
            <p className="rounded-lg border border-border/40 bg-card p-6 text-center text-muted-foreground">No active rentals</p>
          ) : (
            <div className="space-y-3">
              {active.map((rental: Rental) => (
                <div key={rental.id} className="flex items-center justify-between rounded-lg border border-border/40 bg-card p-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{rental.movie_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Rented: {formatDate(rental.rented_at)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                    disabled={returning}
                    onClick={() => handleReturn(rental.id)}
                  >
                    {returning ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
                    Return
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Rental History</h2>
          {history.length === 0 ? (
            <p className="rounded-lg border border-border/40 bg-card p-6 text-center text-muted-foreground">No past rentals</p>
          ) : (
            <div className="space-y-3">
              {history.map((rental: Rental) => (
                <div key={rental.id} className="flex items-center justify-between rounded-lg border border-border/40 bg-card p-4 opacity-70">
                  <div>
                    <h3 className="font-semibold text-foreground">{rental.movie_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(rental.rented_at)} – {formatDate(rental.rented_at)}
                    </p>
                  </div>
                  <Badge variant="secondary">Returned</Badge>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyRentalsPage;
