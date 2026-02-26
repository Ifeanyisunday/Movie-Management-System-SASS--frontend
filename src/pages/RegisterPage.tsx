import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../store/api/authApi";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Film, Loader2 } from "lucide-react";
import { toast } from "sonner";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", phone: "", role: "customer" });
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form).unwrap();
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      const msg = err?.data ? Object.values(err.data).flat().join(", ") : "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Film className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join NaijaReels and start renting movies</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border/40 bg-card p-8">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={form.username} onChange={handleChange} required placeholder="e.g. johndoe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="08012345678" />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, role: "customer" }))}
                className={`rounded-lg border p-4 ${
                  form.role === "customer" ? "border-destructive bg-destructive/10" : ""
                }`}
              >
                Customer
              </button>

              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, role: "vendor" }))}
                className={`rounded-lg border p-4 ${
                  form.role === "vendor" ? "border-destructive bg-destructive/10" : ""
                }`}
              >
                Vendor
              </button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Strong password" />
          </div>
          <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-destructive hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
