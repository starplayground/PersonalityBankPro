import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import QuestionForm from "@/components/assessment/question-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Assessment() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { data: userAssessment, isLoading } = useQuery({
    queryKey: [`/api/user-assessments/${id}`],
    enabled: !!id,
  });

  const answerMutation = useMutation({
    mutationFn: async (answer: string) => {
      const currentQuestion = userAssessment.questions.find(
        (q: any) => q.order === userAssessment.currentQuestion
      );
      
      return apiRequest("POST", "/api/responses", {
        userAssessmentId: parseInt(id!),
        questionId: currentQuestion.id,
        answer,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user-assessments/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/1/assessments`] });
      
      // Check if assessment is completed
      if (userAssessment.currentQuestion >= userAssessment.assessment.totalQuestions) {
        setIsCompleted(true);
        toast({
          title: "Assessment Completed!",
          description: "Your personality profile is being generated.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your answer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveProgressMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/user-assessments/${id}`, {
        status: "in_progress"
      });
    },
    onSuccess: () => {
      toast({
        title: "Progress Saved",
        description: "You can continue this assessment later.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="space-y-3 mt-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!userAssessment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Assessment Not Found</h1>
            <p className="text-muted-foreground">The assessment you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  if (isCompleted || userAssessment.status === 'completed') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-foreground mb-4">
                  Assessment Completed!
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                  Congratulations! You've successfully completed the {userAssessment.assessment.name}. 
                  Your personality profile is being generated and will be available shortly.
                </p>
                <div className="space-y-4">
                  <Button size="lg" className="w-full sm:w-auto">
                    View Your Results
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto ml-0 sm:ml-4">
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = userAssessment.questions?.find(
    (q: any) => q.order === userAssessment.currentQuestion
  );

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Question Not Found</h1>
            <p className="text-muted-foreground">Unable to load the current question.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuestionForm
          question={currentQuestion}
          currentQuestion={userAssessment.currentQuestion}
          totalQuestions={userAssessment.assessment.totalQuestions}
          onAnswer={(answer) => answerMutation.mutate(answer)}
          onSaveProgress={() => saveProgressMutation.mutate()}
          isSubmitting={answerMutation.isPending}
        />
      </main>
    </div>
  );
}
