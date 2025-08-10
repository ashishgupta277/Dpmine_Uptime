
"use client";

import { useWebsites } from '../../hooks/useWebsite';
import axios from 'axios';
import { API_BACKEND_URL } from '@/config';
import { useAuth } from '@clerk/nextjs';
import { deleteWebsite } from "../../hooks/useWebsite";
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Globe, Clock, Activity, Plus, Moon, Sun } from 'lucide-react';

interface ProcessedWebsite {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'degraded';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  uptimeHistory: ('up' | 'down' | 'degraded')[];
  
}

// Function to aggregate ticks into 3-minute windows
const aggregateTicksIntoWindows = (ticks: any[]): ('up' | 'down' | 'degraded')[] => {
  if (!ticks || ticks.length === 0) return Array(10).fill('degraded');

  const sortedTicks = [...ticks].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const windows: ('up' | 'down' | 'degraded')[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const windowEnd = new Date(now.getTime() - i * 3 * 60 * 1000);
    const windowStart = new Date(windowEnd.getTime() - 3 * 60 * 1000);

    const windowTicks = sortedTicks.filter(tick => {
      const tickTime = new Date(tick.createdAt);
      return tickTime >= windowStart && tickTime < windowEnd;
    });

    let windowStatus: 'up' | 'down' | 'degraded' = 'up';

    if (windowTicks.length === 0) {
      windowStatus = 'degraded';
    } else {
      const hasDown = windowTicks.some(tick =>
        ['down', 'error', 'Bad'].includes(tick.status)
      );
      const hasDegraded = windowTicks.some(tick => tick.latency > 1000);

      if (hasDown) {
        windowStatus = 'down';
      } else if (hasDegraded) {
        windowStatus = 'degraded';
      }
    }

    windows.push(windowStatus);
  }

  return windows;
};


// Function to process website data
const processWebsiteData = (websites: any[]): ProcessedWebsite[] => {
  return websites.map(website => {
    const ticks = website.ticks || [];
    const uptimeHistory = aggregateTicksIntoWindows(ticks);
    
    // Calculate current status based on latest tick
    let currentStatus: 'up' | 'down' | 'degraded' = 'up';
    let responseTime = 0;
    let lastChecked = 'Never';
    
    if (ticks.length > 0) {
      const latestTick = ticks.reduce((latest: any, tick: any) => 
        new Date(tick.createdAt) > new Date(latest.createdAt) ? tick : latest
      );
      
      responseTime = latestTick.latency || 0;
      lastChecked = new Date(latestTick.createdAt).toLocaleString();
      
      if (latestTick.status === 'down' || latestTick.status === 'error' || latestTick.status === 'Bad') {
        currentStatus = 'down';
        responseTime = 0;
      } else if (latestTick.latency > 1000) {
        currentStatus = 'degraded';
      }
    }
    
    // Calculate uptime percentage
    const upTicks = ticks.filter((tick: any) => 
      tick.status === 'up' || tick.status === 'Good' || (tick.status !== 'down' && tick.status !== 'error' && tick.status !== 'Bad')
    ).length;
    const uptime = ticks.length > 0 ? (upTicks / ticks.length) * 100 : 100;
    
    // Extract website name from URL if not provided
    const name = website.name || new URL(website.url).hostname;
    
    return {
      id: website.id,
      name,
      url: website.url,
      status: currentStatus,
      uptime: Math.round(uptime * 10) / 10,
      responseTime,
      lastChecked,
      uptimeHistory
    };
  });
};

const StatusCircle: React.FC<{ status: 'up' | 'down' | 'degraded' }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'up': return 'bg-green-500';
      case 'down': return 'bg-red-500';
      case 'degraded': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
  );
};

