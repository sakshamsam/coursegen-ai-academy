
import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  List, 
  Loader2, 
  Video, 
  BookOpenCheck
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

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

interface Course {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  proficiencyLevel: string;
}

const CourseView = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedChapters, setCompletedChapters] = useState<Record<number, boolean>>({});
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id || !isAuthenticated || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch course from database
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("id", id)
          .single();
        
        if (courseError || !courseData) {
          console.error("Error fetching course:", courseError);
          toast({
            title: "Error",
            description: "Failed to load course. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        // Format course data
        const formattedCourse: Course = {
          id: courseData.id,
          title: courseData.title,
          description: courseData.description,
          proficiencyLevel: courseData.proficiency_level,
          chapters: courseData.course_data.chapters || []
        };
        
        setCourse(formattedCourse);

        // Fetch completed chapters from course_progress
        const { data: progressData, error: progressError } = await supabase
          .from("course_progress")
          .select("*")
          .eq("course_id", id)
          .eq("user_id", user.id);
        
        if (progressError) {
          console.error("Error fetching course progress:", progressError);
        } else {
          const completedMap = progressData.reduce((acc, progress) => {
            if (progress.completed) {
              acc[progress.chapter_index] = true;
            }
            return acc;
          }, {} as Record<number, boolean>);
          
          setCompletedChapters(completedMap);
        }
      } catch (error) {
        console.error("Error in fetchCourse:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading the course.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, isAuthenticated, user, toast]);

  const handleMarkComplete = async () => {
    if (!course || !user || !isAuthenticated) return;
    
    try {
      setIsSavingProgress(true);
      
      // Save progress to database
      const { error } = await supabase
        .from("course_progress")
        .upsert({
          user_id: user.id,
          course_id: id!,
          chapter_index: currentChapter,
          completed: true,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setCompletedChapters(prev => ({
        ...prev,
        [currentChapter]: true
      }));
      
      toast({
        title: "Progress Saved",
        description: "Chapter marked as complete!",
      });
      
      // Move to next chapter if there is one
      if (course.chapters && currentChapter < course.chapters.length - 1) {
        setCurrentChapter(currentChapter + 1);
      }
    } catch (error) {
      console.error("Error marking chapter as complete:", error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProgress(false);
    }
  };

  // Functions to navigate between chapters
  const nextChapter = () => {
    if (course?.chapters && currentChapter < course.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      window.scrollTo(0, 0);
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading course...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const chapter = course.chapters[currentChapter];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar - Chapter List */}
        <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-80 lg:w-96 flex-shrink-0`}>
          <div className="sticky top-20 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chapters</h2>
              <Button variant="outline" size="icon" className="md:hidden" onClick={() => setShowSidebar(false)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {course.chapters.map((chapter, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Button 
                    variant={currentChapter === idx ? "default" : "ghost"} 
                    className={`w-full justify-start ${completedChapters[idx] ? 'text-green-700' : ''}`}
                    onClick={() => setCurrentChapter(idx)}
                  >
                    {completedChapters[idx] ? (
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <span className="h-4 w-4 mr-2 inline-flex items-center justify-center text-xs font-semibold">
                        {idx + 1}
                      </span>
                    )}
                    <span className="truncate">{chapter.title}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {!showSidebar && (
            <Button 
              variant="outline" 
              size="sm" 
              className="md:hidden mb-4" 
              onClick={() => setShowSidebar(true)}
            >
              <List className="h-4 w-4 mr-2" />
              Show Chapters
            </Button>
          )}
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">{chapter.title}</h1>
                <p className="text-gray-500">Chapter {currentChapter + 1} of {course.chapters.length}</p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center">
                {completedChapters[currentChapter] ? (
                  <span className="inline-flex items-center text-green-600 mr-4">
                    <Check className="h-5 w-5 mr-1" />
                    Completed
                  </span>
                ) : (
                  <Button 
                    onClick={handleMarkComplete} 
                    className="mr-4"
                    disabled={isSavingProgress}
                  >
                    {isSavingProgress ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <BookOpenCheck className="mr-2 h-4 w-4" />
                    )}
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
            
            {/* Objectives */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Learning Objectives</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {chapter.objectives.map((objective, idx) => (
                    <li key={idx} className="text-gray-600">{objective}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Content */}
            <div className="prose max-w-none mb-8">
              {chapter.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <h2 className="text-lg font-semibold mb-2">Summary</h2>
              <p>{chapter.summary}</p>
            </div>
            
            {/* Resources */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Additional Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapter.resources.map((resource, idx) => (
                  <a 
                    key={idx} 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all flex items-start"
                  >
                    {resource.type === 'video' ? (
                      <Video className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    ) : (
                      <FileText className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Assessment */}
            {chapter.assessment && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Knowledge Check</h2>
                <Accordion type="single" collapsible className="w-full">
                  {chapter.assessment.map((question, qIdx) => (
                    <AccordionItem key={qIdx} value={`question-${qIdx}`}>
                      <AccordionTrigger className="text-left">
                        {question.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            {question.options.map((option, oIdx) => (
                              <div 
                                key={oIdx} 
                                className={`p-3 rounded-md border ${
                                  oIdx === question.correctAnswer 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-start">
                                  <span className="font-medium mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                                  <span>{option}</span>
                                  {oIdx === question.correctAnswer && (
                                    <Check className="ml-auto h-5 w-5 text-green-500" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <Separator />
                          <div>
                            <h4 className="font-medium mb-2">Explanation</h4>
                            <p className="text-gray-600">{question.explanation}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={prevChapter} 
                disabled={currentChapter === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Chapter
              </Button>
              
              <div className="flex gap-2">
                {!completedChapters[currentChapter] && (
                  <Button 
                    onClick={handleMarkComplete}
                    disabled={isSavingProgress}
                  >
                    {isSavingProgress ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <BookOpenCheck className="mr-2 h-4 w-4" />
                    )}
                    Complete
                  </Button>
                )}
                
                <Button 
                  onClick={nextChapter} 
                  disabled={currentChapter === course.chapters.length - 1}
                >
                  Next Chapter
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
