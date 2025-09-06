import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Pin, 
  Edit, 
  Trash2, 
  Share2, 
  Download, 
  Sparkles, 
  Calendar,
  Tag,
  MoreVertical,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { toast } from 'react-toastify';

const NoteCard = ({ note }) => {
  const {
    deleteNote,
    togglePinNote,
    generateSummary,
    toggleShareNote,
    exportNotePDF,
  } = useNotes();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(note._id);
      setShowDropdown(false);
    }
  };

  const handleTogglePin = async () => {
    await togglePinNote(note._id);
    setShowDropdown(false);
  };

  const handleGenerateSummary = async () => {
    if (note.summary) {
      toast.info('This note already has a summary');
      return;
    }

    setIsGeneratingSummary(true);
    try {
      await generateSummary(note._id);
    } catch (error) {
      // Error is handled in context
    } finally {
      setIsGeneratingSummary(false);
      setShowDropdown(false);
    }
  };

  const handleToggleShare = async () => {
    try {
      const result = await toggleShareNote(note._id);
      if (result.isShared && result.shareUrl) {
        // Copy share URL to clipboard
        await navigator.clipboard.writeText(result.shareUrl);
        toast.success('Share URL copied to clipboard!');
      }
    } catch (error) {
      // Error is handled in context
    }
    setShowDropdown(false);
  };

  const handleExportPDF = async () => {
    await exportNotePDF(note._id, note.title);
    setShowDropdown(false);
  };

  const copyShareUrl = async () => {
    const shareUrl = `${window.location.origin}/share/${note.shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
    setShowDropdown(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 note-card-hover">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {note.isPinned && (
            <Pin className="h-4 w-4 text-yellow-500 flex-shrink-0" fill="currentColor" />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {note.title}
          </h3>
        </div>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
              <div className="py-1">
                <Link
                  to={`/note/edit/${note._id}`}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setShowDropdown(false)}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
                
                <button
                  onClick={handleTogglePin}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Pin className="h-4 w-4" />
                  <span>{note.isPinned ? 'Unpin' : 'Pin'}</span>
                </button>

                <button
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary || note.summary}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {isGeneratingSummary 
                      ? 'Generating...' 
                      : note.summary 
                        ? 'Has Summary' 
                        : 'Generate Summary'
                    }
                  </span>
                </button>

                <button
                  onClick={handleToggleShare}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{note.isShared ? 'Unshare' : 'Share'}</span>
                </button>

                {note.isShared && (
                  <button
                    onClick={copyShareUrl}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Share URL</span>
                  </button>
                )}

                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>

                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <Link to={`/note/edit/${note._id}`} className="block px-4 pb-2">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {truncateContent(note.content)}
        </p>
      </Link>

      {/* Summary */}
      {note.summary && (
        <div className="mx-4 mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded">
          <div className="flex items-center space-x-1 mb-1">
            <Sparkles className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-400">AI Summary</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
            {truncateContent(note.summary, 100)}
          </p>
        </div>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center flex-wrap gap-1">
            <Tag className="h-3 w-3 text-gray-400" />
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(note.createdAt)}</span>
          </div>
          {note.isShared && (
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <ExternalLink className="h-3 w-3" />
              <span>Shared</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {note.summary && (
            <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
              <Sparkles className="h-3 w-3" />
            </div>
          )}
          {note.isPinned && (
            <Pin className="h-3 w-3 text-yellow-500" fill="currentColor" />
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;