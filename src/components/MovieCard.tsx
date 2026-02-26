import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import type { Movie, Inventory } from "../lib/types";

interface MovieCardProps {
  inventory?: Inventory;
  movie: Movie;
}

const MovieCard = ({ inventory, movie }: MovieCardProps) => {
  const available = inventory?.available_copies ?? 0;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/movies/${movie.id}`} className="group block overflow-hidden rounded-lg border border-border/40 bg-card transition-shadow hover:shadow-xl hover:shadow-destructive/5">
        {/* Poster placeholder */}
        <div className="relative aspect-2/3 overflow-hidden bg-linear-to-br from-muted to-accent">
          <div className="flex h-full items-center justify-center">
                <span className="text-5xl font-black text-muted-foreground/20">{movie.title[0]}</span>
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent" />
            <Badge className={`absolute right-2 top-2 ${available ? "bg-emerald-600 hover:bg-emerald-700" : "bg-destructive"}`}>
              {available ? "Available" : "Unavailable"}
            </Badge>
          </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="truncate text-sm font-semibold text-foreground">{movie.title}</h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{movie.genre}</span>
            <span className="text-xs font-medium text-amber-500">${movie.daily_rate}/day</span>
          </div>
          {movie.release_year && <span className="text-xs text-muted-foreground">{movie.release_year}</span>}
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
