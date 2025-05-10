
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

interface Course {
  id: string;
  title: string;
  description: string;
  chapters: number;
  completedChapters: number;
  createdAt: string;
  lastUpdated: string;
}

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Mock data - In a real app, this would fetch from an API
    if (isAuthenticated) {
      const mockCourses = [
        {
          id: "1",
          title: "Introduction to Machine Learning",
          description: "Learn the fundamentals of machine learning algorithms and applications.",
          chapters: 10,
          completedChapters: 4,
          createdAt: "2023-05-10",
          lastUpdated: "2023-05-15"
        },
        {
          id: "2",
          title: "Web Development Bootcamp",
          description: "Master HTML, CSS, JavaScript and popular frameworks.",
          chapters: 12,
          completedChapters: 8,
          createdAt: "2023-04-20",
          lastUpdated: "2023-05-12"
        }
      ];
      setCourses(mockCourses);
    }
  }, [isAuthenticated]);

  // Redirect if not authenticated
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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
              const progressPercentage = Math.round((course.completedChapters / course.chapters) * 100);
              
              return (
                <Card key={course.id} className="bg-white overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-coursegen-blue to-coursegen-purple text-white">
                    <CardTitle className="truncate">{course.title}</CardTitle>
                    <CardDescription className="text-gray-100">
                      Created on {course.createdAt}
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
                    <span className="text-xs text-gray-500">Last updated: {course.lastUpdated}</span>
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
