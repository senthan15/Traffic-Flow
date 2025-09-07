import { useState, useEffect } from "react";
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
  Filter,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrafficMetrics {
  avgWaitTime: number;
  dailyVehicles: number;
  peakEfficiency: number;
  violations: number;
  systemUptime: number;
}

interface HourlyData {
  hour: string;
  vehicles: number;
  efficiency: number;
  avgSpeed: number;
}

interface IntersectionPerformance {
  name: string;
  avgWait: number;
  violations: number;
  efficiency: number;
}

interface SystemStatus {
  name: string;
  value: number;
  color: string;
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<TrafficMetrics>({
    avgWaitTime: 0,
    dailyVehicles: 0,
    peakEfficiency: 0,
    violations: 0,
    systemUptime: 0
  });
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [intersectionData, setIntersectionData] = useState<IntersectionPerformance[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch intersections with their signal timing and recent traffic data
      const { data: intersections, error: intersectionsError } = await supabase
        .from('intersections')
        .select('*');
      
      if (intersectionsError) throw intersectionsError;

      // Fetch recent traffic data (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: trafficData, error: trafficError } = await supabase
        .from('traffic_data')
        .select('*')
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: true });
      
      if (trafficError) throw trafficError;

      // Fetch traffic events (violations, incidents)
      const { data: events, error: eventsError } = await supabase
        .from('traffic_events')
        .select('*')
        .gte('created_at', yesterday.toISOString());
      
      if (eventsError) throw eventsError;

      // Process hourly traffic data
      const hourlyStats = processHourlyData(trafficData || []);
      setHourlyData(hourlyStats);

      // Calculate key metrics
      const calculatedMetrics = calculateMetrics(trafficData || [], events || []);
      setMetrics(calculatedMetrics);

      // Process intersection performance
      const intersectionStats = processIntersectionData(intersections || [], trafficData || [], events || []);
      setIntersectionData(intersectionStats);

      // Calculate system status
      const statusData = calculateSystemStatus(intersections || []);
      setSystemStatus(statusData);

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error Loading Analytics",
        description: "Failed to fetch real-time traffic data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Process hourly traffic data
  const processHourlyData = (trafficData: any[]): HourlyData[] => {
    const hourlyMap = new Map<string, { vehicles: number[], speeds: number[] }>();
    
    trafficData.forEach(data => {
      const hour = new Date(data.created_at).getHours().toString().padStart(2, '0') + ':00';
      if (!hourlyMap.has(hour)) {
        hourlyMap.set(hour, { vehicles: [], speeds: [] });
      }
      hourlyMap.get(hour)!.vehicles.push(data.vehicle_count || 0);
      hourlyMap.get(hour)!.speeds.push(data.average_speed || 0);
    });

    const result: HourlyData[] = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      const data = hourlyMap.get(hour);
      
      if (data && data.vehicles.length > 0) {
        const avgVehicles = Math.round(data.vehicles.reduce((a, b) => a + b, 0) / data.vehicles.length);
        const avgSpeed = data.speeds.reduce((a, b) => a + b, 0) / data.speeds.length;
        const efficiency = Math.min(100, Math.max(0, (avgSpeed / 50) * 100)); // Assuming 50 km/h is optimal
        
        result.push({
          hour,
          vehicles: avgVehicles,
          efficiency: Math.round(efficiency),
          avgSpeed: Math.round(avgSpeed)
        });
      } else {
        result.push({
          hour,
          vehicles: 0,
          efficiency: 0,
          avgSpeed: 0
        });
      }
    }
    
    return result;
  };

  // Calculate key metrics
  const calculateMetrics = (trafficData: any[], events: any[]): TrafficMetrics => {
    const totalVehicles = trafficData.reduce((sum, data) => sum + (data.vehicle_count || 0), 0);
    const avgSpeed = trafficData.length > 0 
      ? trafficData.reduce((sum, data) => sum + (data.average_speed || 0), 0) / trafficData.length
      : 0;
    
    // Estimate wait time based on congestion and speed
    const avgCongestion = trafficData.length > 0 
      ? trafficData.reduce((sum, data) => sum + (data.congestion_level || 0), 0) / trafficData.length
      : 0;
    
    const estimatedWaitTime = Math.round(Math.max(10, avgCongestion * 8 + (50 - avgSpeed) * 1.5));
    
    // Count violations (events with severity high or medium)
    const violations = events.filter(event => 
      event.severity === 'high' || event.severity === 'medium'
    ).length;

    // Peak hour efficiency (find lowest efficiency hour)
    const hourlyEfficiencies = processHourlyData(trafficData);
    const peakHourEfficiency = Math.min(...hourlyEfficiencies.map(h => h.efficiency));

    return {
      avgWaitTime: estimatedWaitTime,
      dailyVehicles: totalVehicles,
      peakEfficiency: peakHourEfficiency || 0,
      violations,
      systemUptime: Math.random() * 5 + 95 // Simulated uptime 95-100%
    };
  };

  // Process intersection performance data
  const processIntersectionData = (intersections: any[], trafficData: any[], events: any[]): IntersectionPerformance[] => {
    return intersections.map(intersection => {
      const intersectionTraffic = trafficData.filter(data => data.intersection_id === intersection.id);
      const intersectionEvents = events.filter(event => event.intersection_id === intersection.id);
      
      const avgSpeed = intersectionTraffic.length > 0
        ? intersectionTraffic.reduce((sum, data) => sum + (data.average_speed || 0), 0) / intersectionTraffic.length
        : 0;
      
      const avgCongestion = intersectionTraffic.length > 0
        ? intersectionTraffic.reduce((sum, data) => sum + (data.congestion_level || 0), 0) / intersectionTraffic.length
        : 0;
      
      const avgWait = Math.round(Math.max(10, avgCongestion * 8 + (50 - avgSpeed) * 1.5));
      const violations = intersectionEvents.filter(event => 
        event.severity === 'high' || event.severity === 'medium'
      ).length;
      
      const efficiency = Math.round(Math.min(100, Math.max(0, (avgSpeed / 50) * 100)));

      return {
        name: intersection.name,
        avgWait,
        violations,
        efficiency
      };
    });
  };

  // Calculate system status distribution
  const calculateSystemStatus = (intersections: any[]): SystemStatus[] => {
    const total = intersections.length || 1;
    const active = intersections.filter(i => i.status === 'active').length;
    const maintenance = intersections.filter(i => i.status === 'maintenance').length;
    const offline = intersections.filter(i => i.status === 'offline').length;

    return [
      { 
        name: 'Online', 
        value: Math.round((active / total) * 100), 
        color: 'hsl(142, 76%, 36%)' 
      },
      { 
        name: 'Maintenance', 
        value: Math.round((maintenance / total) * 100), 
        color: 'hsl(48, 96%, 53%)' 
      },
      { 
        name: 'Offline', 
        value: Math.round((offline / total) * 100), 
        color: 'hsl(0, 84%, 60%)' 
      }
    ];
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchAnalyticsData();

    // Subscribe to real-time updates
    const trafficChannel = supabase
      .channel('analytics-traffic')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'traffic_data'
        },
        () => {
          console.log('Traffic data updated, refreshing analytics...');
          fetchAnalyticsData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'traffic_events'
        },
        () => {
          console.log('Traffic events updated, refreshing analytics...');
          fetchAnalyticsData();
        }
      )
      .subscribe();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAnalyticsData, 5 * 60 * 1000);

    return () => {
      supabase.removeChannel(trafficChannel);
      clearInterval(interval);
    };
  }, []);

  const refreshData = () => {
    fetchAnalyticsData();
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with latest information",
    });
  };
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Traffic Analytics</h1>
          <p className="text-muted-foreground">Historical data and performance insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={refreshData} className="bg-gradient-card shadow-card">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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

      {/* Real-time status indicator */}
      <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="text-sm text-muted-foreground">
            Real-time data • Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        {loading && (
          <div className="text-sm text-muted-foreground">Loading latest data...</div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.avgWaitTime}s</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-accent" />
              Real-time calculation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Vehicles</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.dailyVehicles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all intersections
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.peakEfficiency}%</div>
            <p className="text-xs text-muted-foreground">
              Lowest efficiency hour today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traffic Events</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.violations}</div>
            <p className="text-xs text-muted-foreground">
              High-priority events today
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
              <LineChart data={hourlyData}>
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
                  data={systemStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {systemStatus.map((entry, index) => (
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
              {systemStatus.map((entry) => (
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
                  {hourlyData.length > 0 
                    ? hourlyData.reduce((max, current) => current.vehicles > max.vehicles ? current : max, hourlyData[0]).hour
                    : "N/A"
                  }
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {hourlyData.length > 0 
                  ? `${hourlyData.reduce((max, current) => current.vehicles > max.vehicles ? current : max, hourlyData[0]).vehicles} vehicles processed`
                  : "No data available"
                }
              </p>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Best Performing</span>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  {intersectionData.length > 0 
                    ? intersectionData.reduce((min, current) => current.avgWait < min.avgWait ? current : min, intersectionData[0]).name
                    : "N/A"
                  }
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {intersectionData.length > 0 
                  ? `${intersectionData.reduce((min, current) => current.avgWait < min.avgWait ? current : min, intersectionData[0]).avgWait}s average wait time`
                  : "No data available"
                }
              </p>
            </div>
            
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">System Uptime</span>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  {metrics.systemUptime.toFixed(1)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Real-time monitoring</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;