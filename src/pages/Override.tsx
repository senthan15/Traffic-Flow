import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Siren, 
  Car, 
  Zap,
  Play,
  Square,
  RotateCcw,
  CheckCircle,
  XCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const emergencyScenarios = [
  {
    id: 1,
    type: "Emergency Vehicle",
    icon: Siren,
    description: "Clear path for ambulance, fire truck, or police",
    color: "bg-destructive",
    action: "Create Emergency Corridor"
  },
  {
    id: 2,
    type: "Traffic Accident",
    icon: Car,
    description: "Manage traffic flow around accident site",
    color: "bg-warning",
    action: "Reroute Traffic"
  },
  {
    id: 3,
    type: "System Failure",
    icon: AlertTriangle,
    description: "Manual control during system malfunction",
    color: "bg-destructive",
    action: "Enable Manual Mode"
  },
  {
    id: 4,
    type: "Special Event",
    icon: MapPin,
    description: "Adjust signals for parades, construction, etc.",
    color: "bg-primary",
    action: "Custom Configuration"
  }
];

const activeOverrides = [
  {
    id: 1,
    intersection: "Main St & 1st Ave",
    type: "Emergency Vehicle",
    startTime: "14:23",
    duration: "00:05:23",
    status: "active"
  },
  {
    id: 2,
    intersection: "Broadway & 2nd St",
    type: "Traffic Accident",
    startTime: "13:45",
    duration: "00:38:12",
    status: "active"
  }
];

const intersectionsList = [
  "Main St & 1st Ave",
  "Broadway & 2nd St", 
  "Oak Ave & 3rd St",
  "Pine St & 4th Ave"
];

const Override = () => {
  const [selectedIntersection, setSelectedIntersection] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [overrides, setOverrides] = useState(activeOverrides);
  const { toast } = useToast();

  const initiateOverride = () => {
    if (!selectedIntersection || selectedScenario === null || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an intersection, scenario, and provide a reason.",
        variant: "destructive"
      });
      return;
    }

    const scenario = emergencyScenarios.find(s => s.id === selectedScenario);
    const newOverride = {
      id: overrides.length + 1,
      intersection: selectedIntersection,
      type: scenario?.type || "",
      startTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      duration: "00:00:00",
      status: "active" as const
    };

    setOverrides([...overrides, newOverride]);
    setSelectedIntersection("");
    setSelectedScenario(null);
    setReason("");

    toast({
      title: "Override Activated",
      description: `${scenario?.type} protocol activated for ${selectedIntersection}`,
    });
  };

  const terminateOverride = (id: number) => {
    setOverrides(overrides.filter(override => override.id !== id));
    toast({
      title: "Override Terminated",
      description: "Traffic signals returned to normal operation",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manual Override</h1>
          <p className="text-muted-foreground">Emergency controls and manual signal management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-card text-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {overrides.length} Active Override{overrides.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Active Overrides */}
      {overrides.length > 0 && (
        <Card className="bg-gradient-card shadow-card border-0 border-l-4 border-l-destructive">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>Active Emergency Overrides</span>
            </CardTitle>
            <CardDescription>Currently active manual interventions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overrides.map((override) => (
                <div key={override.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-destructive animate-pulse"></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{override.intersection}</h4>
                      <p className="text-sm text-muted-foreground">{override.type}</p>
                    </div>
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                      Duration: {override.duration}
                    </Badge>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                        <Square className="h-4 w-4 mr-2" />
                        Terminate
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Terminate Override?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will end the emergency override for {override.intersection} and return the intersection to normal operation.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => terminateOverride(override.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Terminate Override
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Scenarios */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Siren className="h-5 w-5 text-primary" />
              <span>Emergency Scenarios</span>
            </CardTitle>
            <CardDescription>Select the type of emergency override needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyScenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <div
                  key={scenario.id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-card ${
                    selectedScenario === scenario.id
                      ? "border-primary bg-primary/10 shadow-elegant"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${scenario.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{scenario.type}</h3>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    </div>
                    {selectedScenario === scenario.id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Override Configuration */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Override Configuration</span>
            </CardTitle>
            <CardDescription>Configure and initiate manual override</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Intersection Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select Intersection</label>
              <div className="grid grid-cols-1 gap-2">
                {intersectionsList.map((intersection) => (
                  <div
                    key={intersection}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-card ${
                      selectedIntersection === intersection
                        ? "border-primary bg-primary/10 shadow-elegant"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedIntersection(intersection)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{intersection}</span>
                      {selectedIntersection === intersection && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Reason for Override</label>
              <Textarea
                placeholder="Describe the situation requiring manual override..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Action Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full bg-gradient-primary shadow-elegant"
                  disabled={!selectedIntersection || selectedScenario === null || !reason.trim()}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Initiate Emergency Override
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span>Confirm Emergency Override</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to initiate a manual override for <strong>{selectedIntersection}</strong> 
                    with scenario: <strong>{emergencyScenarios.find(s => s.id === selectedScenario)?.type}</strong>.
                    <br /><br />
                    This will override all automated systems for this intersection. Please confirm this action is necessary.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={initiateOverride}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Confirm Override
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Warning */}
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-warning">Important Safety Notice</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manual overrides should only be used in emergency situations. All actions are logged and may require supervisor approval for extended use.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Override;