import { useState } from "react";
import Navbar from "../components/Navbar";
import { useGetAnalyticsQuery, useGetAdminUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from "../store/api/adminApi";
import { useGetAllRentalsQuery } from "../store/api/rentalApi";
import { useGetMoviesQuery } from "../store/api/movieApi";
import { useGetInventoryQuery } from "../store/api/inventoryApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Trash2, Users, BarChart3, Package, TrendingUp, Film } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { UserRole } from "../lib/types";
import type { Inventory } from "../lib/types";

const AdminPage = () => {
  const [tab, setTab] = useState("analytics");

  const { data: analytics, isLoading: loadingAnalytics } = useGetAnalyticsQuery();
  const { data: usersData, isLoading: loadingUsers } = useGetAdminUsersQuery({ page: 1 });
  const { data: rentalsData, isLoading: loadingRentals } = useGetAllRentalsQuery({ page: 1 });
  const { data: moviesData, isLoading: loadingMovies } = useGetMoviesQuery({ page: 1 });
  const { data: inventoryData, isLoading: loadingInventory } = useGetInventoryQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleRoleChange = async (userId: number, role: UserRole) => {
    try {
      await updateUserRole({ id: userId, role }).unwrap();
      toast.success("User role updated");
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

// console.log(usersData?.results);
  


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-black text-foreground">Admin Dashboard</h1>
        <p className="mb-8 text-muted-foreground">System analytics, user management, and platform overview</p>

        {/* Analytics Summary */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {loadingAnalytics ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          ) : (
            <>
              <div className="rounded-xl border border-border/40 bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /> Users</div>
                <p className="mt-1 text-2xl font-bold text-foreground">{analytics?.total_customers ?? 0}</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground"><Package className="h-4 w-4" /> Movies</div>
                <p className="mt-1 text-2xl font-bold text-foreground">{analytics?.top_movies?.[0]?.movie__title ?? "None"}</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground"><BarChart3 className="h-4 w-4" /> Active Rentals</div>
                <p className="mt-1 text-2xl font-bold text-foreground">{analytics?.active_rentals ?? 0}</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-4 w-4" /> Revenue</div>
                <p className="mt-1 text-2xl font-bold text-foreground">${analytics?.total_revenue ?? "0"}</p>
              </div>
            </>
          )}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="analytics">All Rentals</TabsTrigger>
            <TabsTrigger value="movies">All Movies</TabsTrigger>
            <TabsTrigger value="inventory">All Inventory</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* All Rentals */}
          <TabsContent value="analytics">
            <h2 className="mb-4 text-lg font-bold text-foreground">All Rentals ({rentalsData?.count ?? 0})</h2>
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

          {/* All Movies (read-only) */}
          <TabsContent value="movies">
            <h2 className="mb-4 text-lg font-bold text-foreground">All Movies ({moviesData?.count ?? 0})</h2>
            {loadingMovies ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
            ) : moviesData?.results.length === 0 ? (
              <p className="rounded-lg border border-border/40 bg-card p-6 text-center text-muted-foreground">No movies in the system</p>
            ) : (
              <div className="rounded-xl border border-border/40">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Daily Rate</TableHead>
                      {/* <TableHead>Stock</TableHead> */}
                      <TableHead>Available</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {moviesData?.results.map((movie) => (
                      <TableRow key={movie.id}>
                        <TableCell className="font-medium flex items-center gap-2">

                            <div className="flex h-8 w-6 items-center justify-center rounded bg-muted ml-4">
                              <Film className="h-3 w-3 text-muted-foreground" />
                              {movie.title}
                            </div>
        
                        </TableCell>
                        <TableCell>{movie.genre}</TableCell>
                        <TableCell>{movie.release_year?? "—"}</TableCell>
                        <TableCell>${movie.daily_rate}/day</TableCell>
                        <TableCell>
                          <Badge variant={inventoryData?.results.find(i => i.movie === movie.id)?.available_copies ?? 0 > 0 ? "secondary" : "destructive"}>{inventoryData?.results.find(i => i.movie === movie.id)?.available_copies} available</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* All Inventory */}
          <TabsContent value="inventory">
            <h2 className="mb-4 text-lg font-bold text-foreground">All Inventory ({inventoryData?.results.length ?? 0})</h2>
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
                      <TableHead>Total Copies</TableHead>
                      <TableHead>Available Copies</TableHead>
                      <TableHead>Rented Out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData?.results.map((inventory: Inventory) => (
                      <TableRow key={inventory.id}>
                        <TableCell className="font-medium">{inventory.movie ?? `Movie #${inventory.movie}`}</TableCell>
                        {/* <TableCell>{inventory.total_copies}</TableCell> */}
                        <TableCell>
                          <Badge variant={inventory.available_copies > 0 ? "secondary" : "destructive"}>
                            {inventory.available_copies}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{inventory.available_copies}</TableCell>
                        <TableCell className="text-muted-foreground">{analytics?.active_rentals}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <h2 className="mb-4 text-lg font-bold text-foreground">Users ({usersData?.count ?? 0})</h2>
            {loadingUsers ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
            ) : (
              <div className="rounded-xl border border-border/40">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData?.results.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Select value={user.role} onValueChange={(val) => handleRoleChange(user.id, val as UserRole)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="vendor">Vendor</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
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

export default AdminPage;
