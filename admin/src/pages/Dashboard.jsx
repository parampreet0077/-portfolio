import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MessageSquare, Plus, User, Zap } from "lucide-react";
import { api } from "../api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Table, TableCell, TableRow } from "../components/ui/Table";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0, unread: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/projects"),
      api.get("/skills"),
      api.get("/messages")
    ]).then(([projRes, skillRes, msgRes]) => {
      setStats({
        projects: projRes.data.length,
        skills: skillRes.data.length,
        messages: msgRes.data.length,
        unread: msgRes.data.filter(m => m.status === "unread").length
      });
      setRecentMessages(msgRes.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: "Total Projects", value: stats.projects, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Total Skills", value: stats.skills, icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Total Messages", value: stats.messages, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "Unread Messages", value: stats.unread, icon: MessageSquare, color: "text-red-500", bg: "bg-red-50" }
  ];

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-32 bg-gray-200 rounded-2xl"></div></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 py-8">
              <div className={`p-4 rounded-xl ${s.bg} ${s.color}`}>
                <s.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{s.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{s.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Recent Messages" action={<Link to="/messages" className="text-sm text-purple-600 hover:underline">View All</Link>} />
            <div className="p-0">
              <Table headers={["Name", "Subject", "Date", "Status"]}>
                {recentMessages.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">No messages found.</TableCell></TableRow>
                ) : (
                  recentMessages.map((msg) => (
                    <TableRow key={msg._id}>
                      <TableCell className="font-medium">{msg.name}</TableCell>
                      <TableCell className="text-gray-500 truncate max-w-[200px]">{msg.subject || "No Subject"}</TableCell>
                      <TableCell className="text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${msg.status === "unread" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                          {msg.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </Table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent className="space-y-3">
              <Link to="/projects">
                <Button className="w-full justify-start" variant="secondary"><Plus size={18} /> Add New Project</Button>
              </Link>
              <Link to="/skills">
                <Button className="w-full justify-start" variant="secondary"><Plus size={18} /> Add New Skill</Button>
              </Link>
              <Link to="/resume">
                <Button className="w-full justify-start" variant="secondary"><Plus size={18} /> Update Resume</Button>
              </Link>
              <Link to="/about">
                <Button className="w-full justify-start" variant="secondary"><User size={18} /> Edit Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
