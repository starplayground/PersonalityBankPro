import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, TrendingUp, Award } from "lucide-react";
import { Link } from "wouter";
import { getInitials } from "@/lib/utils";

export default function Community() {
  const { data: publicUsers, isLoading } = useQuery({
    queryKey: ["/api/users/public"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-4">Community</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Connect with others on their personality development journey and share insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search community members..."
                className="pl-10"
              />
            </div>
            <Button>Join Discussion</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Community Stats */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Members</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Assessments Completed</span>
                    <span className="font-semibold">8,432</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Growth Achievements</span>
                    <span className="font-semibold">2,156</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="secondary" className="w-full justify-start">
                    Leadership Development
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start">
                    Emotional Intelligence
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start">
                    Career Growth
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start">
                    Communication Skills
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Member Profiles */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Community Members</CardTitle>
                <p className="text-muted-foreground">
                  Discover and connect with members who have chosen to share their profiles publicly.
                </p>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-300 rounded w-24"></div>
                              <div className="h-3 bg-gray-300 rounded w-32"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-300 rounded"></div>
                            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : publicUsers && publicUsers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {publicUsers.map((user: any) => (
                      <Link key={user.id} href={`/profile/${user.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-secondary text-white">
                                  {getInitials(user.firstName, user.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  @{user.username}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-accent" />
                                <span className="text-sm text-muted-foreground">
                                  Active Community Member
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Focused on personal growth and development
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                Growth Mindset
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Leadership
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Public Profiles Yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Be the first to make your profile public and connect with the community!
                    </p>
                    <Button>Make Profile Public</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
