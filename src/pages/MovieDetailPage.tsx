import { useParams, useNavigate } from "react-router-dom";
import { useGetMovieQuery } from "../store/api/movieApi";
import { useRentMovieMutation } from "../store/api/rentalApi";
import { useGetMovieInventoryQuery, useUpdateInventoryMutation } from "../store/api/inventoryApi";
import { useAppSelector } from "../store/hooks";
import Navbar from "../components/Navbar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const role = user?.role;

  const { data: movie, isLoading } = useGetMovieQuery(Number(id));
  const [rentMovie, { isLoading: renting }] = useRentMovieMutation();

  const { data: inventory } = useGetMovieInventoryQuery(Number(id));
  const [updateInventory, { isLoading: updatingInventory }] = useUpdateInventoryMutation();
  const [newCopies, setNewCopies] = useState<string>("");
  const [newTotalCopies, setNewTotalCopies] = useState<string>("");


  const handleRent = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    try {
      await rentMovie(Number(id)).unwrap();
      toast.success("Movie rented successfully!");
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data?.detail || "Failed to rent movie");
    }
  };

  const handleInventoryUpdate = async () => {
  if (!inventory) return;

  const totalCopies =
    newTotalCopies === "" ? inventory.total_copies : Number(newTotalCopies);

  const availableCopies =
    newCopies === "" ? inventory.available_copies : Number(newCopies);

  // validation
  if (
    isNaN(totalCopies) ||
    isNaN(availableCopies) ||
    totalCopies < 0 ||
    availableCopies < 0
  ) {
    toast.error("Please enter valid numbers");
    return;
  }

  if (availableCopies > totalCopies) {
    toast.error("Available copies cannot exceed total copies");
    return;
  }

  try {
    await updateInventory({
      id: inventory.id,
      total_copies: totalCopies,
      available_copies: availableCopies,
    }).unwrap();

    toast.success("Inventory updated!");

    setNewCopies("");
    setNewTotalCopies("");
  } catch (err: any) {
    toast.error(err?.data?.detail || "Failed to update inventory");
  }
};
  
  const copies = inventory?.available_copies ?? 0;


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-[300px_1fr]">
            <Skeleton className="aspect-2/3 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : movie ? (
          <div className="grid gap-8 md:grid-cols-[300px_1fr]">
            <div className="aspect-2/3 overflow-hidden rounded-lg border border-border/40 bg-linear-to-br from-muted to-accent">
                <div className="flex h-full items-center justify-center">
                  <span className="text-5xl font-black text-muted-foreground/20">{movie.title[0]}</span>
                </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-foreground">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{movie.genre}</Badge>
                {movie.release_year && <span className="text-sm text-muted-foreground">{movie.release_year}</span>}
                <Badge className={copies > 0 ? "bg-emerald-600" : "bg-destructive"}>
                  {copies > 0 ? `${copies} available` : "Unavailable"}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-amber-500">
                ${movie.daily_rate}<span className="text-sm font-normal text-muted-foreground">/day</span>
              </p>
              
              {/* Customer: Rent button */}
              {isAuthenticated && role === "customer" && (
                <Button
                  size="lg"
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={copies <= 0 || renting}
                  onClick={handleRent}
                >
                  {renting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {copies > 0 ? "Rent Now" : "Out of Stock"}
                </Button>
              )}
              {/* Not logged in: prompt to log in */}
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Log in to Rent
                </Button>
              )}
              {/* Vendor: Inventory management */}
              {isAuthenticated && role === "vendor"  && (
                <div className="rounded-xl border border-border/40 bg-card p-4 space-y-3">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Package className="h-4 w-4" />
                    Inventory Management
                  </div>
                  {inventory ? (
                    <>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg bg-muted p-3">
                          <div className="text-muted-foreground">Total Copies</div>
                          <div className="text-xl font-bold text-foreground">{inventory.available_copies}</div>
                        </div>
                        <div className="rounded-lg bg-muted p-3">
                          <div className="text-muted-foreground">Available</div>
                          <div className={`text-xl font-bold ${inventory.available_copies > 0 ? "text-foreground" : "text-destructive"}`}>
                            {inventory.available_copies}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">Set Total Copies</Label>
                          <Input
                            type="number"
                            min={0}
                            max={inventory.total_copies}
                            value={newTotalCopies}
                            onChange={(e) => setNewTotalCopies(e.target.value)}
                            placeholder={String(inventory.total_copies)}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">Set Available Copies</Label>
                          <Input
                            type="number"
                            min={0}
                            max={inventory.available_copies}
                            value={newCopies}
                            onChange={(e) => setNewCopies(e.target.value)}
                            placeholder={String(inventory.available_copies)}
                          />
                        </div>
                        <Button
                          onClick={handleInventoryUpdate}
                          disabled={updatingInventory || newCopies === "" && newTotalCopies === ""}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {updatingInventory ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No inventory record found for this movie.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Movie not found.</p>
        )}
      </main>
    </div>
  );
};

export default MovieDetailPage;
