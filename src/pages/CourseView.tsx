
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Checkbox } from "@/components/ui/checkbox";

interface Chapter {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  resources: Resource[];
  quiz?: Quiz[];
}

interface Resource {
  id: string;
  type: "article" | "video" | "book";
  title: string;
  url: string;
}

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  proficiencyLevel: string;
  chapters: Chapter[];
}

const CourseView = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState<string>("");

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock course data
        const mockCourse: Course = {
          id: "1",
          title: "Introduction to Machine Learning",
          description: "A comprehensive guide to understanding machine learning concepts and applications.",
          proficiencyLevel: "Beginner",
          chapters: [
            {
              id: "chapter1",
              title: "What is Machine Learning?",
              content: `
                <h2>Introduction to Machine Learning Concepts</h2>
                <p>Machine learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.</p>
                
                <p>The core concept behind machine learning is that systems can learn from data, identify patterns, and make decisions with minimal human intervention.</p>
                
                <h3>Key Components of Machine Learning</h3>
                <ul>
                  <li><strong>Data:</strong> The foundation of any machine learning model.</li>
                  <li><strong>Algorithm:</strong> The procedure used for data processing and pattern recognition.</li>
                  <li><strong>Model:</strong> The output of the algorithm that makes predictions or decisions.</li>
                  <li><strong>Training:</strong> The process of teaching the model using data.</li>
                  <li><strong>Inference:</strong> Using the trained model to make predictions on new data.</li>
                </ul>
                
                <h3>Types of Machine Learning</h3>
                <p>Machine learning can be categorized into three main types:</p>
                
                <h4>1. Supervised Learning</h4>
                <p>In supervised learning, the algorithm is trained on labeled data. The model learns to map inputs to outputs based on example input-output pairs. Examples include:</p>
                <ul>
                  <li>Classification problems (e.g., spam detection)</li>
                  <li>Regression problems (e.g., house price prediction)</li>
                </ul>
                
                <h4>2. Unsupervised Learning</h4>
                <p>In unsupervised learning, the algorithm works with unlabeled data, finding patterns and relationships without guidance. Examples include:</p>
                <ul>
                  <li>Clustering (e.g., customer segmentation)</li>
                  <li>Dimensionality reduction (e.g., feature extraction)</li>
                </ul>
                
                <h4>3. Reinforcement Learning</h4>
                <p>In reinforcement learning, the algorithm learns by interacting with an environment and receiving rewards or penalties. Examples include:</p>
                <ul>
                  <li>Game playing agents</li>
                  <li>Autonomous vehicles</li>
                  <li>Robotics control systems</li>
                </ul>
              `,
              completed: true,
              resources: [
                {
                  id: "r1",
                  type: "article",
                  title: "A Beginner's Guide to Machine Learning",
                  url: "https://example.com/ml-guide"
                },
                {
                  id: "r2",
                  type: "video",
                  title: "Machine Learning Fundamentals",
                  url: "https://example.com/ml-video"
                }
              ],
              quiz: [
                {
                  question: "What is the primary goal of machine learning?",
                  options: [
                    "To replace human intelligence",
                    "To enable systems to learn from data automatically",
                    "To create perfect algorithms",
                    "To generate big data"
                  ],
                  correctAnswer: 1
                },
                {
                  question: "Which type of learning uses labeled data?",
                  options: [
                    "Unsupervised learning",
                    "Supervised learning",
                    "Reinforcement learning",
                    "Transfer learning"
                  ],
                  correctAnswer: 1
                }
              ]
            },
            {
              id: "chapter2",
              title: "Supervised Learning Algorithms",
              content: `
                <h2>Supervised Learning Algorithms</h2>
                
                <p>Supervised learning is the most common type of machine learning, where models are trained using labeled data. In this chapter, we'll explore the fundamental algorithms used in supervised learning.</p>
                
                <h3>Linear Regression</h3>
                
                <p>Linear regression is one of the simplest and most widely used algorithms for predictive analysis. It's used to predict a continuous value by finding the best linear relationship between the dependent and independent variables.</p>
                
                <p>The basic form of linear regression is:</p>
                <pre>y = mx + b</pre>
                <p>where:</p>
                <ul>
                  <li>y is the dependent variable (what we're trying to predict)</li>
                  <li>x is the independent variable (the feature)</li>
                  <li>m is the slope of the line</li>
                  <li>b is the y-intercept</li>
                </ul>
                
                <h3>Logistic Regression</h3>
                
                <p>Despite its name, logistic regression is actually a classification algorithm, not a regression algorithm. It estimates the probability that an instance belongs to a particular class.</p>
                
                <p>The logistic function (sigmoid) transforms any value into the range of 0 to 1:</p>
                <pre>p = 1 / (1 + e^(-z))</pre>
                <p>where z is the linear function of input features.</p>
                
                <h3>Decision Trees</h3>
                
                <p>Decision trees are versatile algorithms that can perform both classification and regression tasks. They work by recursively splitting the data based on feature values to create a tree-like model of decisions.</p>
                
                <p>Key components of decision trees include:</p>
                <ul>
                  <li><strong>Root Node:</strong> Represents the entire population</li>
                  <li><strong>Decision Nodes:</strong> Where the population is split</li>
                  <li><strong>Leaf Nodes:</strong> Final output or decision</li>
                  <li><strong>Branches:</strong> Connections between nodes</li>
                </ul>
                
                <h3>Support Vector Machines (SVM)</h3>
                
                <p>SVMs are powerful classification algorithms that find the optimal hyperplane that best separates different classes. They work well with both linear and non-linear data through the use of kernel functions.</p>
                
                <p>The key idea behind SVMs is to find the hyperplane that maximizes the margin between the classes.</p>
                
                <h3>K-Nearest Neighbors (KNN)</h3>
                
                <p>KNN is a simple, instance-based learning algorithm that stores all available cases and classifies new cases based on similarity measures (e.g., distance functions).</p>
                
                <p>The algorithm works as follows:</p>
                <ol>
                  <li>Choose a value for K (the number of neighbors)</li>
                  <li>Calculate the distance between the query instance and all training samples</li>
                  <li>Sort the distances and determine the K-nearest neighbors</li>
                  <li>For classification: take a majority vote of the K neighbors</li>
                  <li>For regression: take the average of the K neighbors</li>
                </ol>
              `,
              completed: false,
              resources: [
                {
                  id: "r3",
                  type: "article",
                  title: "Understanding Supervised Learning",
                  url: "https://example.com/supervised-learning"
                }
              ]
            },
            {
              id: "chapter3",
              title: "Unsupervised Learning Techniques",
              content: `
                <h2>Unsupervised Learning Techniques</h2>
                
                <p>Unsupervised learning is a type of machine learning where algorithms are used to identify patterns in data sets containing data points that are neither classified nor labeled. These algorithms discover hidden patterns or groupings without the need for human intervention.</p>
                
                <h3>Clustering Algorithms</h3>
                
                <h4>1. K-Means Clustering</h4>
                <p>K-Means is one of the simplest and most popular unsupervised learning algorithms. It works by:</p>
                <ol>
                  <li>Selecting K initial centroids (K is specified by the user)</li>
                  <li>Assigning each data point to its nearest centroid</li>
                  <li>Recomputing centroids based on current cluster memberships</li>
                  <li>Repeating steps 2-3 until convergence</li>
                </ol>
                
                <p>The algorithm aims to minimize the sum of squared distances between data points and their assigned centroids.</p>
                
                <h4>2. Hierarchical Clustering</h4>
                <p>Hierarchical clustering creates a tree of clusters, also known as a dendrogram. There are two types:</p>
                <ul>
                  <li><strong>Agglomerative:</strong> Bottom-up approach where each observation starts in its own cluster, and pairs of clusters are merged as one moves up the hierarchy.</li>
                  <li><strong>Divisive:</strong> Top-down approach where all observations start in one cluster, and splits are performed recursively as one moves down the hierarchy.</li>
                </ul>
                
                <h4>3. DBSCAN (Density-Based Spatial Clustering of Applications with Noise)</h4>
                <p>DBSCAN groups together points that are closely packed in a high-density region, marking points in low-density regions as outliers. Unlike K-means, it doesn't require specifying the number of clusters beforehand.</p>
                
                <h3>Dimensionality Reduction</h3>
                
                <h4>1. Principal Component Analysis (PCA)</h4>
                <p>PCA is a technique used to reduce the dimensionality of large data sets by transforming a large set of variables into a smaller one that still contains most of the information in the original set.</p>
                
                <p>It works by finding the principal components, which are the directions of maximum variance in the data.</p>
                
                <h4>2. t-SNE (t-Distributed Stochastic Neighbor Embedding)</h4>
                <p>t-SNE is particularly well suited for visualizing high-dimensional data in a space of two or three dimensions. It models each high-dimensional object by a two- or three-dimensional point in such a way that similar objects are modeled by nearby points and dissimilar objects are modeled by distant points.</p>
                
                <h3>Anomaly Detection</h3>
                
                <p>Anomaly detection is the identification of rare items, events, or observations which raise suspicions by differing significantly from the majority of the data.</p>
                
                <p>Common techniques include:</p>
                <ul>
                  <li>Isolation Forest</li>
                  <li>One-class SVM</li>
                  <li>Autoencoders</li>
                </ul>
                
                <h3>Association Rule Learning</h3>
                
                <p>Association rule learning is a method for discovering interesting relations between variables in large databases.</p>
                
                <p>The most popular algorithm is Apriori, which is used in market basket analysis to discover relationships between products that are frequently purchased together.</p>
              `,
              completed: false,
              resources: [
                {
                  id: "r4",
                  type: "video",
                  title: "Unsupervised Learning Explained",
                  url: "https://example.com/unsupervised-learning"
                },
                {
                  id: "r5",
                  type: "article",
                  title: "Clustering Algorithms Comparison",
                  url: "https://example.com/clustering-comparison"
                }
              ]
            }
          ]
        };
        
        setCourse(mockCourse);
        setActiveChapter(mockCourse.chapters[0].id);
      } catch (error) {
        toast({
          title: "Error Loading Course",
          description: "Could not load the course content. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, toast]);

  const toggleChapterCompletion = (chapterId: string) => {
    if (!course) return;
    
    setCourse({
      ...course,
      chapters: course.chapters.map(chapter => 
        chapter.id === chapterId 
          ? { ...chapter, completed: !chapter.completed } 
          : chapter
      )
    });
  };

  const calculateProgress = (): number => {
    if (!course) return 0;
    
    const completedChapters = course.chapters.filter(chapter => chapter.completed).length;
    return Math.round((completedChapters / course.chapters.length) * 100);
  };

  // Get the current chapter
  const currentChapter = course?.chapters.find(chapter => chapter.id === activeChapter);

  // Redirect if not authenticated
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading your course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
            <p className="text-lg text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/dashboard">Return to Dashboard</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
              {course.proficiencyLevel}
            </div>
            
            <div className="flex items-center">
              <div className="w-full sm:w-48 mr-3">
                <Progress value={calculateProgress()} className="h-2" />
              </div>
              <span className="text-sm font-medium">{calculateProgress()}% Complete</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with chapter navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-bold text-lg mb-4">Chapters</h2>
              <div className="space-y-1">
                {course.chapters.map((chapter, index) => (
                  <div 
                    key={chapter.id} 
                    className={`flex items-center gap-3 rounded-md p-2 cursor-pointer transition-colors ${
                      activeChapter === chapter.id ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveChapter(chapter.id)}
                  >
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${activeChapter === chapter.id ? "text-white" : ""}`}>
                        {chapter.title}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {chapter.completed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${activeChapter === chapter.id ? "text-white" : "text-green-500"}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${activeChapter === chapter.id ? "text-white" : "text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3">
            {currentChapter && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-bold">{currentChapter.title}</h2>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="chapter-complete" 
                      checked={currentChapter.completed}
                      onCheckedChange={() => toggleChapterCompletion(currentChapter.id)}
                    />
                    <label htmlFor="chapter-complete" className="text-sm">
                      Mark as complete
                    </label>
                  </div>
                </div>
                
                <Tabs defaultValue="content" className="w-full">
                  <div className="px-6 border-b">
                    <TabsList className="justify-start -mb-px">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      {currentChapter.resources.length > 0 && (
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                      )}
                      {currentChapter.quiz && currentChapter.quiz.length > 0 && (
                        <TabsTrigger value="assessment">Assessment</TabsTrigger>
                      )}
                    </TabsList>
                  </div>
                  
                  <TabsContent value="content" className="p-6">
                    <div 
                      className="prose max-w-none" 
                      dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="resources" className="p-6">
                    <h3 className="text-lg font-medium mb-4">Additional Resources</h3>
                    <div className="grid gap-4">
                      {currentChapter.resources.map(resource => (
                        <Card key={resource.id}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {resource.type === "article" && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {resource.type === "video" && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                    <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                  </svg>
                                )}
                                <span className="text-sm font-medium capitalize">{resource.type}</span>
                              </div>
                              <h4 className="font-medium">{resource.title}</h4>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="assessment" className="p-6">
                    <h3 className="text-lg font-medium mb-4">Chapter Assessment</h3>
                    {currentChapter.quiz && (
                      <div className="space-y-8">
                        {currentChapter.quiz.map((quiz, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">
                              Question {index + 1}: {quiz.question}
                            </h4>
                            <div className="space-y-2">
                              {quiz.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    name={`quiz-${index}`} 
                                    id={`quiz-${index}-${optionIndex}`}
                                    value={optionIndex} 
                                  />
                                  <label htmlFor={`quiz-${index}-${optionIndex}`}>{option}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <Button>Check Answers</Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
