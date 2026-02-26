import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useGetMoviesQuery } from "../store/api/movieApi";
import { useGetInventoryQuery } from "../store/api/inventoryApi";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setSearchQuery, setSelectedGenre, setCurrentPage } from "../store/slices/uiSlice";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import { Skeleton } from "../components/ui/skeleton";
import { useMemo, useState } from "react";
import type { Movie } from "../lib/types"

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Romance", "Animation", "Documentary"];

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedGenre, currentPage } = useAppSelector((s) => s.ui);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const { data, isLoading, isFetching } = useGetMoviesQuery({
    page: currentPage,
    search: searchQuery || undefined,
    genre: selectedGenre || undefined,
  });

  const { data: inventoryData } = useGetInventoryQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
  };

  const heroMovie = useMemo(() => data?.results?.[0], [data]);
  const totalPages = data ? Math.ceil(data.count / 10) : 1;


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      {heroMovie && !searchQuery && !selectedGenre && currentPage === 1 && (
        <section className="relative flex h-[50vh] items-end overflow-hidden bg-linear-to-br from-muted to-background">
          {/* {heroMovie.image_url && (
            <img alt={heroMovie.title} className="absolute inset-0 h-full w-full object-cover opacity-30" />
          )} */}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12">
            <h1 className="text-4xl font-black tracking-tight text-foreground md:text-6xl">{heroMovie.title}</h1>
            <p className="mt-2 max-w-xl text-lg text-muted-foreground">{heroMovie.genre}</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium text-amber-500">${heroMovie.daily_rate}/day</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{heroMovie.genre}</span>
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Search + Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              className="pl-10"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </form>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedGenre === "" ? "default" : "outline"}
              size="sm"
              onClick={() => dispatch(setSelectedGenre(""))}
              className={selectedGenre === "" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              All
            </Button>
            {GENRES.map((g) => (
              <Button
                key={g}
                variant={selectedGenre === g ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setSelectedGenre(g))}
                className={selectedGenre === g ? "bg-destructive hover:bg-destructive/90" : ""}
              >
                {g}
              </Button>
            ))}
          </div>
        </div>

        {/* Movie Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-2/3 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : data?.results.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No movies found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data?.results.map((movie: Movie) => {
              const inventoryForMovie = inventoryData?.results?.find(
                (inv) => inv.movie === movie.id
              );

              return (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  inventory={inventoryForMovie}
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || isFetching}
              onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isFetching}
              onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
