"use client";

import useSWR from "swr";
import { IndianRupee } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { LineChart, Line, ResponsiveContainer } from "recharts";

const fakeData = [
  { value: 100 },
  { value: 200 },
  { value: 150 },
  { value: 300 },
  { value: 250 },
  { value: 400 },
  { value: 380 },
];

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import AdminSidebar from "./AdminSidebar";

// ✅ fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// ✅ Types
type Point = { date: string; total: number };
type PieSegment = { name: string; value: number };
type BarPoint = { item: string; sold: number };

export default function DashboardCharts() {
  const { data } = useSWR<{
    daily: Point[];
    status: PieSegment[];
    topItems: BarPoint[];
    totalRevenue: number;
  }>("/api/order/admin/dashboard-stats", fetcher);

  const totalRevenue = data?.totalRevenue ?? 0;

  const daily = data?.daily ?? [];
  const status = data?.status ?? [];
  const topItems = data?.topItems ?? [];
  const todayTotal = data?.totalRevenue ?? 0;

  const colors = ["#22C55E", "#F59E0B", "#EF4444", "#3B82F6"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <Card className="relative overflow-hidden shadow-lg">
          {/* Translucent Rupee Icon Background */}
          <div className="absolute right-4 top-4 text-green-100 opacity-20">
            <IndianRupee className="w-20 h-20" />
          </div>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent className="z-10">
            <div className="text-2xl font-bold">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last week
            </p>

            {/* 📈 Mini Background Sparkline Chart */}
            <div className="mt-2 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fakeData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* 📈 Daily Sales Line Chart */}
        <Card className="col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Daily Sales (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={daily} margin={{ top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 📊 Tabs for more insights */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 🥧 Pie Chart: Order Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={status}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label
                    >
                      {status.map((_, i) => (
                        <Cell key={i} fill={colors[i % colors.length]} />
                      ))}
                    </Pie>
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 📊 Bar Chart: Top Selling Items */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topItems} margin={{ left: -20 }}>
                    <XAxis dataKey="item" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sold" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Details Tab Placeholder */}
        <TabsContent value="details">
          <p className="text-muted-foreground">Detailed stats coming soon…</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
