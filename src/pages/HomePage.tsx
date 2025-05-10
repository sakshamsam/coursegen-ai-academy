
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-coursegen-blue to-coursegen-purple py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Generate Personalized Courses in Minutes
            </h1>
            <p className="text-xl opacity-90 mb-8">
              CourseGen leverages AI to create custom-tailored courses based on your specific needs, 
              proficiency level, and learning goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-coursegen-purple hover:bg-gray-100"
                asChild
              >
                <Link to="/register">Get Started</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CourseGen?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-coursegen-blue/20 text-coursegen-blue flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2h11A2.5 2.5 0 0 1 20 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19.5z"></path>
                  <path d="M8 7h8"></path>
                  <path d="M8 11h8"></path>
                  <path d="M8 15h5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">
                Courses tailored to your specific requirements, proficiency level, and learning goals.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-coursegen-purple/20 text-coursegen-purple flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
                  <path d="M6 12h6"></path>
                  <path d="M12 16V8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-gray-600">
                Generate complete course structures in minutes instead of spending hours searching for content.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-coursegen-blue/20 text-coursegen-blue flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
              <p className="text-gray-600">
                Learn at your own pace with modular course content that adapts to your schedule.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="hidden md:block absolute top-0 left-[calc(50%-1px)] h-full w-0.5 bg-gray-200"></div>
              
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0">
                    <div className="flex md:justify-end">
                      <div className="bg-white p-6 rounded-lg shadow-sm max-w-sm">
                        <h3 className="text-xl font-semibold mb-2">1. Tell Us What You Want to Learn</h3>
                        <p className="text-gray-600">
                          Provide details about your topic of interest, current knowledge level, and learning goals.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="z-10 w-10 h-10 flex items-center justify-center rounded-full bg-coursegen-blue text-white font-bold">1</div>
                  <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
                  <div className="z-10 w-10 h-10 flex items-center justify-center rounded-full bg-coursegen-purple text-white font-bold">2</div>
                  <div className="md:w-1/2 md:pl-12 mb-4 md:mb-0">
                    <div className="flex md:justify-start">
                      <div className="bg-white p-6 rounded-lg shadow-sm max-w-sm">
                        <h3 className="text-xl font-semibold mb-2">2. AI Generates Your Course</h3>
                        <p className="text-gray-600">
                          Our AI analyzes your requirements and creates a personalized course structure with relevant content.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 mb-4 md:mb-0">
                    <div className="flex md:justify-end">
                      <div className="bg-white p-6 rounded-lg shadow-sm max-w-sm">
                        <h3 className="text-xl font-semibold mb-2">3. Start Learning</h3>
                        <p className="text-gray-600">
                          Access your course immediately and track your progress as you complete each module.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="z-10 w-10 h-10 flex items-center justify-center rounded-full bg-coursegen-blue text-white font-bold">3</div>
                  <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-coursegen-blue to-coursegen-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Create your personalized learning experience today with CourseGen's AI-powered platform.
          </p>
          <Button
            size="lg"
            className="bg-white text-coursegen-purple hover:bg-gray-100"
            asChild
          >
            <Link to="/register">Create Your First Course</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">CourseGen</h2>
              <p className="max-w-xs text-gray-400">
                AI-powered personalized course generation platform for effective learning.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white">Register</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} CourseGen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
