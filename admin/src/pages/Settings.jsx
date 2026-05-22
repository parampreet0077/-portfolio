import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../api";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { FileUpload } from "../components/ui/FileUpload";
import { fileUrl } from "../api";

const normalizeSettings = (data = {}) => ({
  name: data.name || "Admin",
  theme: data.theme || "light",
  accentColor: data.accentColor || "#7c3aed",
  newPassword: ""
});

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  
  const [form, setForm] = useState({
    name: "",
    theme: "light",
    accentColor: "#7c3aed",
    newPassword: ""
  });

  useEffect(() => {
    api.get("/settings").then(({ data }) => {
      setForm(normalizeSettings(data));
      if (data.profileImage) {
        setPreview(fileUrl(data.profileImage));
      }
    }).catch((err) => {
      console.error("Failed to load settings", err);
      toast.error("Could not load saved settings.");
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key !== "newPassword" || form[key]) formData.append(key, form[key]);
    });
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      const { data } = await api.put("/settings", formData);
      setForm(normalizeSettings(data));
      if (data.profileImage) setPreview(fileUrl(data.profileImage));
      setProfileImage(null);
      toast.success("Settings updated successfully");
    } catch (err) {
      console.error("Failed to save settings", err);
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500">Manage your admin profile and preferences.</p>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader title="Profile Picture" />
            <CardContent>
              <FileUpload
                accept="image/*"
                previewUrl={preview}
                onFileSelect={(file) => {
                  setProfileImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
                onClear={() => {
                  setProfileImage(null);
                  setPreview("");
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Personal Information" />
            <CardContent className="space-y-4">
              <Input 
                label="Admin Name" 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
              <Input 
                label="New Password (leave blank to keep current)" 
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({...form, newPassword: e.target.value})}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Preferences" />
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="theme" value="light" checked={form.theme === "light"} onChange={(e) => setForm({...form, theme: e.target.value})} className="text-purple-600 focus:ring-purple-500" />
                    Light
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="theme" value="dark" checked={form.theme === "dark"} onChange={(e) => setForm({...form, theme: e.target.value})} className="text-purple-600 focus:ring-purple-500" />
                    Dark
                  </label>
                </div>
              </div>
              <Input 
                label="Accent Color (Hex)" 
                type="color"
                className="w-32"
                value={form.accentColor}
                onChange={(e) => setForm({...form, accentColor: e.target.value})}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
