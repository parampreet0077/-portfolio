import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { api, fileUrl } from "../api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { FileUpload } from "../components/ui/FileUpload";

const emptySocialLinks = { github: "", linkedin: "", instagram: "", portfolio: "" };
const normalizeAbout = (data = {}) => ({
  fullName: data.fullName || "",
  title: data.title || "",
  shortBio: data.shortBio || "",
  longDescription: data.longDescription || "",
  experienceYears: data.experienceYears || 0,
  location: data.location || "",
  email: data.email || "",
  phone: data.phone || "",
  resumeIntro: data.resumeIntro || "",
  socialLinks: { ...emptySocialLinks, ...(data.socialLinks || {}) },
  achievements: data.achievements || []
});

export default function ManageAbout() {
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [previewProfile, setPreviewProfile] = useState("");
  const [previewCover, setPreviewCover] = useState("");

  const [form, setForm] = useState({
    fullName: "", title: "", shortBio: "", longDescription: "",
    experienceYears: 0, location: "", email: "", phone: "", resumeIntro: "",
    socialLinks: emptySocialLinks,
    achievements: []
  });

  useEffect(() => {
    api.get("/about").then(({ data }) => {
      if (data && Object.keys(data).length > 0) {
        setForm(normalizeAbout(data));
        if (data.profileImage) setPreviewProfile(fileUrl(data.profileImage));
        if (data.coverImage) setPreviewCover(fileUrl(data.coverImage));
      }
    }).catch((err) => {
      console.error("Failed to load about data", err);
      toast.error("Could not load saved about data.");
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'socialLinks' || key === 'achievements') {
          formData.append(key, JSON.stringify(form[key]));
        } else {
          formData.append(key, form[key]);
        }
      });
      if (profileImageFile) formData.append("profileImage", profileImageFile);
      if (coverImageFile) formData.append("coverImage", coverImageFile);

      const { data } = await api.post("/about", formData);
      setForm(normalizeAbout(data));
      if (data.profileImage) setPreviewProfile(fileUrl(data.profileImage));
      if (data.coverImage) setPreviewCover(fileUrl(data.coverImage));
      setProfileImageFile(null);
      setCoverImageFile(null);
      toast.success("About section updated!");
    } catch (err) {
      console.error("Failed to save about data", err);
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const addAchievement = () => {
    setForm({ ...form, achievements: [...form.achievements, { title: "", number: "", icon: "", description: "" }] });
  };

  const updateAchievement = (index, field, value) => {
    const newAch = [...form.achievements];
    newAch[index][field] = value;
    setForm({ ...form, achievements: newAch });
  };

  const removeAchievement = (index) => {
    setForm({ ...form, achievements: form.achievements.filter((_, i) => i !== index) });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage About</h1>
          <p className="text-gray-500">Update your personal information and portfolio details.</p>
        </div>
        <Button disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Basic Information" />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} required />
                <Input label="Professional Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                <Input label="Experience (Years)" type="number" value={form.experienceYears} onChange={(e) => setForm({...form, experienceYears: e.target.value})} />
                <Input label="Location" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} />
              </div>
              <Input label="Short Bio" value={form.shortBio} onChange={(e) => setForm({...form, shortBio: e.target.value})} />
              <Textarea label="Long Description" value={form.longDescription} onChange={(e) => setForm({...form, longDescription: e.target.value})} />
              <Input label="Resume Intro Text" value={form.resumeIntro} onChange={(e) => setForm({...form, resumeIntro: e.target.value})} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Achievements" action={<Button type="button" variant="secondary" onClick={addAchievement} className="text-xs py-1"><Plus size={14}/> Add Item</Button>} />
            <CardContent className="space-y-4">
              {form.achievements.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No achievements added yet.</p>}
              {form.achievements.map((ach, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input placeholder="Title (e.g. Clients)" value={ach.title} onChange={(e) => updateAchievement(i, 'title', e.target.value)} />
                    <Input placeholder="Number (e.g. 50+)" value={ach.number} onChange={(e) => updateAchievement(i, 'number', e.target.value)} />
                    <Input placeholder="Icon name (e.g. users)" value={ach.icon} onChange={(e) => updateAchievement(i, 'icon', e.target.value)} />
                    <Input placeholder="Description" value={ach.description} onChange={(e) => updateAchievement(i, 'description', e.target.value)} />
                  </div>
                  <button type="button" onClick={() => removeAchievement(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Images" />
            <CardContent className="space-y-6">
              <FileUpload label="Cover Image" accept="image/*" previewUrl={previewCover} onFileSelect={(f) => { setCoverImageFile(f); setPreviewCover(URL.createObjectURL(f)); }} onClear={() => { setCoverImageFile(null); setPreviewCover(""); }} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Social Links" />
            <CardContent className="space-y-4">
              {Object.keys(form.socialLinks).map((key) => (
                <Input key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={form.socialLinks[key]} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