const StatusBadge: React.FC<{ status: 'up' | 'down' | 'degraded' }> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'up': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'down': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      case 'degraded': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'up': return 'Operational';
      case 'down': return 'Down';
      case 'degraded': return 'Degraded';
      default: return 'Unknown';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusStyles()}`}>
      {getStatusText()}
    </span>
  );
};

const UptimeTicks: React.FC<{ history: ('up' | 'down' | 'degraded')[] }> = ({ history }) => {
  return (
    <div className="flex gap-1">
      {history.map((status, index) => {
        const getColor = () => {
          switch (status) {
            case 'up': return 'bg-green-500';
            case 'down': return 'bg-red-500';
            case 'degraded': return 'bg-yellow-500';
            default: return 'bg-gray-400';
          }
        };

        return (
          <div
            key={index}
            className={`w-6 h-8 rounded-sm ${getColor()}`}
            title={`${(10 - index) * 3} minutes ago: ${status}`}
          />
        );
      })}
    </div>
  );
};


const WebsiteCard: React.FC<{ website: ProcessedWebsite }> = ({ website}) => {
  const [isExpanded, setIsExpanded] = useState(false);
//    const { getToken } = useAuth(); 
//   const handleDelete = async (websiteId: string) => {
//   try {
//     const token = await getToken();
//     await deleteWebsite(websiteId, token!);
//   // 👈 notify parent
//   } catch (error) {
//     console.error("Error deleting website:", error);
//   }
// };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <StatusCircle status={website.status} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{website.name}</h3>
                <StatusBadge status={website.status} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {website.url}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{website.uptime}% uptime</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {website.status === 'down' ? 'Timeout' : `${website.responseTime}ms`}
              </p>
            </div>
          </div>
          <div className="ml-4 text-gray-400 dark:text-gray-500">
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Last 30 minutes (3-minute intervals)
              </h4>
              <UptimeTicks history={website.uptimeHistory} />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Each bar represents a 3-minute interval. Green = up, Red = down, Yellow = degraded
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Time</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {website.status === 'down' ? 'Timeout' : `${website.responseTime}ms`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Uptime</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{website.uptime}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Checked</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {website.lastChecked}
                </p>
                {/* <button
           onClick={() => handleDelete(website.id)}
        className="mt-2 text-sm text-red-600 hover:text-red-800 transition"
>
  Delete
</button> */}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CreateWebsiteModal: React.FC<{ isOpen: boolean; onClose: (url : string | null) => void }> = ({ isOpen, onClose }) => {
  const [url, seturl] = useState({
    name: '',
    url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Creating website:', url);
    onClose(url.url);
    seturl({ name: '', url: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Website</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={url.name}
                onChange={(e) => seturl({ ...url, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="My Website"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
              </label>
              <input
                type="url"
                value={url.url}
                onChange={(e) => seturl({ ...url, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                 onClick={() => onClose(url.url)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150"
              >
                Create Monitor
              </button>
              <button
                type="button"
                  onClick={() => onClose(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-md transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



function App() {
  const { websites: rawWebsites, refreshWebsites } = useWebsites();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { getToken } = useAuth();


  // Process the raw website data using useMemo for performance
  const websites = useMemo(() => processWebsiteData(rawWebsites), [rawWebsites]);

  const overallStatus = websites.every(site => site.status === 'up') ? 'up' : 
                       websites.some(site => site.status === 'down') ? 'down' : 'degraded';

  const activeIncidents = websites.filter(site => site.status !== 'up').length;

  // Apply dark mode to document
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Status Dashboard</h1>
              <div className="flex items-center gap-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {/* Create Button */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150"
                >
                  <Plus className="w-4 h-4" />
                  Add Monitor
                </button>

                {/* Overall Status */}
                <div className="flex items-center gap-3">
                  <StatusCircle status={overallStatus} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {overallStatus === 'up' ? 'All systems operational' : 
                     overallStatus === 'down' ? 'System issues detected' : 
                     'Some systems degraded'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span>{websites.length} services monitored</span>
              {activeIncidents > 0 && (
                <span className="text-red-600 dark:text-red-400 font-medium">
                  {activeIncidents} active incident{activeIncidents > 1 ? 's' : ''}
                </span>
              )}
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Website List */}
          <div className="space-y-4">
            {websites.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No websites monitored</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first website to monitor.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Monitor
                </button>
              </div>
            ) : (
              websites.map(website => (
                <WebsiteCard key={website.id} website={website}  />
                
              ))
            )}
          </div>

          {websites.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={refreshWebsites}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-150"
              >
                Refresh Data
              </button>
            </div>

          )}

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Monitoring dashboard • Updates every 60 seconds</p>
          </div>
        </div>

        {/* Create Website Modal */}
        <CreateWebsiteModal
        isOpen={isCreateModalOpen}
        onClose={async (url) => {
            if (url === null) {
                setIsCreateModalOpen(false);
                return;
            }

            const token = await getToken();
           setIsCreateModalOpen(false)
            axios.post(`${API_BACKEND_URL}/api/v1/website`, {
                url,
            }, {
                headers: {
                    Authorization: token,
                },
            })
            .then(() => {
                refreshWebsites();
            })
        }}
      />
      </div>
    </div>
  );
}

export default App;