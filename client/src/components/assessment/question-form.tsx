import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

const answerSchema = z.object({
  answer: z.string().min(1, "Please select an answer"),
});

interface QuestionFormProps {
  question: {
    id: number;
    questionText: string;
    options: string[];
  };
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  onPrevious?: () => void;
  onSaveProgress?: () => void;
  onClose?: () => void;
  isSubmitting?: boolean;
}

export default function QuestionForm({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
  onPrevious,
  onSaveProgress,
  onClose,
  isSubmitting = false
}: QuestionFormProps) {
  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const progress = Math.round((currentQuestion / totalQuestions) * 100);
  const estimatedTime = Math.max(1, Math.ceil((totalQuestions - currentQuestion) * 0.5));

  const onSubmit = (values: z.infer<typeof answerSchema>) => {
    onAnswer(values.answer);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Assessment Question
            </h2>
            <p className="text-muted-foreground">
              Question {currentQuestion} of {totalQuestions} • Estimated time: {estimatedTime} minutes remaining
            </p>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          )}
        </div>

        <Progress value={progress} className="mb-8" />

        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground mb-6">
            How much do you agree with the following statement?
          </h3>
          <div className="bg-muted/50 p-6 rounded-lg mb-6">
            <p className="text-foreground font-medium">"{question.questionText}"</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-3"
                      >
                        {question.options?.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors duration-200"
                          >
                            <RadioGroupItem value={option} id={`option-${index}`} />
                            <FormLabel 
                              htmlFor={`option-${index}`}
                              className="flex-1 cursor-pointer"
                            >
                              {option}
                            </FormLabel>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                {onPrevious && currentQuestion > 1 ? (
                  <Button type="button" variant="outline" onClick={onPrevious}>
                    ← Previous
                  </Button>
                ) : (
                  <div />
                )}
                
                <div className="flex gap-3">
                  {onSaveProgress && (
                    <Button type="button" variant="outline" onClick={onSaveProgress}>
                      Save Progress
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting}>
                    {currentQuestion === totalQuestions ? 'Complete Assessment' : 'Next →'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
