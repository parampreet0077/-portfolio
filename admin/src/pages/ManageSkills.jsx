import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { api } from "../api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Table, TableCell, TableRow, SortableTableRow } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";

const categories = ["Frontend", "Backend", "Database", "Tools", "Programming", "Education", "Soft Skills"];

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const defaultForm = {
    skillName: "", percentage: 0, category: "Frontend", icon: "", colorTheme: "#7c3aed", experienceLevel: "Beginner",
    educationData: { courseName: "", platform: "", completionPercentage: 0, duration: "", certificateLink: "", status: "" },
    programmingData: { projectsUsedIn: 0, githubLink: "", experienceYears: 0 }
  };
  const [form, setForm] = useState(defaultForm);

  const fetchSkills = () => api.get("/skills").then(res => setSkills(res.data));
  useEffect(() => { fetchSkills(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/skills/${editingId}`, form);
      else await api.post("/skills", form);
      toast.success("Skill saved!");
      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      toast.error("Error saving skill");
    }
  };

  const openEdit = (skill) => {
    setForm({ ...defaultForm, ...skill });
    setEditingId(skill._id);
    setIsModalOpen(true);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = skills.findIndex((item) => item._id === active.id);
      const newIndex = skills.findIndex((item) => item._id === over.id);
      
      const newOrder = arrayMove(skills, oldIndex, newIndex);
      setSkills(newOrder);
      
      const updatedItems = newOrder.map((item, index) => ({ id: item._id, order: index }));
      try {
        await api.put('/skills/reorder', { items: updatedItems });
      } catch (err) {
        toast.error("Failed to save order");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success("Skill deleted");
      fetchSkills();
    } catch {
      toast.error("Error deleting skill");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Skills</h1>
          <p className="text-gray-500">Add, edit, or remove your skills and education.</p>
        </div>
        <Button onClick={() => { setForm(defaultForm); setEditingId(null); setIsModalOpen(true); }}><Plus size={18} /> Add Skill</Button>
      </div>

      <Card>
        <div className="p-0">
          <Table headers={["", "Name", "Category", "Level", "Actions"]}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={skills.map(s => s._id)} strategy={verticalListSortingStrategy}>
                {skills.map((skill) => (
                  <SortableTableRow key={skill._id} id={skill._id}>
                    <TableCell className="font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: skill.colorTheme }}>{skill.skillName.charAt(0)}</div>
                      {skill.skillName}
                    </TableCell>
                    <TableCell><span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">{skill.category}</span></TableCell>
                    <TableCell>{skill.experienceLevel}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <button onClick={() => openEdit(skill)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(skill._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </TableCell>
                  </SortableTableRow>
                ))}
              </SortableContext>
            </DndContext>
            {skills.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No skills added yet.</TableCell></TableRow>}
          </Table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Skill" : "Add New Skill"} maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Skill Name" value={form.skillName} onChange={(e) => setForm({...form, skillName: e.target.value})} required />
            <Input label="Percentage" type="number" min="0" max="100" value={form.percentage} onChange={(e) => setForm({...form, percentage: e.target.value})} required={form.category !== "Education"} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level</label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20" value={form.experienceLevel} onChange={(e) => setForm({...form, experienceLevel: e.target.value})}>
                {["Beginner", "Intermediate", "Advanced", "Expert"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Icon Name (Lucide/FA)" value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} />
            <Input label="Color Theme" type="color" className="h-11" value={form.colorTheme} onChange={(e) => setForm({...form, colorTheme: e.target.value})} />
          </div>

          {form.category === "Education" && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-4 mt-4">
              <h4 className="font-semibold text-purple-800">Education Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Course Name" value={form.educationData.courseName} onChange={(e) => setForm({...form, educationData: {...form.educationData, courseName: e.target.value}})} />
                <Input label="Platform" value={form.educationData.platform} onChange={(e) => setForm({...form, educationData: {...form.educationData, platform: e.target.value}})} />
                <Input label="Duration" value={form.educationData.duration} onChange={(e) => setForm({...form, educationData: {...form.educationData, duration: e.target.value}})} />
                <Input label="Status" value={form.educationData.status} onChange={(e) => setForm({...form, educationData: {...form.educationData, status: e.target.value}})} />
              </div>
            </div>
          )}

          {form.category === "Programming" && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-4 mt-4">
              <h4 className="font-semibold text-blue-800">Programming Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Projects Used In" type="number" value={form.programmingData.projectsUsedIn} onChange={(e) => setForm({...form, programmingData: {...form.programmingData, projectsUsedIn: e.target.value}})} />
                <Input label="Experience Years" type="number" value={form.programmingData.experienceYears} onChange={(e) => setForm({...form, programmingData: {...form.programmingData, experienceYears: e.target.value}})} />
                <Input label="GitHub Link" value={form.programmingData.githubLink} onChange={(e) => setForm({...form, programmingData: {...form.programmingData, githubLink: e.target.value}})} />
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Skill</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
