import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../store/api/authApi";
// import { useGetProfileQuery } from "../store/api/authApi";
import { useAppDispatch } from "../store/hooks";
import { setCredentials, setUser } from "../store/slices/authSlice";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Film, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/axios";
// import { store } from "../store/store";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokens = await login({ username, password }).unwrap();
      dispatch(setCredentials({ tokens }));
      // console.log("Redux auth state after login:", store.getState().auth)
      // Fetch profile
      const { data: profile } = await api.get("users/me/");
      dispatch(setUser(profile));
      toast.success("Welcome back!");
      navigate("/");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Film className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Sign in to NaijaReels</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border/40 bg-card p-8">
          <div className="space-y-2">
             <Label htmlFor="username">Username</Label>
             <Input id="username" placeholder="e.g. johndoe" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign In
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-destructive hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
