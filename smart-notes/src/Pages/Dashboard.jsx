import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  StickyNote,
  Sparkles,
  Pin,
  BarChart3
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { 
    notes, 
    loading, 
    error, 
    stats, 
    fetchNotes, 
    fetchStats,
    filters,
    setFilters 
  } = useNotes();

  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedTag, setSelectedTag] = useState(filters.tag || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Debounced search function
  const performSearch = useCallback((search, tag) => {
    setFilters({ search, tag });
    fetchNotes(search, tag);
  }, [setFilters, fetchNotes]);

  // Debounce search with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery, selectedTag);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag, performSearch]);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchNotes();
    fetchStats();
  }, [fetchNotes, fetchStats]);

  const pinnedNotes = notes.filter(note => note.isPinned);
  const regularNotes = notes.filter(note => !note.isPinned);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <StickyNote className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notes</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {searchQuery || selectedTag 
          ? 'No notes match your current filters.' 
          : 'Get started by creating your first note.'
        }
      </p>
      <div className="mt-6">
        <Link
          to="/note/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          New Note
        </Link>
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
        >
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
          <div className="flex space-x-2 mt-4">
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                  </h1>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Manage your notes and thoughts in one place
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </button>

                  {/* New Note Button */}
                  <Link
                    to="/note/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Note
                  </Link>
                </div>
              </div>

              {/* Active Filters */}
              {(searchQuery || selectedTag) && (
                <div className="mt-4 flex items-center space-x-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Active filters:</span>
                  {searchQuery && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      <Search className="h-3 w-3 mr-1" />
                      "{searchQuery}"
                    </span>
                  )}
                  {selectedTag && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      #{selectedTag}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={StickyNote}
                title="Total Notes"
                value={stats.totalNotes}
                color="bg-blue-500"
              />
              <StatCard
                icon={Sparkles}
                title="AI Summarized"
                value={stats.totalSummarized}
                color="bg-purple-500"
              />
              <StatCard
                icon={Pin}
                title="Pinned Notes"
                value={stats.pinnedNotes}
                color="bg-yellow-500"
              />
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && <LoadingState />}

            {/* Content */}
            {!loading && (
              <>
                {notes.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-8">
                    {/* Pinned Notes */}
                    {pinnedNotes.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <Pin className="h-5 w-5 text-yellow-500" fill="currentColor" />
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Pinned Notes
                          </h2>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({pinnedNotes.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {pinnedNotes.map((note) => (
                            <NoteCard key={note._id} note={note} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regular Notes */}
                    {regularNotes.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <StickyNote className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {pinnedNotes.length > 0 ? 'Other Notes' : 'All Notes'}
                          </h2>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({regularNotes.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {regularNotes.map((note) => (
                            <NoteCard key={note._id} note={note} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;