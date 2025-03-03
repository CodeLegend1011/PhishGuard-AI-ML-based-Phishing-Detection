"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, ShieldAlert, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import Sidebar from "../../components/ui/sidebar";

const data = {
  health: "poor",
  actions: [
    { name: "SMS", value: 25, color: "#4ade80" },
    { name: "Email", value: 5, color: "#fb923c" },
    { name: "URL's", value: 10, color: "#60a5fa" },
  ],
  totalActions: [
    { name: "High", value: 20, color: "#dc2626" },
    { name: "Medium", value: 57, color: "#f97316" },
    { name: "Low", value: 11, color: "#4ade80" }
  ],
  traffic: [
    { date: "Apr 18", incoming: 3, outgoing: 0 },
    { date: "Apr 21", incoming: 5, outgoing: 0 },
    { date: "Apr 24", incoming: 4, outgoing: 0 },
    { date: "Apr 30", incoming: 6, outgoing: 3 },
    { date: "May 03", incoming: 3, outgoing: 2 },
    { date: "May 06", incoming: 5, outgoing: 0 },
  ],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 border border-gray-700 rounded">
        <p className="font-bold">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color || entry.fill }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const totalActionsSum = data.totalActions.reduce((sum, item) => sum + item.value, 0);

  // Calculate health score
  const calculateHealthScore = () => {
    const highPriorityWeight = 0.6;
    const mediumPriorityWeight = 0.3;
    const lowPriorityWeight = 0.1;

    const highRatio = data.totalActions[0].value / totalActionsSum;
    const mediumRatio = data.totalActions[1].value / totalActionsSum;
    const lowRatio = data.totalActions[2].value / totalActionsSum;

    const healthScore = 100 - (
      (highRatio * highPriorityWeight * 100) +
      (mediumRatio * mediumPriorityWeight * 100) +
      (lowRatio * lowPriorityWeight * 100)
    );

    return Math.max(0, Math.min(100, Math.round(healthScore)));
  };

  const healthScore = calculateHealthScore();
  let healthStatus = "Poor";
  let healthColor = "text-red-500";

  if (healthScore > 75) {
    healthStatus = "Good";
    healthColor = "text-green-500";
  } else if (healthScore > 50) {
    healthStatus = "Fair";
    healthColor = "text-yellow-500";
  } else if (healthScore > 25) {
    healthStatus = "Concerning";
    healthColor = "text-orange-500";
  }

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/check_messages");
        if (!response.ok) {
          throw new Error("Failed to fetch messages.");
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const spamCount = messages.filter((msg) => msg.is_phishing).length;
  const safeCount = messages.length - spamCount;
  const messageData = [
    { name: "Spam", value: spamCount, color: "#FF0000" },
    { name: "Safe", value: safeCount, color: "#39FF14" },
  ];

  const spamPercentage = (spamCount / messages.length) * 100;

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Company Dashboard</h1>
            <p className="text-gray-400">Overview of your company's security status</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <Badge variant="outline" className="bg-gray-800 text-white border-gray-700">
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Health Report</CardTitle>
              <CardDescription>Company security health status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`text-2xl font-bold ${healthColor}`}>{healthStatus.toUpperCase()}</div>
                <Progress value={healthScore} className="h-2 bg-gray-700"
                  indicatorclassname={healthScore > 75 ? "bg-green-500" :
                    healthScore > 50 ? "bg-yellow-500" :
                      healthScore > 25 ? "bg-orange-500" : "bg-red-500"}
                />
                <div className="flex justify-between text-sm text-white">
                  <span>0</span>
                  <span>Health Score: {healthScore}</span>
                  <span>100</span>
                </div>
                <p className="text-sm text-gray-400">
                  {healthScore < 50 ?
                    "Improve outstanding actions to enhance your company health." :
                    "Your company health is on the right track. Keep monitoring for new threats."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Attacks Breakdown</CardTitle>
              <CardDescription>Phishing attacks by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.actions} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: "white" }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "white" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value">
                    {data.actions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>


          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Message Analysis</CardTitle>
              <CardDescription>Spam vs Safe Messages</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && <p>Loading messages...</p>}
              {error && <p className="text-red-500">{error}</p>}

              <div className="flex justify-between items-center h-48">
                <ResponsiveContainer width="60%" height="100%">
                  <PieChart>
                    <Pie
                      data={messageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {messageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-1/3">
                  {messageData.map((entry, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                      <div className="text-sm text-white">{entry.name}: {entry.value}</div>
                    </div>
                  ))}
                  <div className="mt-2 text-sm text-white">Total: {messages.length}</div>
                  <div className="mt-2 text-sm text-white">Spam Percentage: {spamPercentage.toFixed(2)}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Email Phishing</CardTitle>
              <CardDescription>Safe vs Phishing Emails</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.traffic} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="date" tick={{ fill: "white" }} />
                  <YAxis tick={{ fill: "white" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "white" }} />
                  <Bar name="Safe" dataKey="incoming" fill="#60a5fa" />
                  <Bar name="Attacks" dataKey="outgoing" fill="#f43f5e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Scan Controls</CardTitle>
              <CardDescription>Detect whether phishing attack is taking place or not</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 transition-colors"
                  onClick={() => window.location.href = '/pages/detection'}
                >
                  <Activity className="mr-2 h-4 w-4" /> Start SMS Detection
                </Button>

                <Button
                  className="w-full bg-red-600 hover:bg-red-700 transition-colors"
                  onClick={() => window.location.href = '/pages/detection'}
                >
                  <ShieldAlert className="mr-2 h-4 w-4" /> Start URL Detection
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-600 hover:bg-gray-700 transition-colors"
                  onClick={() => window.location.href = '/pages/detection'}
                >
                  <BookOpen className="mr-2 h-4 w-4" /> Start Email Detection
                </Button>
              </div>

              <div className="text-sm text-gray-400 pt-2 border-t border-gray-700">
                * Discovery scans assess the amount of phishing attacks a day
                <br />
                * Threat scans identify potential phishing attacks
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
