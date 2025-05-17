
import { useState, useEffect } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  proficiency_level: string;
  chapters: number;
  completedChapters: number;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  console.log("Dashboard: Auth state", { isAuthenticated, isLoading, user: user?.email });

  useEffect(() => {
    const fetchCourses = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setFetchingCourses(true);
        console.log("Dashboard: Fetching courses for user", user.id);
        
        // Fetch courses from Supabase
        const { data: coursesData, error } = await supabase
          .from('courses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (!coursesData?.length) {
          console.log("No courses found for user");
          setCourses([]);
          return;
        }

        // Fetch progress for each course
        const processedCourses = await Promise.all(coursesData.map(async (course) => {
          // Extract chapters from course_data
          const courseData = course.course_data;
          const chapterCount = courseData.chapters?.length || 0;
          
          // Fetch progress data for this course
          const { data: progressData, error: progressError } = await supabase
            .from('course_progress')
            .select('*')
            .eq('course_id', course.id)
            .eq('user_id', user.id)
            .eq('completed', true);
          
          if (progressError) {
            console.error("Error fetching course progress:", progressError);
          }
          
          const completedChaptersCount = progressData?.length || 0;
          
          return {
            id: course.id,
            title: course.title,
            description: course.description,
            proficiency_level: course.proficiency_level,
            chapters: chapterCount,
            completedChapters: completedChaptersCount,
            created_at: new Date(course.created_at).toLocaleDateString(),
            updated_at: new Date(course.updated_at).toLocaleDateString()
          };
        }));
        
        setCourses(processedCourses);
        console.log("Fetched courses:", processedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
        });
      } finally {
        setFetchingCourses(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, user, toast]);

  // Loading state
  if (isLoading || fetchingCourses) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Not authenticated state - redirect to login with current location as state
  if (!isAuthenticated) {
    console.log("Dashboard: User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <p className="text-gray-500">Track and manage your personalized courses</p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/course-generator">Create New Course</Link>
          </Button>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progressPercentage = course.chapters > 0 
                ? Math.round((course.completedChapters / course.chapters) * 100) 
                : 0;
              
              return (
                <Card key={course.id} className="bg-white overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-coursegen-blue to-coursegen-purple text-white">
                    <CardTitle className="truncate">{course.title}</CardTitle>
                    <CardDescription className="text-gray-100">
                      Created on {course.created_at}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 line-clamp-2 mb-4">{course.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className="h-2"
                      />
                      <div className="text-xs text-gray-500">
                        {course.completedChapters} of {course.chapters} chapters completed
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 flex justify-between">
                    <span className="text-xs text-gray-500">Last updated: {course.updated_at}</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/course/${course.id}`}>Continue</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No courses yet</h2>
            <p className="text-gray-500 mb-6">
              Create your first personalized course to get started on your learning journey.
            </p>
            <Button className="mx-auto" asChild>
              <Link to="/course-generator">Generate Your First Course</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
