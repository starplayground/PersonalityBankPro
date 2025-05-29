import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import PersonalityChart from "@/components/profile/personality-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, Share2, Calendar, TrendingUp, Award, Eye } from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";

export default function Profile() {
  const { id } = useParams();
  const userId = parseInt(id!);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  const { data: personalityProfile } = useQuery({
    queryKey: [`/api/users/${userId}/personality-profile`],
    enabled: !!userId,
  });

  const { data: assessments } = useQuery({
    queryKey: [`/api/users/${userId}/assessments`],
    enabled: !!userId,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="bg-white rounded-xl p-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">User Not Found</h1>
            <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user.isProfilePublic && userId !== 1) { // 1 is current user in demo
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-foreground mb-2">Private Profile</h1>
              <p className="text-muted-foreground">
                This user has chosen to keep their profile private.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const completedAssessments = assessments?.filter((a: any) => a.status === 'completed') || [];
  const isOwnProfile = userId === 1; // Demo: current user ID is 1

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div className="flex items-center gap-6 mb-6 md:mb-0">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-secondary text-white text-2xl">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-semibold text-foreground mb-2">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground mb-3">@{user.username}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(user.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {completedAssessments.length} Assessments
                    </div>
                  </div>
                </div>
              </div>
              
              {isOwnProfile && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personality Overview */}
            <PersonalityChart personalityProfile={personalityProfile} />

            {/* Assessment History */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
              </CardHeader>
              <CardContent>
                {completedAssessments.length > 0 ? (
                  <div className="space-y-4">
                    {completedAssessments.map((assessment: any) => (
                      <div key={assessment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <h3 className="font-medium text-foreground">{assessment.assessment.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Completed {formatDate(assessment.completedAt)}
                          </p>
                        </div>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No completed assessments yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Insights */}
            {personalityProfile?.insights && (
              <Card>
                <CardHeader>
                  <CardTitle>Personality Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {personalityProfile.insights}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Strengths */}
            {personalityProfile?.strengths && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Strengths</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {personalityProfile.strengths.map((strength: string, index: number) => (
                    <Badge key={index} variant="secondary" className="w-full justify-start">
                      {strength}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Growth Areas */}
            {personalityProfile?.growthAreas && (
              <Card>
                <CardHeader>
                  <CardTitle>Growth Areas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {personalityProfile.growthAreas.map((area: string, index: number) => (
                    <Badge key={index} variant="outline" className="w-full justify-start">
                      {area}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Hobbies */}
            {personalityProfile?.hobbies && (
              <Card>
                <CardHeader>
                  <CardTitle>Hobbies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {personalityProfile.hobbies.map((hobby: string, index: number) => (
                    <Badge key={index} variant="secondary" className="w-full justify-start">
                      {hobby}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Habits */}
            {personalityProfile?.habits && (
              <Card>
                <CardHeader>
                  <CardTitle>Habits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {personalityProfile.habits.map((habit: string, index: number) => (
                    <Badge key={index} variant="outline" className="w-full justify-start">
                      {habit}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Privacy Settings */}
            {isOwnProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Public Profile</span>
                      <Badge variant={user.isProfilePublic ? "default" : "secondary"}>
                        {user.isProfilePublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      When your profile is public, other community members can view your personality insights and growth journey.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Update Privacy Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
