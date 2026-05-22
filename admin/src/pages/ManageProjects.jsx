import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { api, fileUrl } from "../api";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { Table, TableCell, TableRow, SortableTableRow } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { FileUpload } from "../components/ui/FileUpload";

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [thumbFile, setThumbFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewThumb, setPreviewThumb] = useState("");

  const defaultForm = {
    title: "", shortDescription: "", fullDescription: "", githubLink: "", liveDemoLink: "",
    category: "Full Stack", status: "In Progress", featured: false,
    techStack: [], features: [], timeline: { startDate: "", endDate: "" },
    images: [] // Used only for keeping track of existing images from backend
  };
  const [form, setForm] = useState(defaultForm);
  const [techInput, setTechInput] = useState("");

  const fetchProjects = () => api.get("/projects").then(res => setProjects(res.data));
  useEffect(() => { fetchProjects(); }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setImageFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'techStack' || key === 'features' || key === 'timeline' || key === 'images') {
          formData.append(key, JSON.stringify(form[key]));
        } else {
          formData.append(key, form[key]);
        }
      });
      if (thumbFile) formData.append("thumbnail", thumbFile);
      imageFiles.forEach(f => formData.append("images", f));

      if (editingId) await api.put(`/projects/${editingId}`, formData);
      else await api.post("/projects", formData);
      
      toast.success("Project saved!");
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error("Error saving project");
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex((item) => item._id === active.id);
      const newIndex = projects.findIndex((item) => item._id === over.id);
      
      const newOrder = arrayMove(projects, oldIndex, newIndex);
      setProjects(newOrder);
      
      const updatedItems = newOrder.map((item, index) => ({ id: item._id, order: index }));
      try {
        await api.put('/projects/reorder', { items: updatedItems });
      } catch (err) {
        toast.error("Failed to save order");
      }
    }
  };

  const openEdit = (project) => {
    setForm({ ...defaultForm, ...project });
    setPreviewThumb(project.thumbnail ? fileUrl(project.thumbnail) : "");
    setThumbFile(null);
    setImageFiles([]);
    setEditingId(project._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      fetchProjects();
    } catch {
      toast.error("Error deleting project");
    }
  };

  const addTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!form.techStack.includes(techInput.trim())) setForm({...form, techStack: [...form.techStack, techInput.trim()]});
      setTechInput("");
    }
  };

  const addFeature = () => setForm({...form, features: [...form.features, { title: "", description: "" }]});
  const updateFeature = (i, field, val) => {
    const newF = [...form.features];
    newF[i][field] = val;
    setForm({...form, features: newF});
  };
  const removeFeature = (i) => setForm({...form, features: form.features.filter((_, idx) => idx !== i)});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Projects</h1>
          <p className="text-gray-500">Add or edit your portfolio projects.</p>
        </div>
        <Button onClick={() => { setForm(defaultForm); setPreviewThumb(""); setThumbFile(null); setImageFiles([]); setEditingId(null); setIsModalOpen(true); }}><Plus size={18} /> Add Project</Button>
      </div>

      <Card>
        <div className="p-0">
          <Table headers={["", "Thumbnail", "Title", "Category", "Status", "Featured", "Actions"]}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={projects.map(p => p._id)} strategy={verticalListSortingStrategy}>
                {projects.map((proj) => (
                  <SortableTableRow key={proj._id} id={proj._id}>
                    <TableCell><img src={fileUrl(proj.thumbnail)} alt="Thumb" className="w-12 h-12 object-cover rounded-lg border bg-gray-50" /></TableCell>
                    <TableCell className="font-medium text-gray-900">{proj.title}</TableCell>
                    <TableCell><span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">{proj.category}</span></TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${proj.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {proj.status}
                      </span>
                    </TableCell>
                    <TableCell>{proj.featured ? <span className="text-amber-500 font-bold">★ Yes</span> : "No"}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <button onClick={() => openEdit(proj)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(proj._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </TableCell>
                  </SortableTableRow>
                ))}
              </SortableContext>
            </DndContext>
            {projects.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No projects found.</TableCell></TableRow>}
          </Table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Project" : "Add New Project"} maxWidth="max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input label="Project Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                    {["Full Stack", "Frontend", "Backend", "Mobile App", "UI/UX"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
                    {["Completed", "In Progress", "Planned"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <Input label="Short Description" value={form.shortDescription} onChange={(e) => setForm({...form, shortDescription: e.target.value})} />
              <Textarea label="Full Description" value={form.fullDescription} onChange={(e) => setForm({...form, fullDescription: e.target.value})} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tech Stack (Press Enter to add)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.techStack.map(tech => (
                    <span key={tech} className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                      {tech} <X size={12} className="cursor-pointer" onClick={() => setForm({...form, techStack: form.techStack.filter(t => t !== tech)})} />
                    </span>
                  ))}
                </div>
                <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={addTech} placeholder="e.g. React" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="GitHub URL" value={form.githubLink} onChange={(e) => setForm({...form, githubLink: e.target.value})} />
                <Input label="Live Demo URL" value={form.liveDemoLink} onChange={(e) => setForm({...form, liveDemoLink: e.target.value})} />
              </div>
            </div>

            <div className="space-y-4">
              <FileUpload label="Thumbnail Image" accept="image/*" previewUrl={previewThumb} onFileSelect={(f) => { setThumbFile(f); setPreviewThumb(URL.createObjectURL(f)); }} onClear={() => { setThumbFile(null); setPreviewThumb(""); }} />
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Gallery Images (Multiple)</label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400 bg-white"}`}
                >
                  <input {...getInputProps()} />
                  <p className="text-sm text-gray-600">Drag & drop images here, or click to browse</p>
                </div>
                
                {imageFiles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {imageFiles.map((file, i) => (
                      <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                        {file.name}
                        <X size={12} className="cursor-pointer text-red-500" onClick={(e) => { e.stopPropagation(); setImageFiles(prev => prev.filter((_, idx) => idx !== i)); }} />
                      </span>
                    ))}
                  </div>
                )}
                {form.images.length > 0 && <p className="text-xs text-gray-500 mt-2">Currently has {form.images.length} saved images.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" type="date" value={form.timeline.startDate} onChange={(e) => setForm({...form, timeline: {...form.timeline, startDate: e.target.value}})} />
                <Input label="End Date" type="date" value={form.timeline.endDate} onChange={(e) => setForm({...form, timeline: {...form.timeline, endDate: e.target.value}})} />
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-4">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})} className="w-4 h-4 text-purple-600 rounded" />
                <span className="text-sm font-medium text-gray-800">Featured Project (Show on Homepage)</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800">Project Features</h4>
              <Button type="button" variant="secondary" onClick={addFeature} className="py-1 text-xs"><Plus size={14}/> Add Feature</Button>
            </div>
            <div className="space-y-3">
              {form.features.map((feat, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Input placeholder="Feature Title" value={feat.title} onChange={(e) => updateFeature(i, 'title', e.target.value)} className="w-1/3" />
                  <Input placeholder="Feature Description" value={feat.description} onChange={(e) => updateFeature(i, 'description', e.target.value)} className="w-2/3" />
                  <button type="button" onClick={() => removeFeature(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-1"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Project"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
