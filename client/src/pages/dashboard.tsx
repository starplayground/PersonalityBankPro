import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import AssessmentCard from "@/components/assessment/assessment-card";
import PersonalityChart from "@/components/profile/personality-chart";
import AIRecommendations from "@/components/recommendations/ai-recommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Users, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "wouter";

// Mock user ID for demo - in real app this would come from auth
const CURRENT_USER_ID = 1;

export default function Dashboard() {
  const { data: assessments, isLoading: assessmentsLoading } = useQuery({
    queryKey: [`/api/users/${CURRENT_USER_ID}/assessments`],
  });

  const { data: personalityProfile } = useQuery({
    queryKey: [`/api/users/${CURRENT_USER_ID}/personality-profile`],
  });

  const { data: recommendations } = useQuery({
    queryKey: [`/api/users/${CURRENT_USER_ID}/recommendations`],
  });

  const { data: publicUsers } = useQuery({
    queryKey: ["/api/users/public"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3">
              <h1 className="text-3xl font-semibold text-foreground mb-4">
                Welcome back, <span className="text-primary">John</span> 👋
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                Continue your personality development journey and discover new insights about yourself.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Continue Assessment
                </Button>
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <Link href="/community">
                    <Users className="w-5 h-5" />
                    Explore Community
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/3 mt-6 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Modern workspace representing personal growth"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Assessment Progress */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Assessment Progress</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {assessmentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : assessments && assessments.length > 0 ? (
                  assessments.map((userAssessment: any) => (
                    <AssessmentCard key={userAssessment.id} userAssessment={userAssessment} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No assessments started yet</p>
                    <Button>Start Your First Assessment</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <AIRecommendations recommendations={recommendations} />

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed Openness to Experience module</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Conscientiousness score improved by 15%</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Personality Overview */}
            <PersonalityChart personalityProfile={personalityProfile} />

            {/* Community Spotlight */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Community Spotlight</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/community">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {publicUsers?.slice(0, 3).map((user: any) => (
                  <Link key={user.id} href={`/profile/${user.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">Active Community Member</p>
                      </div>
                    </div>
                  </Link>
                )) || (
                  <p className="text-muted-foreground text-sm">No public profiles available</p>
                )}
              </CardContent>
            </Card>

            {/* Growth Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Days Active</span>
                  <span className="text-lg font-semibold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Assessments Completed</span>
                  <span className="text-lg font-semibold">{assessments?.filter((a: any) => a.status === 'completed').length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Growth Score</span>
                  <span className="text-lg font-semibold text-accent">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Community Rank</span>
                  <span className="text-lg font-semibold text-primary">Top 25%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
