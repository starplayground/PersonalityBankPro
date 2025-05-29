import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getPersonalityColor, formatPercentage } from "@/lib/utils";

interface PersonalityChartProps {
  personalityProfile?: {
    scores: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
    insights?: string;
  };
}

const traitLabels = {
  openness: "Openness",
  conscientiousness: "Conscientiousness", 
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  neuroticism: "Neuroticism"
};

export default function PersonalityChart({ personalityProfile }: PersonalityChartProps) {
  if (!personalityProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Personality Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Complete a personality assessment to see your profile
            </p>
            <Button>Take Assessment</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { scores } = personalityProfile;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Personality Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(scores).map(([trait, score]) => (
          <div key={trait}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                {traitLabels[trait as keyof typeof traitLabels]}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatPercentage(score)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${score}%`,
                  backgroundColor: getPersonalityColor(trait)
                }}
              />
            </div>
          </div>
        ))}
        
        {personalityProfile.insights && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {personalityProfile.insights}
            </p>
          </div>
        )}
        
        <Button variant="outline" className="w-full mt-6">
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  );
}
