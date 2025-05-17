import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";

// Define course types
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

const CourseGenerator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");

  // Form state
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [proficiency, setProficiency] = useState("beginner");
  const [depth, setDepth] = useState([50]);
  const [chaptersCount, setChaptersCount] = useState([6]);
  const [includeAssessments, setIncludeAssessments] = useState(true);
  
  const handleGenerateCourse = async () => {
    setIsGenerating(true);
    setGenerationProgress("Initializing course generation...");
    
    try {
      setGenerationProgress("Connecting to AI service...");
      
      // Call the Supabase edge function to generate the course
      const { data, error } = await supabase.functions.invoke('generate-course', {
        body: {
          topic,
          description,
          proficiency,
          depth: depth[0],
          chaptersCount: chaptersCount[0],
          includeAssessments
        }
      });
      
      if (error) {
        console.error("Error calling generate-course function:", error);
        throw new Error(error.message || "Error generating course");
      }
      
      if (!data.success) {
        throw new Error(data.error || "Failed to generate course");
      }
      
      const courseData = data.course;
      
      // Save the course to Supabase
      const { data: courseRecord, error: dbError } = await supabase
        .from('courses')
        .insert([
          {
            user_id: user?.id,
            title: courseData.courseTitle || topic,
            description: courseData.courseDescription || description,
            proficiency_level: proficiency,
            course_data: courseData
          }
        ])
        .select('id')
        .single();
      
      if (dbError) {
        console.error("Error saving course to database:", dbError);
        throw new Error("Failed to save course");
      }
      
      toast({
        title: "Course Generated Successfully!",
        description: `Your course "${courseData.courseTitle || topic}" is ready to explore.`,
      });
      
      // Navigate to the course page with the actual ID
      navigate(`/course/${courseRecord.id}`);
    } catch (error) {
      console.error("Course generation error:", error);
      
      toast({
        title: "Error Generating Course",
        description: error.message || "There was a problem generating your course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress("");
    }
  };

  const nextStep = () => {
    if (currentStep === 0 && !topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a course topic to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const steps = [
    {
      title: "Course Topic",
      description: "What would you like to learn about?",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Course Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Machine Learning, Web Development, Digital Marketing"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">
              Additional Details <span className="text-gray-400">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Specific areas you'd like to focus on or goals you want to achieve"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Learning Preferences",
      description: "Customize your learning experience",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Your Current Proficiency Level</Label>
            <RadioGroup
              value={proficiency}
              onValueChange={setProficiency}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="cursor-pointer">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="cursor-pointer">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="cursor-pointer">Advanced</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Learning Depth</Label>
              <span className="text-sm text-gray-500">
                {depth[0] <= 25
                  ? "Brief overview"
                  : depth[0] <= 50
                  ? "Standard coverage"
                  : depth[0] <= 75
                  ? "In-depth"
                  : "Comprehensive"}
              </span>
            </div>
            <Slider
              value={depth}
              onValueChange={setDepth}
              max={100}
              step={1}
              className="py-4"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Number of Chapters</Label>
              <span className="text-sm font-medium">{chaptersCount[0]}</span>
            </div>
            <Slider
              value={chaptersCount}
              onValueChange={setChaptersCount}
              min={3}
              max={12}
              step={1}
              className="py-4"
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="assessments">Include Assessments</Label>
            <Switch
              id="assessments"
              checked={includeAssessments}
              onCheckedChange={setIncludeAssessments}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Review & Generate",
      description: "Confirm your course details",
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Course Topic</h3>
            <p className="text-gray-700 mb-4">{topic}</p>
            
            {description && (
              <>
                <h3 className="font-semibold mb-2">Additional Details</h3>
                <p className="text-gray-700 mb-4">{description}</p>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1">Proficiency Level</h3>
                <p className="text-gray-700 capitalize">{proficiency}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Learning Depth</h3>
                <p className="text-gray-700">
                  {depth[0] <= 25
                    ? "Brief overview"
                    : depth[0] <= 50
                    ? "Standard coverage"
                    : depth[0] <= 75
                    ? "In-depth"
                    : "Comprehensive"}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Chapters</h3>
                <p className="text-gray-700">{chaptersCount[0]}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Assessments</h3>
                <p className="text-gray-700">{includeAssessments ? "Included" : "Not included"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="text-blue-800 font-semibold flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              What happens next?
            </h3>
            <p className="text-blue-700 text-sm">
              When you click "Generate Course", our AI will analyze your requirements and create a 
              personalized course with chapters, content, and resources tailored to your needs. 
              This process may take a few moments.
            </p>
          </div>
        </div>
      ),
    },
  ];

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
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Generate Your Course</h1>
          <p className="text-gray-500 mb-8">
            Provide details about what you want to learn, and our AI will create a personalized course
          </p>

          <div className="rounded-lg overflow-hidden bg-white shadow-sm mb-8">
            <Tabs value={`step-${currentStep}`} className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                {steps.map((step, index) => (
                  <TabsTrigger
                    key={index}
                    value={`step-${index}`}
                    disabled={currentStep !== index}
                    className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${
                      index < currentStep ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    {index + 1}. {step.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {steps.map((step, index) => (
                <TabsContent key={index} value={`step-${index}`} className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
                  <p className="text-gray-500 mb-6">{step.description}</p>
                  {step.content}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="flex justify-between">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleGenerateCourse} 
                disabled={isGenerating}
                className="bg-gradient-to-r from-coursegen-blue to-coursegen-purple hover:from-coursegen-blue/90 hover:to-coursegen-purple/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {generationProgress || "Generating..."}
                  </>
                ) : (
                  "Generate Course"
                )}
              </Button>
            )}
          </div>
          
          {isGenerating && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-blue-800 font-medium mb-2">
                Generating Your Personalized Course
              </h3>
              <p className="text-blue-700 text-sm">
                Our AI is creating your course content based on your specifications.
                This may take a minute or two depending on the complexity of the topic.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseGenerator;
