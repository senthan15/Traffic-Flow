import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Zap, 
  MapPin, 
  BarChart3, 
  Shield, 
  Cpu,
  Users,
  Globe,
  Clock,
  TrendingUp,
  CheckCircle
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "Live traffic signal status and vehicle count tracking across all intersections."
  },
  {
    icon: Zap,
    title: "AI-Powered Optimization",
    description: "Machine learning algorithms automatically adjust signal timing based on traffic patterns."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive reporting and data visualization for traffic performance insights."
  },
  {
    icon: Shield,
    title: "Emergency Override",
    description: "Manual control capabilities for emergency vehicles and special situations."
  },
  {
    icon: Cpu,
    title: "IoT Integration",
    description: "Seamless connectivity with traffic sensors, cameras, and smart city infrastructure."
  },
  {
    icon: Globe,
    title: "Scalable Architecture",
    description: "Cloud-based system designed to handle multiple cities and thousands of intersections."
  }
];

const benefits = [
  "Reduce average wait times by up to 30%",
  "Decrease fuel consumption and emissions",
  "Improve emergency vehicle response times",
  "Minimize traffic violations and accidents",
  "Optimize traffic flow during peak hours",
  "Provide data-driven city planning insights"
];

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-gradient-primary p-3 rounded-xl shadow-elegant">
          <Activity className="h-8 w-8 text-primary-foreground" />
          <span className="text-2xl font-bold text-primary-foreground">SmartSignal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Smart Urban Signal Monitoring
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Revolutionary IoT-based traffic management system that leverages artificial intelligence 
          to optimize urban traffic flow, reduce congestion, and improve city mobility.
        </p>
      </div>

      {/* System Overview */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-2xl">System Overview</CardTitle>
          <CardDescription>
            How our intelligent traffic management system transforms urban mobility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-foreground leading-relaxed">
            SmartSignal represents the next generation of urban traffic management. By combining 
            IoT sensors, real-time data processing, and machine learning algorithms, our system 
            continuously monitors and optimizes traffic flow across entire city networks.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-4 bg-card rounded-lg border border-border hover:shadow-elegant transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Key Benefits</span>
            </CardTitle>
            <CardDescription>
              Proven improvements in urban traffic management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Performance Metrics</span>
            </CardTitle>
            <CardDescription>
              Real-world impact and system statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary">30%</div>
                <div className="text-sm text-muted-foreground">Wait Time Reduction</div>
              </div>
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-accent">95%</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
              </div>
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary">2.4s</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center p-3 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-accent">1000+</div>
                <div className="text-sm text-muted-foreground">Intersections</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-primary" />
            <span>Technology Stack</span>
          </CardTitle>
          <CardDescription>
            Built with cutting-edge technologies for reliability and scalability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">IoT Sensors</Badge>
              <p className="text-sm text-muted-foreground">Vehicle detection and counting</p>
            </div>
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">Machine Learning</Badge>
              <p className="text-sm text-muted-foreground">Predictive traffic optimization</p>
            </div>
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">Cloud Computing</Badge>
              <p className="text-sm text-muted-foreground">Scalable data processing</p>
            </div>
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">Real-time APIs</Badge>
              <p className="text-sm text-muted-foreground">Live data synchronization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Contact & Support</span>
          </CardTitle>
          <CardDescription>
            Get in touch with our team for implementation and support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-foreground">Technical Support</h3>
              <p className="text-sm text-muted-foreground">24/7 system monitoring and assistance</p>
              <Badge variant="outline">support@smartsignal.com</Badge>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-foreground">Sales & Implementation</h3>
              <p className="text-sm text-muted-foreground">City planning and deployment</p>
              <Badge variant="outline">sales@smartsignal.com</Badge>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-foreground">Emergency Hotline</h3>
              <p className="text-sm text-muted-foreground">Critical system issues</p>
              <Badge variant="outline">+1 (555) 911-HELP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;