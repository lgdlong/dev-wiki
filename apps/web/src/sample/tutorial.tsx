import React from 'react';
import { Clock, User, MessageCircle, ChevronUp, ChevronDown, Reply } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Global Navigation */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-semibold text-black">Logo</div>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-zinc-600 hover:text-black transition-colors text-sm">Docs</a>
                <a href="#" className="text-zinc-600 hover:text-black transition-colors text-sm">Tutorials</a>
                <a href="#" className="text-zinc-600 hover:text-black transition-colors text-sm">Blog</a>
                <a href="#" className="text-zinc-600 hover:text-black transition-colors text-sm">Community</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-zinc-600 hover:text-black transition-colors text-sm">Sign in</button>
              <button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-zinc-800 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-6 leading-tight">
            Building Modern React Applications with TypeScript and Tailwind CSS
          </h1>

          {/* Meta Info Row */}
          <div className="flex items-center space-x-6 text-sm text-zinc-600 mb-8">
            <div className="flex items-center space-x-2">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face"
                alt="Author"
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-black">Sarah Johnson</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>March 15, 2024</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>8 min read</span>
            </div>
            <div className="flex space-x-2">
              <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded-md text-xs font-medium">React</span>
              <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded-md text-xs font-medium">TypeScript</span>
              <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded-md text-xs font-medium">Tailwind</span>
            </div>
          </div>
        </header>

        {/* Table of Contents */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-semibold text-black mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#introduction" className="block text-zinc-700 hover:text-black transition-colors">1. Introduction</a>
            <a href="#setup" className="block text-zinc-700 hover:text-black transition-colors">2. Setting Up the Development Environment</a>
            <a href="#components" className="block text-zinc-700 hover:text-black transition-colors">3. Creating Reusable Components</a>
            <div className="pl-4 space-y-1">
              <a href="#props" className="block text-zinc-600 hover:text-black transition-colors text-sm">3.1 Props and TypeScript</a>
              <a href="#styling" className="block text-zinc-600 hover:text-black transition-colors text-sm">3.2 Styling with Tailwind</a>
            </div>
            <a href="#state" className="block text-zinc-700 hover:text-black transition-colors">4. State Management Patterns</a>
            <a href="#deployment" className="block text-zinc-700 hover:text-black transition-colors">5. Deployment Strategies</a>
            <a href="#conclusion" className="block text-zinc-700 hover:text-black transition-colors">6. Conclusion</a>
          </nav>
        </div>

        {/* Main Content Area */}
        <article className="max-w-3xl mx-auto">
          <div className="prose prose-zinc max-w-none">
            {/* Introduction Section */}
            <section id="introduction" className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-4">Introduction</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Modern web development has evolved significantly in recent years, with React becoming one of the most popular frameworks for building user interfaces. When combined with TypeScript for type safety and Tailwind CSS for utility-first styling, developers can create robust, maintainable applications with confidence.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                In this comprehensive tutorial, we'll walk through the process of setting up a modern React application that leverages the power of TypeScript and the flexibility of Tailwind CSS. You'll learn best practices, common patterns, and how to structure your code for scalability.
              </p>
            </section>

            {/* Setup Section */}
            <section id="setup" className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-4">Setting Up the Development Environment</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Before we start building, we need to set up our development environment. We'll use Vite as our build tool because of its speed and excellent TypeScript support.
              </p>

              {/* Code Block */}
              <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg mb-6 overflow-x-auto">
                <code className="text-sm font-mono">
                  <div className="text-zinc-400"># Create a new Vite project with React and TypeScript</div>
                  <div className="text-green-400">npm create vite@latest my-app -- --template react-ts</div>
                  <div className="text-green-400">cd my-app</div>
                  <div className="text-green-400">npm install</div>
                  <div className="text-zinc-400 mt-2"># Install Tailwind CSS</div>
                  <div className="text-green-400">npm install -D tailwindcss postcss autoprefixer</div>
                  <div className="text-green-400">npx tailwindcss init -p</div>
                </code>
              </div>

              <p className="text-zinc-700 leading-relaxed mb-6">
                Once you've run these commands, you'll have a fresh React project with TypeScript configured and ready to go. The next step is to configure Tailwind CSS by updating your <code className="bg-zinc-100 text-zinc-800 px-2 py-1 rounded text-sm">tailwind.config.js</code> file.
              </p>
            </section>

            {/* Image with Caption */}
            <figure className="mb-12">
              <img
                src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
                alt="Development environment setup"
                className="w-full rounded-lg border border-zinc-200"
              />
              <figcaption className="text-center text-sm text-zinc-600 mt-3">
                A typical development environment with multiple terminal windows and code editor
              </figcaption>
            </figure>

            {/* Components Section */}
            <section id="components" className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-4">Creating Reusable Components</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                One of the key benefits of React is the ability to create reusable components. With TypeScript, we can make these components even more robust by defining clear interfaces for props.
              </p>

              <h3 id="props" className="text-xl font-semibold text-black mb-3">Props and TypeScript</h3>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Here's an example of how to create a properly typed button component:
              </p>

              {/* Code Block */}
              <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg mb-6 overflow-x-auto">
                <code className="text-sm font-mono">
                  <div><span className="text-blue-400">interface</span> <span className="text-yellow-400">ButtonProps</span> &#123;</div>
                  <div className="pl-4">
                    <span className="text-green-400">children</span>: <span className="text-blue-400">React.ReactNode</span>;
                  </div>
                  <div className="pl-4">
                    <span className="text-green-400">variant</span>?: <span className="text-orange-400">'primary'</span> | <span className="text-orange-400">'secondary'</span>;
                  </div>
                  <div className="pl-4">
                    <span className="text-green-400">onClick</span>?: () =&gt; <span className="text-blue-400">void</span>;
                  </div>
                  <div>&#125;</div>
                  <div className="mt-2">
                    <span className="text-blue-400">export</span> <span className="text-blue-400">const</span> <span className="text-yellow-400">Button</span>: <span className="text-blue-400">React.FC</span>&lt;<span className="text-yellow-400">ButtonProps</span>&gt; = (&#123; children, variant = <span className="text-orange-400">'primary'</span>, onClick &#125;) =&gt; &#123;
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">const</span> baseClasses = <span className="text-orange-400">'px-4 py-2 rounded-md font-medium'</span>;
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">const</span> variantClasses = variant === <span className="text-orange-400">'primary'</span> ? <span className="text-orange-400">'bg-black text-white'</span> : <span className="text-orange-400">'bg-zinc-100 text-zinc-900'</span>;
                  </div>
                  <div className="pl-4 mt-2">
                    <span className="text-blue-400">return</span> (
                  </div>
                  <div className="pl-8">
                    &lt;<span className="text-red-400">button</span> <span className="text-green-400">className</span>=&#123;`$&#123;baseClasses&#125; $&#123;variantClasses&#125;`&#125; <span className="text-green-400">onClick</span>=&#123;onClick&#125;&gt;
                  </div>
                  <div className="pl-12">
                    &#123;children&#125;
                  </div>
                  <div className="pl-8">
                    &lt;/<span className="text-red-400">button</span>&gt;
                  </div>
                  <div className="pl-4">
                    );
                  </div>
                  <div>&#125;;</div>
                </code>
              </div>
            </section>

            {/* YouTube Video Embed */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-4">Video Tutorial</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Watch this comprehensive video tutorial to see these concepts in action:
              </p>

              {/* YouTube Video Card */}
              <div className="bg-white border border-zinc-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex space-x-4">
                  {/* Video Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-48 h-27 bg-zinc-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <img
                        src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=192&h=108&fit=crop"
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                      {/* Duration badge */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        15:32
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black text-base leading-tight mb-2 line-clamp-2">
                      Building Modern React Apps: A Complete TypeScript and Tailwind CSS Guide
                    </h3>
                    <p className="text-zinc-600 text-sm mb-3">
                      React Mastery Channel
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-medium">React</span>
                      <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-medium">TypeScript</span>
                      <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-medium">Tutorial</span>
                      <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-medium">Web Dev</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* More content sections would continue here... */}
            <section id="conclusion" className="mb-12">
              <h2 className="text-2xl font-semibold text-black mb-4">Conclusion</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                We've covered the fundamentals of building modern React applications with TypeScript and Tailwind CSS. These tools work together to provide a powerful development experience that scales with your project's needs.
              </p>
              <p className="text-zinc-700 leading-relaxed">
                As you continue your journey, remember that the key to success is consistent practice and staying up to date with the evolving ecosystem. Happy coding!
              </p>
            </section>
          </div>
        </article>

        {/* Comments Section */}
        <section className="max-w-3xl mx-auto mt-16 border-t border-zinc-200 pt-12">
          <h2 className="text-2xl font-semibold text-black mb-8">Comments</h2>

          {/* Comment Thread */}
          <div className="space-y-8">
            {/* Comment 1 */}
            <div className="flex space-x-4">
              <img
                src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face"
                alt="User avatar"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-black">Alex Chen</span>
                  <span className="text-zinc-500 text-sm">2 hours ago</span>
                </div>
                <p className="text-zinc-700 leading-relaxed mb-3">
                  Great tutorial! The TypeScript integration examples were particularly helpful. I've been struggling with proper prop typing and this cleared up a lot of confusion.
                </p>
                <div className="flex items-center space-x-4 text-sm text-zinc-600">
                  <button className="flex items-center space-x-1 hover:text-black transition-colors">
                    <ChevronUp className="w-4 h-4" />
                    <span>12</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-black transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="flex items-center space-x-1 hover:text-black transition-colors">
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Reply */}
                <div className="mt-6 ml-6 flex space-x-4">
                  <img
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face"
                    alt="Author avatar"
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-black">Sarah Johnson</span>
                      <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-xs font-medium">Author</span>
                      <span className="text-zinc-500 text-sm">1 hour ago</span>
                    </div>
                    <p className="text-zinc-700 leading-relaxed mb-3">
                      Thanks Alex! I'm glad the TypeScript examples were helpful. If you have any specific questions about advanced patterns, feel free to ask.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-zinc-600">
                      <button className="flex items-center space-x-1 hover:text-black transition-colors">
                        <ChevronUp className="w-4 h-4" />
                        <span>5</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-black transition-colors">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button className="flex items-center space-x-1 hover:text-black transition-colors">
                        <Reply className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment 2 */}
            <div className="flex space-x-4">
              <img
                src="https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face"
                alt="User avatar"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-black">Maria Rodriguez</span>
                  <span className="text-zinc-500 text-sm">4 hours ago</span>
                </div>
                <p className="text-zinc-700 leading-relaxed mb-3">
                  Would love to see a follow-up tutorial on testing these TypeScript React components. Any recommendations for testing libraries?
                </p>
                <div className="flex items-center space-x-4 text-sm text-zinc-600">
                  <button className="flex items-center space-x-1 hover:text-black transition-colors">
                    <ChevronUp className="w-4 h-4" />
                    <span>8</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-black transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="flex items-center space-x-1 hover:text-black transition-colors">
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Form */}
          <div className="mt-8 pt-6 border-t border-zinc-200">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-zinc-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <textarea
                  placeholder="Add a comment..."
                  className="w-full p-3 border border-zinc-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                ></textarea>
                <div className="flex justify-end mt-3">
                  <button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-zinc-800 transition-colors">
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;