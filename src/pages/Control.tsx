import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  MapPin,
  Save,
  AlertTriangle,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AIMonitoringSystem from "@/components/AIMonitoringSystem";

interface ControlIntersection {
  id: string;
  name: string;
  redTime: number;
  yellowTime: number;
  greenTime: number;
  aiEnabled: boolean;
}

const Control = () => {
  const [intersections, setIntersections] = useState<ControlIntersection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntersection, setSelectedIntersection] = useState(0);
  const { toast } = useToast();

  // Fetch intersections and signal timing data
  const fetchIntersections = async () => {
    try {
      setLoading(true);
      
      // Fetch intersections
      const { data: intersectionsData, error: intersectionsError } = await supabase
        .from('intersections')
        .select('*');
      
      if (intersectionsError) throw intersectionsError;
      
      // Fetch signal timing
      const { data: signalData, error: signalError } = await supabase
        .from('signal_timing')
        .select('*');
      
      if (signalError) throw signalError;
      
      // Combine data
      const controlData = intersectionsData?.map(intersection => {
        const signals = signalData?.find(s => s.intersection_id === intersection.id);
        return {
          id: intersection.id,
          name: intersection.name,
          redTime: signals?.red_time || 30,
          yellowTime: signals?.yellow_time || 5,
          greenTime: signals?.green_time || 25,
          aiEnabled: intersection.status === 'active', // Default AI enabled for active intersections
        };
      }) || [];
      
      setIntersections(controlData);
    } catch (error) {
      console.error('Error fetching intersections:', error);
      toast({
        title: "Error",
        description: "Failed to load intersection data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntersections();
  }, []);

  const currentIntersection = intersections[selectedIntersection];

  const updateSignalTiming = (type: 'redTime' | 'yellowTime' | 'greenTime', value: number[]) => {
    const newIntersections = [...intersections];
    newIntersections[selectedIntersection] = {
      ...newIntersections[selectedIntersection],
      [type]: value[0]
    };
    setIntersections(newIntersections);
  };

  const toggleAI = (enabled: boolean) => {
    const newIntersections = [...intersections];
    newIntersections[selectedIntersection] = {
      ...newIntersections[selectedIntersection],
      aiEnabled: enabled
    };
    setIntersections(newIntersections);
  };

  const saveChanges = async () => {
    if (!currentIntersection) return;
    
    try {
      const { error } = await supabase
        .from('signal_timing')
        .update({
          red_time: currentIntersection.redTime,
          yellow_time: currentIntersection.yellowTime,
          green_time: currentIntersection.greenTime,
        })
        .eq('intersection_id', currentIntersection.id);
      
      if (error) throw error;
      
      toast({
        title: "Settings Saved",
        description: `Signal timing updated for ${currentIntersection.name}`,
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: "Failed to save signal timing changes",
        variant: "destructive",
      });
    }
  };

  const resetToDefaults = () => {
    const newIntersections = [...intersections];
    newIntersections[selectedIntersection] = {
      ...newIntersections[selectedIntersection],
      redTime: 30,
      yellowTime: 5,
      greenTime: 25
    };
    setIntersections(newIntersections);
    
    toast({
      title: "Reset Complete",
      description: "Signal timing reset to default values",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Control Panel</h1>
          <p className="text-muted-foreground">Adjust signal timings and AI automation settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={resetToDefaults} className="bg-gradient-card shadow-card">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={saveChanges} className="bg-gradient-primary shadow-elegant">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Manual Control</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Monitoring</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Intersection Selection */}
            <Card className="bg-gradient-card shadow-card border-0 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Select Intersection</span>
            </CardTitle>
            <CardDescription>Choose an intersection to configure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading intersections...</p>
              </div>
            ) : (
              intersections.map((intersection, index) => (
              <div
                key={intersection.id}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-card ${
                  selectedIntersection === index 
                    ? "border-primary bg-primary/10 shadow-elegant" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedIntersection(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{intersection.name}</span>
                  <div className="flex items-center space-x-2">
                    {intersection.aiEnabled && (
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        <Zap className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  R: {intersection.redTime}s | Y: {intersection.yellowTime}s | G: {intersection.greenTime}s
                </div>
              </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Control Settings */}
        <Card className="bg-gradient-card shadow-card border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Signal Configuration - {currentIntersection?.name || 'Select Intersection'}</span>
            </CardTitle>
            <CardDescription>Adjust timing and automation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {!currentIntersection ? (
              <div className="text-center py-8 text-muted-foreground">
                Please select an intersection to configure
              </div>
            ) : (
              <>
            {/* AI Toggle */}
            <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
              <div className="space-y-1">
                <h3 className="font-medium text-foreground flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>AI-Powered Optimization</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enable automatic signal timing adjustments based on traffic patterns
                </p>
              </div>
              <Switch
                checked={currentIntersection.aiEnabled}
                onCheckedChange={toggleAI}
              />
            </div>

            <Separator />

            {/* Manual Signal Controls */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Manual Signal Timing</h3>
              
              {/* Red Light Timing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span>Red Light Duration</span>
                  </label>
                  <span className="text-sm text-muted-foreground">{currentIntersection.redTime}s</span>
                </div>
                <Slider
                  value={[currentIntersection.redTime]}
                  onValueChange={(value) => updateSignalTiming('redTime', value)}
                  max={120}
                  min={15}
                  step={5}
                  className="w-full"
                  disabled={currentIntersection.aiEnabled}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>15s</span>
                  <span>120s</span>
                </div>
              </div>

              {/* Yellow Light Timing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span>Yellow Light Duration</span>
                  </label>
                  <span className="text-sm text-muted-foreground">{currentIntersection.yellowTime}s</span>
                </div>
                <Slider
                  value={[currentIntersection.yellowTime]}
                  onValueChange={(value) => updateSignalTiming('yellowTime', value)}
                  max={10}
                  min={3}
                  step={1}
                  className="w-full"
                  disabled={currentIntersection.aiEnabled}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3s</span>
                  <span>10s</span>
                </div>
              </div>

              {/* Green Light Timing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span>Green Light Duration</span>
                  </label>
                  <span className="text-sm text-muted-foreground">{currentIntersection.greenTime}s</span>
                </div>
                <Slider
                  value={[currentIntersection.greenTime]}
                  onValueChange={(value) => updateSignalTiming('greenTime', value)}
                  max={90}
                  min={10}
                  step={5}
                  className="w-full"
                  disabled={currentIntersection.aiEnabled}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10s</span>
                  <span>90s</span>
                </div>
              </div>

              {currentIntersection.aiEnabled && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-primary">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">AI Mode Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manual timing controls are disabled. The AI system is automatically optimizing signal timing based on real-time traffic data.
                  </p>
                </div>
              )}
            </div>
            </>
            )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AIMonitoringSystem 
            selectedIntersectionId={currentIntersection?.id} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Control;