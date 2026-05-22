import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MailOpen, Search, Trash2, CheckCircle } from "lucide-react";
import { api } from "../api";
import { Card, CardHeader } from "../components/ui/Card";
import { Table, TableCell, TableRow } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

export default function ViewMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = () => api.get("/messages").then(res => setMessages(res.data));
  useEffect(() => { fetchMessages(); }, []);

  const handleOpen = async (msg) => {
    setSelectedMsg(msg);
    if (msg.status === "unread") {
      try {
        await api.put(`/messages/${msg._id}/read`);
        fetchMessages();
      } catch (err) {}
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success("Message deleted");
      if (selectedMsg?._id === id) setSelectedMsg(null);
      fetchMessages();
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const filtered = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <p className="text-gray-500">Inbox for your portfolio contact form.</p>
        </div>
      </div>

      <Card>
        <CardHeader 
          title="Inbox" 
          action={
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-purple-500"
              />
            </div>
          } 
        />
        <div className="p-0">
          <Table headers={["Status", "Name", "Email", "Subject", "Date", "Actions"]}>
            {filtered.map((msg) => (
              <TableRow key={msg._id}>
                <TableCell>
                  {msg.status === 'unread' ? (
                    <span className="flex items-center gap-1 text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-full w-max"><div className="w-1.5 h-1.5 bg-red-500 rounded-full"/> New</span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 font-medium text-xs"><CheckCircle size={12}/> Read</span>
                  )}
                </TableCell>
                <TableCell className={`font-medium ${msg.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>{msg.name}</TableCell>
                <TableCell className="text-gray-500">{msg.email}</TableCell>
                <TableCell className={`truncate max-w-[200px] ${msg.status === 'unread' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{msg.subject || "(No Subject)"}</TableCell>
                <TableCell className="text-gray-500 text-xs">{new Date(msg.createdAt).toLocaleString()}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <button onClick={() => handleOpen(msg)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><MailOpen size={16}/></button>
                  <button onClick={() => handleDelete(msg._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No messages found.</TableCell></TableRow>}
          </Table>
        </div>
      </Card>

      <Modal isOpen={!!selectedMsg} onClose={() => setSelectedMsg(null)} title="Message Details">
        {selectedMsg && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">From</p>
                <p className="font-semibold text-gray-800">{selectedMsg.name}</p>
                <a href={`mailto:${selectedMsg.email}`} className="text-sm text-purple-600 hover:underline">{selectedMsg.email}</a>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Received</p>
                <p className="text-sm text-gray-600">{new Date(selectedMsg.createdAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Subject</p>
              <h3 className="font-bold text-lg text-gray-800">{selectedMsg.subject || "(No Subject)"}</h3>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap leading-relaxed">
              {selectedMsg.message}
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-gray-100">
              <Button variant="danger" onClick={() => handleDelete(selectedMsg._id)}><Trash2 size={16}/> Delete Message</Button>
              <Button onClick={() => setSelectedMsg(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
