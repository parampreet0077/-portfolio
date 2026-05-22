import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { api, fileUrl } from "../api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Table, TableCell, TableRow, SortableTableRow } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { FileUpload } from "../components/ui/FileUpload";

export default function ManageCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const defaultForm = {
    certificateName: "", issuer: "", date: "", credentialLink: "", certificateImage: "", imageFile: null
  };
  const [form, setForm] = useState(defaultForm);

  const fetchCertifications = () => api.get("/certifications").then(res => setCertifications(res.data));
  useEffect(() => { fetchCertifications(); }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = certifications.findIndex((item) => item._id === active.id);
      const newIndex = certifications.findIndex((item) => item._id === over.id);
      
      const newOrder = arrayMove(certifications, oldIndex, newIndex);
      setCertifications(newOrder);
      
      const updatedItems = newOrder.map((item, index) => ({ id: item._id, order: index }));
      try {
        await api.put('/certifications/reorder', { items: updatedItems });
      } catch (err) {
        toast.error("Failed to save order");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => { if(k !== 'imageFile' && k !== 'certificateImage') fd.append(k, form[k])});
      if (form.imageFile) fd.append("image", form.imageFile);
      
      if (editingId) await api.put(`/certifications/${editingId}`, fd);
      else await api.post("/certifications", fd);
      
      toast.success("Certification saved!");
      setIsModalOpen(false);
      fetchCertifications();
    } catch (err) {
      toast.error("Error saving certification");
    }
  };

  const openEdit = (cert) => {
    setForm({ ...defaultForm, ...cert, imageFile: null });
    setEditingId(cert._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certification?")) return;
    try {
      await api.delete(`/certifications/${id}`);
      toast.success("Certification deleted");
      fetchCertifications();
    } catch {
      toast.error("Error deleting certification");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Certifications</h1>
          <p className="text-gray-500">Add or edit your certifications, courses, and programming languages.</p>
        </div>
        <Button onClick={() => { setForm(defaultForm); setEditingId(null); setIsModalOpen(true); }}><Plus size={18} /> Add Certification</Button>
      </div>

      <Card>
        <div className="p-0">
          <Table headers={["", "Certificate", "Issuer", "Date", "Actions"]}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={certifications.map(c => c._id)} strategy={verticalListSortingStrategy}>
                {certifications.map((cert) => (
                  <SortableTableRow key={cert._id} id={cert._id}>
                    <TableCell className="font-medium flex items-center gap-3">
                      {cert.certificateImage && (
                        <img src={fileUrl(cert.certificateImage)} alt="Cert" className="w-10 h-10 object-cover rounded-lg border bg-gray-50" />
                      )}
                      {cert.certificateName}
                    </TableCell>
                    <TableCell>{cert.issuer}</TableCell>
                    <TableCell>{cert.date}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <button onClick={() => openEdit(cert)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(cert._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </TableCell>
                  </SortableTableRow>
                ))}
              </SortableContext>
            </DndContext>
            {certifications.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No certifications added yet.</TableCell></TableRow>}
          </Table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Certification" : "Add New Certification"} maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Certification/Course Name" value={form.certificateName} onChange={(e) => setForm({...form, certificateName: e.target.value})} required />
          <Input label="Organization / Issuer" value={form.issuer} onChange={(e) => setForm({...form, issuer: e.target.value})} required />
          <Input label="Date (e.g. May 2026)" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required />
          <Input label="Credential Link (Optional)" value={form.credentialLink} onChange={(e) => setForm({...form, credentialLink: e.target.value})} />
          
          <FileUpload 
            label="Certificate Image/Document" 
            accept="image/*" 
            previewUrl={form.imageFile ? URL.createObjectURL(form.imageFile) : form.certificateImage ? fileUrl(form.certificateImage) : ""} 
            onFileSelect={f => setForm({...form, imageFile: f})} 
            onClear={() => { setForm({...form, imageFile: null, certificateImage: ""}) }} 
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Certification</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
