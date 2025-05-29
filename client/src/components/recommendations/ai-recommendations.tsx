import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Briefcase, Heart, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: number;
  category: "career" | "relationships" | "habits";
  title: string;
  description: string;
  action: string;
  isRead: boolean;
}

interface AIRecommendationsProps {
  recommendations?: Recommendation[];
}

const categoryConfig = {
  career: {
    icon: Briefcase,
    label: "Career Development",
    colorClass: "from-accent/10 to-accent/5 border-accent/20",
    iconColor: "text-accent"
  },
  relationships: {
    icon: Heart,
    label: "Relationships",
    colorClass: "from-secondary/10 to-secondary/5 border-secondary/20",
    iconColor: "text-secondary"
  },
  habits: {
    icon: Target,
    label: "Healthy Habits",
    colorClass: "from-primary/10 to-primary/5 border-primary/20",
    iconColor: "text-primary"
  }
};

export default function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <CardTitle>AI-Powered Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Complete a personality assessment to get personalized recommendations
            </p>
            <Button>Start Assessment</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestRecommendations = recommendations.slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <CardTitle>AI-Powered Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestRecommendations.map((recommendation) => {
            const config = categoryConfig[recommendation.category];
            const Icon = config.icon;
            
            return (
              <div
                key={recommendation.id}
                className={cn(
                  "bg-gradient-to-br rounded-lg p-4 border",
                  config.colorClass
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn("w-4 h-4", config.iconColor)} />
                  <span className={cn("text-sm font-medium", config.iconColor)}>
                    {config.label}
                  </span>
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  {recommendation.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {recommendation.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("p-0 h-auto", config.iconColor)}
                >
                  Learn More →
                </Button>
              </div>
            );
          })}
        </div>
        
        {recommendations.length > 3 && (
          <Button variant="outline" className="w-full mt-4">
            View All Recommendations
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
