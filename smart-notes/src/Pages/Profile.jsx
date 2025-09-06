import React, { useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar,
  StickyNote,
  Sparkles,
  Pin,
  Download,
  BarChart3,
  Tag
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../context/NotesContext';

const Profile = () => {
  const { user } = useAuth();
  const { stats, fetchStats, exportAllNotesPDF } = useNotes();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const StatCard = ({ icon: Icon, title, value, description, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleExportAll = () => {
    exportAllNotesPDF();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your account and view your activity statistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              {/* Profile Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-full">
                    <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {user?.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Smart Notes User
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quick Actions
                </h3>
                <button
                  onClick={handleExportAll}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export All Notes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Overview Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>Overview Statistics</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard
                    icon={StickyNote}
                    title="Total Notes"
                    value={stats.totalNotes}
                    description="All your notes"
                    color="bg-blue-500"
                  />
                  <StatCard
                    icon={Sparkles}
                    title="AI Summarized"
                    value={stats.totalSummarized}
                    description="AI-powered summaries"
                    color="bg-purple-500"
                  />
                  <StatCard
                    icon={Pin}
                    title="Pinned Notes"
                    value={stats.pinnedNotes}
                    description="Important notes"
                    color="bg-yellow-500"
                  />
                </div>
              </div>

              {/* Most Used Tags */}
              {stats.mostUsedTags && stats.mostUsedTags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <span>Most Used Tags</span>
                  </h3>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <div className="space-y-3">
                      {stats.mostUsedTags.slice(0, 10).map((tag, index) => (
                        <div key={tag.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              #{tag.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {tag.count} {tag.count === 1 ? 'note' : 'notes'}
                            </span>
                            <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{
                                  width: `${(tag.count / stats.mostUsedTags[0].count) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {stats.mostUsedTags.length === 0 && (
                      <div className="text-center py-8">
                        <Tag className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tags yet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Start adding tags to your notes to see statistics here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activity Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Activity Summary
                </h3>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Summarization Rate
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width: stats.totalNotes > 0 
                                ? `${(stats.totalSummarized / stats.totalNotes) * 100}%` 
                                : '0%'
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {stats.totalNotes > 0 
                            ? `${Math.round((stats.totalSummarized / stats.totalNotes) * 100)}%`
                            : '0%'
                          }
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pin Rate
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-yellow-600 h-2 rounded-full"
                            style={{
                              width: stats.totalNotes > 0 
                                ? `${(stats.pinnedNotes / stats.totalNotes) * 100}%` 
                                : '0%'
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {stats.totalNotes > 0 
                            ? `${Math.round((stats.pinnedNotes / stats.totalNotes) * 100)}%`
                            : '0%'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;