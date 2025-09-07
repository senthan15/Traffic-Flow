import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Play,
  Pause
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIStatus {
  status: string;
  model: string;
  lastOptimized: string;
  performance: {
    accuracy: number;
    avgReward: number;
    trafficImprovement: string;
  };
}

interface AIDecision {
  action: number;
  confidence: number;
  expectedReward: number;
  newTiming: {
    redTime: number;
    yellowTime: number;
    greenTime: number;
  };
}

interface MonitoringSystemProps {
  selectedIntersectionId?: string;
}

const AIMonitoringSystem = ({ selectedIntersectionId }: MonitoringSystemProps) => {
  const [isActive, setIsActive] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus | null>(null);
  const [lastDecision, setLastDecision] = useState<AIDecision | null>(null);
  const [optimizationRunning, setOptimizationRunning] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAIStatus();
    const interval = setInterval(fetchAIStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAIStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-traffic-optimizer', {
        body: { operation: 'status' }
      });
      
      if (error) throw error;
      setAiStatus(data);
    } catch (error) {
      console.error('Error fetching AI status:', error);
    }
  };

  const runOptimization = async () => {
    if (!selectedIntersectionId) {
      toast({
        title: "No Intersection Selected",
        description: "Please select an intersection to optimize",
        variant: "destructive",
      });
      return;
    }

    setOptimizationRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-traffic-optimizer', {
        body: { 
          intersectionId: selectedIntersectionId,
          operation: 'optimize'
        }
      });
      
      if (error) throw error;
      
      setLastDecision(data.aiDecision);
      setOptimizationHistory(prev => [{
        timestamp: new Date(),
        decision: data.aiDecision,
        updated: data.updated,
        message: data.message
      }, ...prev.slice(0, 4)]);

      toast({
        title: data.updated ? "AI Optimization Applied" : "AI Analysis Complete",
        description: data.message,
      });
    } catch (error) {
      console.error('Error running optimization:', error);
      toast({
        title: "Optimization Failed",
        description: "Could not run AI optimization",
        variant: "destructive",
      });
    } finally {
      setOptimizationRunning(false);
    }
  };

  const toggleAISystem = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "AI System Deactivated" : "AI System Activated",
      description: isActive ? "Manual control restored" : "AI monitoring and optimization enabled",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI System Status */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>AI Traffic Control System</span>
            </div>
            <Badge variant={isActive ? "default" : "secondary"} className="bg-primary/10 text-primary">
              {isActive ? "Active" : "Standby"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Deep Q-Learning Agent for intelligent traffic signal optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={toggleAISystem}
              variant={isActive ? "secondary" : "default"}
              className="bg-gradient-primary shadow-elegant"
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Deactivate AI
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Activate AI
                </>
              )}
            </Button>
            
            <Button
              onClick={runOptimization}
              disabled={!isActive || optimizationRunning}
              variant="outline"
              className="bg-gradient-card shadow-card"
            >
              <Zap className="h-4 w-4 mr-2" />
              {optimizationRunning ? "Optimizing..." : "Run Optimization"}
            </Button>
          </div>

          {aiStatus && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-foreground">
                  {(aiStatus.performance.accuracy * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Model Accuracy</div>
              </div>
              
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-foreground">
                  {aiStatus.performance.avgReward.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Reward Score</div>
              </div>
              
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-accent">
                  {aiStatus.performance.trafficImprovement}
                </div>
                <div className="text-sm text-muted-foreground">Traffic Improvement</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest AI Decision */}
      {lastDecision && (
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Latest AI Decision</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Decision</span>
                  <Badge variant={lastDecision.action === 1 ? "default" : "secondary"}>
                    {lastDecision.action === 1 ? "Optimize Timing" : "Maintain Current"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="text-sm font-medium">{(lastDecision.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={lastDecision.confidence * 100} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Optimized Timing</div>
                <div className="flex space-x-4 text-sm">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-destructive"></div>
                    <span>R: {lastDecision.newTiming.redTime}s</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span>Y: {lastDecision.newTiming.yellowTime}s</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    <span>G: {lastDecision.newTiming.greenTime}s</span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization History */}
      {optimizationHistory.length > 0 && (
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Recent Optimizations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizationHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                >
                  <div className="flex items-center space-x-3">
                    {item.updated ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {item.message}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confidence: {(item.decision.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIMonitoringSystem;