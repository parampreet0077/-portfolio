import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";

const emptySocialLinks = { github: "", linkedin: "", instagram: "", twitter: "" };
const normalizeContact = (data = {}) => ({
  email: data.email || "",
  phone: data.phone || "",
  address: data.address || "",
  whatsapp: data.whatsapp || "",
  googleMapsLink: data.googleMapsLink || "",
  socialLinks: { ...emptySocialLinks, ...(data.socialLinks || {}) }
});

export default function ManageContact() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "", phone: "", address: "", whatsapp: "", googleMapsLink: "",
    socialLinks: emptySocialLinks
  });

  useEffect(() => {
    api.get("/contact").then(({ data }) => {
      if (data && Object.keys(data).length > 0) {
        setForm(normalizeContact(data));
      }
    }).catch((err) => {
      console.error("Failed to load contact data", err);
      toast.error("Could not load saved contact data.");
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/contact", form);
      setForm(normalizeContact(data));
      toast.success("Contact details updated!");
    } catch (err) {
      console.error("Failed to save contact data", err);
      toast.error(err.response?.data?.message || "Failed to update contact details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Contact</h1>
          <p className="text-gray-500">Update how people can reach out to you.</p>
        </div>
        <Button disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Primary Contact Info" />
          <CardContent className="space-y-4">
            <Input label="Email Address" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
            <Input label="Phone Number" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
            <Input label="WhatsApp Number" value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})} />
            <Textarea label="Physical Address" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} />
            <Input label="Google Maps Embed/Share Link" value={form.googleMapsLink} onChange={(e) => setForm({...form, googleMapsLink: e.target.value})} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Social Media Links" />
          <CardContent className="space-y-4">
            {Object.keys(form.socialLinks).map((key) => (
              <Input 
                key={key} 
                label={key.charAt(0).toUpperCase() + key.slice(1)} 
                value={form.socialLinks[key]} 
                onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })} 
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
