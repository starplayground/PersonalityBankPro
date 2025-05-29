import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateProgress } from "@/lib/utils";
import { Link } from "wouter";

interface AssessmentCardProps {
  userAssessment: {
    id: number;
    status: string;
    currentQuestion: number;
    assessment: {
      id: number;
      name: string;
      totalQuestions: number;
    };
  };
}

export default function AssessmentCard({ userAssessment }: AssessmentCardProps) {
  const progress = userAssessment.status === 'completed' 
    ? 100 
    : calculateProgress(userAssessment.currentQuestion - 1, userAssessment.assessment.totalQuestions);

  const questionsCompleted = userAssessment.status === 'completed'
    ? userAssessment.assessment.totalQuestions
    : userAssessment.currentQuestion - 1;

  return (
    <Card className="border border-gray-200 hover:border-primary transition-colors duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-foreground">{userAssessment.assessment.name}</h3>
          <span className="text-sm text-muted-foreground">
            {userAssessment.status === 'completed' ? 'Completed' : `${progress}% Complete`}
          </span>
        </div>
        <Progress 
          value={progress} 
          className="mb-3"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {questionsCompleted} of {userAssessment.assessment.totalQuestions} questions completed
          </span>
          {userAssessment.status === 'completed' ? (
            <Button variant="ghost" size="sm">View Results</Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/assessment/${userAssessment.id}`}>
                {questionsCompleted === 0 ? 'Start Now' : 'Continue'}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
