import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, CheckCircle, Youtube, Globe, BookOpen } from "lucide-react";

// Use the types from CourseGenerator.tsx
interface Resource {
  type: 'video' | 'article';
  title: string;
  url: string;
  description: string;
}

interface AssessmentQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Chapter {
  title: string;
  objectives: string[];
  content: string;
  summary: string;
  resources: Resource[];
  assessment?: AssessmentQuestion[];
}

interface CourseData {
  courseTitle: string;
  courseDescription: string;
  proficiencyLevel: string;
  chapters: Chapter[];
}

const CourseView = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { id } = useParams();
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeTab, setActiveTab] = useState("content");
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you would fetch course data from the database
    // For now, we're using localStorage as a temporary data store
    try {
      const savedCourse = localStorage.getItem('generatedCourse');
      if (savedCourse) {
        setCourseData(JSON.parse(savedCourse));
      } else {
        // Fallback for testing if no course is generated yet
        setError("Course not found. Please generate a course first.");
      }
    } catch (err) {
      console.error("Error loading course data:", err);
      setError("Failed to load course data.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center mt-20">
            <h1 className="text-2xl font-bold mb-4">{error}</h1>
            <Button onClick={() => window.location.href = "/course-generator"}>
              Create a Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return <div className="flex items-center justify-center h-screen">Loading course data...</div>;
  }

  const currentChapter = courseData.chapters[activeChapter];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Course Content</CardTitle>
                <CardDescription>
                  {courseData.proficiencyLevel.charAt(0).toUpperCase() + courseData.proficiencyLevel.slice(1)} Level
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-1">
                  {courseData.chapters.map((chapter, index) => (
                    <Button
                      key={index}
                      variant={activeChapter === index ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setActiveChapter(index);
                        setActiveTab("content");
                      }}
                    >
                      <span className="truncate">
                        {index + 1}. {chapter.title}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-1">{courseData.courseTitle}</CardTitle>
                    <CardDescription className="text-base">
                      {courseData.courseDescription}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">
                    Chapter {activeChapter + 1}: {currentChapter.title}
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-2">Learning Objectives:</h3>
                    <ul className="space-y-1">
                      {currentChapter.objectives.map((objective, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                      {currentChapter.assessment && (
                        <TabsTrigger value="assessment">Assessment</TabsTrigger>
                      )}
                    </TabsList>
                    
                    <TabsContent value="content" className="mt-0">
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-line">
                          {currentChapter.content}
                        </div>
                        
                        <h3 className="font-semibold text-lg mt-6 mb-2">Summary</h3>
                        <div className="bg-blue-50 p-4 rounded-md">
                          {currentChapter.summary}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="resources" className="mt-0">
                      <div className="grid gap-4">
                        {currentChapter.resources.map((resource, i) => (
                          <Card key={i}>
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                {resource.type === "video" ? (
                                  <Youtube className="h-5 w-5 mr-2 text-red-600 mt-1 flex-shrink-0" />
                                ) : (
                                  <Globe className="h-5 w-5 mr-2 text-blue-600 mt-1 flex-shrink-0" />
                                )}
                                <div>
                                  <h3 className="font-medium flex items-center">
                                    {resource.title}
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 ml-2 inline-flex items-center"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {resource.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    {currentChapter.assessment && (
                      <TabsContent value="assessment" className="mt-0">
                        <div className="space-y-6">
                          {currentChapter.assessment.map((question, i) => (
                            <div key={i} className="bg-white p-4 rounded-md border">
                              <h3 className="font-medium mb-3">Question {i + 1}: {question.question}</h3>
                              
                              <div className="space-y-2 mb-4">
                                {question.options.map((option, j) => (
                                  <div
                                    key={j}
                                    className={`p-2 rounded-md border ${
                                      j === question.correctAnswer
                                        ? "bg-green-50 border-green-200"
                                        : "bg-white"
                                    }`}
                                  >
                                    <div className="flex items-start">
                                      <span className="font-medium mr-2">{String.fromCharCode(65 + j)}.</span>
                                      <span>{option}</span>
                                      {j === question.correctAnswer && (
                                        <CheckCircle className="h-4 w-4 text-green-600 ml-auto flex-shrink-0" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-2">
                                <h4 className="font-medium text-sm">Explanation:</h4>
                                <p className="text-sm">{question.explanation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
                
                <Separator className="my-6" />
                
                {/* Navigation buttons */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    disabled={activeChapter === 0}
                    onClick={() => setActiveChapter(prev => Math.max(prev - 1, 0))}
                  >
                    Previous Chapter
                  </Button>
                  
                  <Button
                    disabled={activeChapter >= courseData.chapters.length - 1}
                    onClick={() => setActiveChapter(prev => Math.min(prev + 1, courseData.chapters.length - 1))}
                  >
                    Next Chapter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
