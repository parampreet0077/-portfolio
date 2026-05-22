import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Download, Edit2, FileText, Plus, Trash2 } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { api, fileUrl } from "../api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { FileUpload } from "../components/ui/FileUpload";
import { Table, TableCell, TableRow, SortableTableRow } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";

export default function ManageResume() {
  const [resume, setResume] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  
  const [activeTab, setActiveTab] = useState("education");
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const fetchData = () => {
    api.get("/resume").then(res => setResume(res.data)).catch(() => setResume(null));
    api.get("/education").then(res => setEducation(res.data));
    api.get("/experience").then(res => setExperience(res.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handlePdfUpload = async () => {
    if (!pdfFile) return toast.error("Please select a PDF file");
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    try {
      await api.post("/resume", formData);
      toast.success("Resume uploaded successfully");
      setPdfFile(null);
      fetchData();
    } catch {
      toast.error("Failed to upload PDF");
    }
  };

  const handlePdfDelete = async () => {
    if (!window.confirm("Delete current resume PDF?")) return;
    try {
      await api.delete("/resume");
      toast.success("Resume deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete PDF");
    }
  };

  const openEdit = (item, type) => {
    setForm(item || {});
    setEditingId(item?._id || null);
    setIsModalOpen(true);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const list = activeTab === "education" ? education : experience;
      const setList = activeTab === "education" ? setEducation : setExperience;
      
      const oldIndex = list.findIndex((item) => item._id === active.id);
      const newIndex = list.findIndex((item) => item._id === over.id);
      
      const newOrder = arrayMove(list, oldIndex, newIndex);
      setList(newOrder);
      
      const updatedItems = newOrder.map((item, index) => ({ id: item._id, order: index }));
      try {
        await api.put(`/${activeTab}/reorder`, { items: updatedItems });
      } catch (err) {
        toast.error("Failed to save order");
      }
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const endpoint = `/${activeTab}`;
    try {
      const data = { ...form };
      if (editingId) await api.put(`${endpoint}/${editingId}`, data);
      else await api.post(endpoint, data);
      toast.success("Saved successfully");
      setIsModalOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await api.delete(`/${activeTab}/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manage Resume</h1>
        <p className="text-gray-500">Manage your PDF resume and dynamic resume builder sections.</p>
      </div>

      <Card>
        <CardHeader title="PDF Resume Document" />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {resume?.pdfFile ? (
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
                <FileText size={48} className="text-purple-500 mb-3" />
                <h4 className="font-semibold text-gray-800">Current Resume Active</h4>
                <p className="text-sm text-gray-500 mb-4">Uploaded: {new Date(resume.uploadDate).toLocaleDateString()}</p>
                <div className="flex gap-3">
                  <a href={fileUrl(resume.pdfFile)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                    <Download size={16} /> View/Download
                  </a>
                  <Button variant="danger" onClick={handlePdfDelete}><Trash2 size={16}/></Button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                <p>No resume uploaded.</p>
              </div>
            )}
          </div>
          <div>
            <FileUpload label="Upload New PDF" accept=".pdf" previewUrl={pdfFile ? "dummy.pdf" : ""} onFileSelect={setPdfFile} onClear={() => setPdfFile(null)} helperText="Only PDF files allowed." />
            {pdfFile && <Button onClick={handlePdfUpload} className="w-full mt-4">Upload Selected PDF</Button>}
          </div>
        </CardContent>
      </Card>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {["education", "experience"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-700 capitalize">{activeTab} Details</h3>
          <Button onClick={() => openEdit(null)}><Plus size={16} /> Add {activeTab.slice(0,-1)}</Button>
        </div>
        <div className="p-0">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {activeTab === "education" && (
              <Table headers={["", "Degree", "Institution", "Year", "Actions"]}>
                <SortableContext items={education.map(i => i._id)} strategy={verticalListSortingStrategy}>
                  {education.map(item => (
                    <SortableTableRow key={item._id} id={item._id}>
                      <TableCell className="font-medium">{item.degree}</TableCell>
                      <TableCell>{item.institution}</TableCell>
                      <TableCell>{item.startYear} - {item.endYear}</TableCell>
                      <TableCell className="flex gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                        <button onClick={() => handleDeleteItem(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </TableCell>
                    </SortableTableRow>
                  ))}
                </SortableContext>
              </Table>
            )}

            {activeTab === "experience" && (
              <Table headers={["", "Role", "Company", "Duration", "Actions"]}>
                <SortableContext items={experience.map(i => i._id)} strategy={verticalListSortingStrategy}>
                  {experience.map(item => (
                    <SortableTableRow key={item._id} id={item._id}>
                      <TableCell className="font-medium">{item.role}</TableCell>
                      <TableCell>{item.companyName}</TableCell>
                      <TableCell>{item.duration}</TableCell>
                      <TableCell className="flex gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                        <button onClick={() => handleDeleteItem(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </TableCell>
                    </SortableTableRow>
                  ))}
                </SortableContext>
              </Table>
            )}
          </DndContext>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Manage ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}>
        <form onSubmit={handleSaveItem} className="space-y-4">
          {activeTab === "education" && (
            <>
              <Input label="Degree / Course" value={form.degree||""} onChange={e=>setForm({...form, degree: e.target.value})} required />
              <Input label="Institution" value={form.institution||""} onChange={e=>setForm({...form, institution: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Year" value={form.startYear||""} onChange={e=>setForm({...form, startYear: e.target.value})} required />
                <Input label="End Year" value={form.endYear||""} onChange={e=>setForm({...form, endYear: e.target.value})} />
              </div>
              <Input label="Percentage / CGPA" value={form.percentage||""} onChange={e=>setForm({...form, percentage: e.target.value})} />
              <Textarea label="Description" value={form.description||""} onChange={e=>setForm({...form, description: e.target.value})} />
            </>
          )}

          {activeTab === "experience" && (
            <>
              <Input label="Role / Title" value={form.role||""} onChange={e=>setForm({...form, role: e.target.value})} required />
              <Input label="Company Name" value={form.companyName||""} onChange={e=>setForm({...form, companyName: e.target.value})} required />
              <Input label="Duration (e.g. Jan 2020 - Present)" value={form.duration||""} onChange={e=>setForm({...form, duration: e.target.value})} required />
              <Input label="Technologies Used (Comma separated)" value={form.technologiesUsed ? (Array.isArray(form.technologiesUsed) ? form.technologiesUsed.join(", ") : form.technologiesUsed) : ""} onChange={e=>setForm({...form, technologiesUsed: e.target.value.split(",").map(t=>t.trim())})} />
              <Textarea label="Responsibilities" value={form.responsibilities||""} onChange={e=>setForm({...form, responsibilities: e.target.value})} />
            </>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Entry</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
