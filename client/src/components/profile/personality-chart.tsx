import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getPersonalityColor, formatPercentage } from "@/lib/utils";
import { t } from "@/lib/i18n";

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
    hobbies?: string[];
    habits?: string[];
  };
}

const getTraitLabel = (trait: string) => {
  return t(`traits.${trait}`);
};

export default function PersonalityChart({ personalityProfile }: PersonalityChartProps) {
  if (!personalityProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.personalityOverview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {t("profile.completeAssessment")}
            </p>
            <Button>{t("profile.takeAssessment")}</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { scores } = personalityProfile;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.personalityOverview")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(scores).map(([trait, score]) => (
          <div key={trait}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                {getTraitLabel(trait)}
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

        {personalityProfile.hobbies && personalityProfile.hobbies.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Hobbies</h4>
            <div className="flex flex-wrap gap-2">
              {personalityProfile.hobbies.map((hobby, i) => (
                <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {personalityProfile.habits && personalityProfile.habits.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Habits</h4>
            <div className="flex flex-wrap gap-2">
              {personalityProfile.habits.map((habit, i) => (
                <span key={i} className="text-xs border px-2 py-1 rounded">
                  {habit}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <Button variant="outline" className="w-full mt-6">
          {t("profile.viewFullProfile")}
        </Button>
      </CardContent>
    </Card>
  );
}
