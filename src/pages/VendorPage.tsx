import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useGetMoviesQuery, useCreateMovieMutation, useDeleteMovieMutation, useUpdateMovieMutation } from "../store/api/movieApi";
import { useGetVendorRentalsQuery } from "../store/api/rentalApi";
import { useGetInventoryQuery} from "../store/api/inventoryApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Loader2, Plus, Trash2, Pencil, Film, Receipt, Package } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { MovieFormData, Inventory } from "../lib/types";

const emptyForm: MovieFormData = { title: "", genre: "", daily_rate: undefined, release_year: undefined, price: undefined };

const VendorPage = () => {
  const navigate = useNavigate();
  const [movieForm, setMovieForm] = useState<MovieFormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { data: moviesData, isLoading } = useGetMoviesQuery({ page: 1 });
  const { data: rentalsData, isLoading: loadingRentals } = useGetVendorRentalsQuery({ page: 1 });
  const { data: inventoryData, isLoading: loadingInventory } = useGetInventoryQuery();
  const [createMovie, { isLoading: creating }] = useCreateMovieMutation();
  const [updateMovie, { isLoading: updating }] = useUpdateMovieMutation();
  const [deleteMovie] = useDeleteMovieMutation();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMovie({ id: editingId, data: movieForm }).unwrap();
        toast.success("Movie updated!");
      } else {
        await createMovie(movieForm).unwrap();
        toast.success("Movie created!");
      }
      setMovieForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch {
      toast.error(editingId ? "Failed to update movie" : "Failed to create movie");
    }
  };

  const handleEdit = (movie: { id: number; title: string; genre: string; daily_rate?: number; release_year?: number; price?: number}) => {
    setEditingId(movie.id);
    setMovieForm({
      title: movie.title,
      genre: movie.genre,
      daily_rate: movie.daily_rate,
      release_year: movie.release_year,
      price: movie.price
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this movie?")) return;
    try {
      await deleteMovie(id).unwrap();
      toast.success("Movie deleted");
    } catch {
      toast.error("Failed to delete movie");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setMovieForm(emptyForm);
  };


  // console.log(inventoryData?.results);


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-black text-foreground">Vendor Dashboard</h1>
        <p className="mb-8 text-muted-foreground">Manage your movie catalog and view rental activity</p>

        <Tabs defaultValue="movies">
          <TabsList className="mb-6">
            <TabsTrigger value="movies" className="flex items-center gap-1">
              <Film className="h-4 w-4" /> My Movies
            </TabsTrigger>
            <TabsTrigger value="rentals" className="flex items-center gap-1">
              <Receipt className="h-4 w-4" /> Rentals
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-1">
              <Package className="h-4 w-4" /> Inventory
            </TabsTrigger>
          </TabsList>

          {/* ── My Movies Tab ── */}
          <TabsContent value="movies">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Film className="h-5 w-5" />
                <span className="text-lg font-semibold text-foreground">{moviesData?.count ?? 0} movies</span>
              </div>
              <Button
                size="sm"
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => { setShowForm(!showForm); setEditingId(null); setMovieForm(emptyForm); }}
              >
                <Plus className="mr-1 h-4 w-4" /> Add Movie
              </Button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-border/40 bg-card p-6">
                <h3 className="text-lg font-bold text-foreground">{editingId ? "Edit Movie" : "New Movie"}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Title</Label><Input value={movieForm.title} onChange={(e) => setMovieForm((p) => ({ ...p, title: e.target.value }))} required /></div>
                  <div className="space-y-2"><Label>Genre</Label><Input value={movieForm.genre} onChange={(e) => setMovieForm((p) => ({ ...p, genre: e.target.value }))} required /></div>
                  <div className="space-y-2"><Label>Daily Rate ($)</Label><Input value={movieForm.daily_rate} onChange={(e) => setMovieForm((p) => ({ ...p, daily_rate: Number(e.target.value) }))} required /></div>
                  <div className="space-y-2"><Label>Year</Label><Input type="number" value={movieForm.release_year ?? ""} onChange={(e) => setMovieForm((p) => ({ ...p, release_year: e.target.value ? Number(e.target.value) : undefined }))} /></div>
                </div>
                <div className="space-y-2"><Label>Price</Label><Input type="number" value={movieForm.price ?? ""} onChange={(e) => setMovieForm((p) => ({ ...p, price: e.target.value ? Number(e.target.value) : undefined }))} /></div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-destructive hover:bg-destructive/90" disabled={creating || updating}>
                    {(creating || updating) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingId ? "Update Movie" : "Create Movie"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                </div>
              </form>
            )}

            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
            ) : (
              <div className="rounded-xl border border-border/40">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Daily Rate</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {moviesData?.results.map((movie) => (
                      <TableRow key={movie.id}>
                        <TableCell className="font-medium">{movie.title}</TableCell>
                        <TableCell>{movie.genre}</TableCell>
                        <TableCell>{movie.release_year ?? "—"}</TableCell>
                        <TableCell>${movie.daily_rate}/day</TableCell>
                        <TableCell>{movie.price}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" title="Manage Inventory" onClick={() => navigate(`/movies/${movie.id}`)}>
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(movie)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(movie.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ── Rentals Tab ── */}
          <TabsContent value="rentals">
            <h2 className="mb-4 text-lg font-bold text-foreground">
              Rentals of Your Movies ({rentalsData?.count ?? 0})
            </h2>
            {loadingRentals ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
            ) : rentalsData?.results.length === 0 ? (
              <p className="rounded-lg border border-border/40 bg-card p-6 text-center text-muted-foreground">No rentals yet</p>
            ) : (
              <div className="rounded-xl border border-border/40">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Movie</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Rented On</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rentalsData?.results.map((rent) => (
                      <TableRow key={rent.id}>
                        <TableCell className="font-medium">{rent.movie_title}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {rent.user_username ? `${rent.user_username}` : "—"}
                        </TableCell>
                        <TableCell>{format(new Date(rent.rented_at), "MMM d, yyyy")}</TableCell>
                        <TableCell>${rent.rented_at}/day</TableCell>
                        <TableCell>
                          <Badge variant={rent.rented_at ? "secondary" : "default"} className={!rent.rented_at ? "bg-amber-600 text-white" : ""}>
                            {rent.rented_at ? "Returned" : "Active"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ── Inventory Tab ── */}
          <TabsContent value="inventory">
            <h2 className="mb-4 text-lg font-bold text-foreground">
              My Inventory ({inventoryData?.results.length ?? 0} movies)
            </h2>
            {loadingInventory ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
            ) : !inventoryData?.results.length ? (
              <p className="rounded-lg border border-border/40 bg-card p-6 text-center text-muted-foreground">No inventory records</p>
            ) : (
              <div className="rounded-xl border border-border/40">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Movie</TableHead>
                      {/* <TableHead>Total Copies</TableHead> */}
                      <TableHead>Available Copies</TableHead>
                      <TableHead>Rented Out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    
                    {inventoryData?.results.map((inventory: Inventory) => (
            
                      <TableRow key={inventory.id}>
                        <TableCell className="font-medium">{inventory.movie_title}</TableCell>
                        {/* <TableCell>{inventory.total_copies}</TableCell> */}
                        <TableCell>
                          <Badge variant={inventory.available_copies > 0 ? "secondary" : "destructive"}>
                            {inventory.available_copies}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{inventory.total_copies - inventory.available_copies} rented</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default VendorPage;
