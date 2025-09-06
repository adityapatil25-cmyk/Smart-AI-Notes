import React from 'react';
import { 
  Search, 
  Tag, 
  Filter,
  X,
  Download,
  BarChart3
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';

const Sidebar = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedTag, 
  setSelectedTag, 
  isOpen, 
  onClose 
}) => {
  const { stats, exportAllNotesPDF, notes } = useNotes();

  // Get all unique tags from notes
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))].sort();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
  };

  const handleExportAll = () => {
    exportAllNotesPDF();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col h-screen lg:h-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters & Stats
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Notes
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search in title, content, tags..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Tag
            </label>
            {allTags.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedTag === tag
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent'
                    }`}
                  >
                    <Tag className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{tag}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No tags available
              </p>
            )}
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedTag) && (
            <button
              onClick={handleClearFilters}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          )}

          {/* Statistics */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <BarChart3 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Statistics
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Notes
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stats.totalNotes}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Summarized
                </span>
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {stats.totalSummarized}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Pinned
                </span>
                <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  {stats.pinnedNotes}
                </span>
              </div>
            </div>
          </div>

          {/* Most Used Tags */}
          {stats.mostUsedTags && stats.mostUsedTags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Most Used Tags
              </h3>
              <div className="space-y-2">
                {stats.mostUsedTags.slice(0, 5).map((tag) => (
                  <div
                    key={tag.name}
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <button
                      onClick={() => handleTagSelect(tag.name)}
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 truncate flex-1 text-left"
                    >
                      #{tag.name}
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {tag.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Export All */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleExportAll}
            className="flex items-center justify-center w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export All Notes
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;