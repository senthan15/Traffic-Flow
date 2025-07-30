import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Activity, 
  Car, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Zap,
  TrendingUp,
  Users,
  Timer
} from "lucide-react";

// Mock data for demonstration
const mockIntersections = [
  { id: 1, name: "Main St & 1st Ave", status: "online", congestion: 45, vehicles: 23, signals: { red: 30, yellow: 5, green: 25 } },
  { id: 2, name: "Broadway & 2nd St", status: "online", congestion: 78, vehicles: 42, signals: { red: 45, yellow: 3, green: 22 } },
  { id: 3, name: "Oak Ave & 3rd St", status: "maintenance", congestion: 12, vehicles: 8, signals: { red: 60, yellow: 5, green: 15 } },
  { id: 4, name: "Pine St & 4th Ave", status: "online", congestion: 56, vehicles: 31, signals: { red: 35, yellow: 5, green: 30 } },
];

const Dashboard = () => {
  const [liveData, setLiveData] = useState(mockIntersections);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => prev.map(intersection => ({
        ...intersection,
        congestion: Math.max(0, Math.min(100, intersection.congestion + (Math.random() - 0.5) * 10)),
        vehicles: Math.max(0, intersection.vehicles + Math.floor((Math.random() - 0.5) * 6)),
      })));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-accent";
      case "maintenance": return "bg-warning";
      case "offline": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getCongestionColor = (level: number) => {
    if (level < 30) return "bg-accent";
    if (level < 70) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Traffic Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time traffic signal status and congestion monitoring</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 animate-pulse text-accent" />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Intersections</CardTitle>
            <MapPin className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {liveData.filter(i => i.status === "online").length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {liveData.length} total intersections
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {liveData.reduce((sum, i) => sum + i.vehicles, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently monitored
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Timer className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2.4s</div>
            <p className="text-xs text-muted-foreground">
              Signal adjustment latency
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">94.2%</div>
            <p className="text-xs text-muted-foreground">
              Traffic flow optimization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Intersection Status */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Live Intersection Status</span>
          </CardTitle>
          <CardDescription>
            Real-time monitoring of traffic signals and congestion levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {liveData.map((intersection) => (
              <div 
                key={intersection.id} 
                className="p-4 border border-border rounded-lg bg-card hover:shadow-elegant transition-all duration-300 animate-fade-in"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Intersection Info */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {intersection.status === "online" ? (
                        <CheckCircle className="h-6 w-6 text-accent" />
                      ) : intersection.status === "maintenance" ? (
                        <Clock className="h-6 w-6 text-warning" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-destructive" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{intersection.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className={getStatusColor(intersection.status)}>
                          {intersection.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {intersection.vehicles} vehicles
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Congestion Level */}
                  <div className="flex-1 max-w-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Congestion</span>
                      <span className="text-sm text-muted-foreground">{intersection.congestion}%</span>
                    </div>
                    <Progress 
                      value={intersection.congestion} 
                      className="h-2"
                    />
                  </div>

                  {/* Signal Timing */}
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className="text-muted-foreground">{intersection.signals.red}s</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <span className="text-muted-foreground">{intersection.signals.yellow}s</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-accent"></div>
                      <span className="text-muted-foreground">{intersection.signals.green}s</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;