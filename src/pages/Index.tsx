import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  ArrowRight, 
  BarChart3, 
  Settings, 
  AlertTriangle, 
  Zap,
  MapPin,
  Clock,
  Users,
  TrendingUp
} from "lucide-react";
import heroImage from "@/assets/smart-city-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-primary p-3 rounded-xl shadow-glow animate-pulse-glow">
            <Activity className="h-8 w-8 text-primary-foreground" />
            <span className="text-2xl font-bold text-primary-foreground">SmartSignal</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground animate-fade-in">
            Smart Urban Signal
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Monitoring
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Revolutionary IoT-based traffic management system using artificial intelligence 
            to optimize urban traffic flow and reduce congestion in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-all duration-300">
                <Activity className="h-5 w-5 mr-2" />
                View Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="bg-gradient-card shadow-card border-primary/20 hover:bg-primary/10">
                Learn More
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span>Real-time Monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span>AI-Powered Optimization</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
              <span>Emergency Override</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">Comprehensive Traffic Management</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitor, control, and optimize your city's traffic flow with our advanced IoT platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-all duration-300 animate-fade-in group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-xl shadow-elegant group-hover:shadow-glow transition-all duration-300">
                  <Activity className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle>Real-Time Dashboard</CardTitle>
                <CardDescription>
                  Live monitoring of traffic signals and vehicle counts across all intersections
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    View Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-all duration-300 animate-fade-in group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-secondary rounded-xl shadow-elegant group-hover:shadow-glow transition-all duration-300">
                  <Settings className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle>Smart Control</CardTitle>
                <CardDescription>
                  AI-powered signal timing optimization and manual adjustment capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/control">
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                    Control Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-all duration-300 animate-fade-in group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-xl shadow-elegant group-hover:shadow-glow transition-all duration-300">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle>Data Analytics</CardTitle>
                <CardDescription>
                  Historical trends, performance metrics, and traffic pattern analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/analytics">
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elegant transition-all duration-300 animate-fade-in group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-warning rounded-xl shadow-elegant group-hover:shadow-glow transition-all duration-300">
                  <AlertTriangle className="h-8 w-8 text-warning-foreground" />
                </div>
                <CardTitle>Emergency Override</CardTitle>
                <CardDescription>
                  Manual control for emergency vehicles and critical traffic situations
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link to="/override">
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-warning group-hover:text-warning-foreground transition-all duration-300">
                    Override Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2 animate-fade-in">
              <div className="text-4xl font-bold text-primary">30%</div>
              <div className="text-muted-foreground">Reduced Wait Times</div>
            </div>
            <div className="text-center space-y-2 animate-fade-in">
              <div className="text-4xl font-bold text-accent">95%</div>
              <div className="text-muted-foreground">System Uptime</div>
            </div>
            <div className="text-center space-y-2 animate-fade-in">
              <div className="text-4xl font-bold text-primary">2.4s</div>
              <div className="text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center space-y-2 animate-fade-in">
              <div className="text-4xl font-bold text-accent">1000+</div>
              <div className="text-muted-foreground">Intersections Managed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold text-primary-foreground">Ready to Transform Your Traffic Management?</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Join cities worldwide using SmartSignal to reduce congestion, improve safety, and create smarter urban mobility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="shadow-elegant">
                <Activity className="h-5 w-5 mr-2" />
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
