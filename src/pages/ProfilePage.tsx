import { useState } from "react";
import Navbar from "../components/Navbar";
import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from "../store/api/authApi";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/authSlice";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";

const ProfilePage = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPw }] = useChangePasswordMutation();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({ username: "", phone: "" });
  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "" });
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setForm({ username: profile.username, phone: profile.phone || "" });
    setInitialized(true);
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(form).unwrap();
      dispatch(setUser(updated));
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update profile"); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(pwForm).unwrap();
      setPwForm({ old_password: "", new_password: "" });
      toast.success("Password changed!");
    } catch { toast.error("Failed to change password"); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-black text-foreground">Profile</h1>

        {isLoading ? (
          <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : (
          <>
            <form onSubmit={handleUpdate} className="mb-8 space-y-4 rounded-xl border border-border/40 bg-card p-6">
              <h2 className="text-lg font-bold text-foreground">Personal Info</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={form.username} onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <Button type="submit" className="bg-destructive hover:bg-destructive/90" disabled={updating}>
                {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </form>

            <form onSubmit={handlePasswordChange} className="space-y-4 rounded-xl border border-border/40 bg-card p-6">
              <h2 className="text-lg font-bold text-foreground">Change Password</h2>
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" value={pwForm.old_password} onChange={(e) => setPwForm((p) => ({ ...p, old_password: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={pwForm.new_password} onChange={(e) => setPwForm((p) => ({ ...p, new_password: e.target.value }))} required />
              </div>
              <Button type="submit" variant="outline" disabled={changingPw}>
                {changingPw ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Change Password
              </Button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
