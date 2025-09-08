import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Activity, 
  Download,
  Calendar,
  Filter
} from "lucide-react";

// Mock data for charts
const hourlyTraffic = [
  { hour: '06:00', vehicles: 45, efficiency: 85 },
  { hour: '07:00', vehicles: 89, efficiency: 78 },
  { hour: '08:00', vehicles: 156, efficiency: 65 },
  { hour: '09:00', vehicles: 134, efficiency: 72 },
  { hour: '10:00', vehicles: 98, efficiency: 88 },
  { hour: '11:00', vehicles: 87, efficiency: 91 },
  { hour: '12:00', vehicles: 124, efficiency: 76 },
  { hour: '13:00', vehicles: 142, efficiency: 71 },
  { hour: '14:00', vehicles: 167, efficiency: 68 },
  { hour: '15:00', vehicles: 189, efficiency: 62 },
  { hour: '16:00', vehicles: 234, efficiency: 58 },
  { hour: '17:00', vehicles: 289, efficiency: 54 },
  { hour: '18:00', vehicles: 267, efficiency: 59 },
  { hour: '19:00', vehicles: 198, efficiency: 67 },
  { hour: '20:00', vehicles: 156, efficiency: 76 },
  { hour: '21:00', vehicles: 98, efficiency: 89 },
];

const intersectionData = [
  { name: 'Main St & 1st Ave', avgWait: 45, violations: 2 },
  { name: 'Broadway & 2nd St', avgWait: 67, violations: 5 },
  { name: 'Oak Ave & 3rd St', avgWait: 28, violations: 1 },
  { name: 'Pine St & 4th Ave', avgWait: 52, violations: 3 },
];

const signalStatusData = [
  { name: 'Online', value: 85, color: 'hsl(142, 76%, 36%)' },
  { name: 'Maintenance', value: 12, color: 'hsl(48, 96%, 53%)' },
  { name: 'Offline', value: 3, color: 'hsl(0, 84%, 60%)' },
];

const Analytics = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Traffic Analytics</h1>
          <p className="text-muted-foreground">Historical data and performance insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-gradient-card shadow-card">
            <Filter className="h-4 w-4 mr-2" />
            Filter Data
          </Button>
          <Button variant="outline" className="bg-gradient-card shadow-card">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-gradient-primary shadow-elegant">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">48s</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-accent" />
              12% improvement this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Vehicles</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2,847</div>
            <p className="text-xs text-muted-foreground">
              Average across all intersections
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">54%</div>
            <p className="text-xs text-muted-foreground">
              5:00-6:00 PM rush hour
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traffic Violations</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">11</div>
            <p className="text-xs text-muted-foreground">
              Red light violations today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Volume Chart */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Hourly Traffic Volume</CardTitle>
            <CardDescription>Vehicle count and efficiency throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyTraffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hour" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="vehicles" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Vehicles"
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Efficiency %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Status Pie Chart */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>System Status Distribution</CardTitle>
            <CardDescription>Current status of all traffic signals</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={signalStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {signalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {signalStatusData.map((entry) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intersection Performance */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Intersection Performance</CardTitle>
          <CardDescription>Average wait times and violation counts by intersection</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={intersectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="avgWait" 
                fill="hsl(var(--primary))" 
                name="Avg Wait Time (s)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Today's Performance Summary</CardTitle>
          <CardDescription>Key metrics and insights from today's traffic data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Peak Traffic Hour</span>
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  5:00-6:00 PM
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">289 vehicles processed</p>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Best Performing</span>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  Oak Ave & 3rd St
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">28s average wait time</p>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">System Uptime</span>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  99.2%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">2 minutes downtime</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;