"use client";
import React, { useState } from 'react';
import { 
  Monitor, 
  Shield, 
  Bell, 
  BarChart3, 
  Globe, 
  Zap, 
  Check, 
  ArrowRight,
  Menu,
  X,
  AlertCircle,
  Clock,
  Users,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function App() {
  
const router = useRouter();

  const features = [
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Real-time Monitoring",
      description: "Monitor your websites, APIs, and services 24/7 with checks every 30 seconds from global locations."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Instant Alerts",
      description: "Get notified immediately via email, SMS, Slack, or webhooks when your services go down."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Detailed Analytics",
      description: "View comprehensive uptime statistics, response times, and performance metrics over time."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Monitoring",
      description: "Check from 15+ locations worldwide to ensure your services are accessible everywhere."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "SSL Monitoring",
      description: "Monitor SSL certificate expiration and get alerts before certificates expire."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Status Pages",
      description: "Create beautiful public status pages to keep your customers informed during incidents."
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for personal projects and small websites",
      features: [
        "5 monitors",
        "5-minute checks",
        "Email alerts",
        "30-day history",
        "Basic status page"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$9",
      period: "/month",
      description: "Ideal for growing businesses and teams",
      features: [
        "50 monitors",
        "1-minute checks",
        "SMS + Email alerts",
        "1-year history",
        "Custom status pages",
        "API access",
        "Team collaboration"
      ],
      cta: "Start 14-day Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "/month",
      description: "Advanced monitoring for mission-critical services",
      features: [
        "Unlimited monitors",
        "30-second checks",
        "All alert channels",
        "Unlimited history",
        "White-label pages",
        "Priority support",
        "SLA reporting",
        "Advanced integrations"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO at TechFlow",
      content: "This platform has been a game-changer for our uptime monitoring. The alerts are instant and the analytics are incredibly detailed.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "DevOps Engineer",
      content: "Finally, an uptime monitoring service that just works. Setup was effortless and the status pages look amazing.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Product Manager",
      content: "The global monitoring locations give us confidence that our users worldwide are having a great experience.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Monitor Your Website
              <span className="text-blue-600 block">Uptime Like a Pro</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant alerts when your website goes down. Monitor from 15+ global locations 
              with 99.9% accuracy and detailed performance analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => router.push('/dashboard')}className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-500 hover:text-white transition-colors">
                Watch Demo
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">No credit card required • 14-day free trial</p>
          </div>

          {/* Hero Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center border border-gray-700">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime SLA</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center border border-gray-700">
              <div className="text-3xl font-bold text-green-600 mb-2">3 Minutes</div>
              <div className="text-gray-300">Check Frequency</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center border border-gray-700">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-300">Global Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need for Uptime Monitoring
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive monitoring tools designed to keep your services running smoothly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:bg-gray-750 border border-gray-700 hover:border-gray-600"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Thousands of Developers
            </h2>
            <p className="text-xl text-gray-300">See what our customers have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700">
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">Choose the plan that fits your monitoring needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  plan.popular ? 'ring-2 ring-blue-600 transform scale-105 bg-gray-800' : 'border border-gray-700 bg-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-300">{plan.period}</span>}
                  </div>
                  <p className="text-gray-300 mb-8">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Never Miss Downtime Again?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers who trust UptimeGuard to monitor their services
          </p>
          <button onClick={() => router.push('/dashboard')}className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
            Start Your Free Trial
          </button>
          <p className="text-blue-200 text-sm mt-4">14-day free trial • No setup fees • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">UptimeGuard</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Professional uptime monitoring for modern websites and applications.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 UptimeGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;