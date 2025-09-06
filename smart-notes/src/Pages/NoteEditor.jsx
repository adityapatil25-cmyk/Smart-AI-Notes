import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Sparkles, 
  Share2, 
  Download,
  Pin,
  Tag,
  X,
  Plus
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { toast } from 'react-toastify';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const {
    currentNote,
    fetchNoteById,
    createNote,
    updateNote,
    generateSummary,
    togglePinNote,
    toggleShareNote,
    exportNotePDF,
    clearCurrentNote,
    loading
  } = useNotes();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Load note data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchNoteById(id);
    } else {
      clearCurrentNote();
      setFormData({ title: '', content: '', tags: [] });
    }

    return () => clearCurrentNote();
  }, [id, isEditing, fetchNoteById, clearCurrentNote]);

  // Update form when currentNote changes
  useEffect(() => {
    if (currentNote && isEditing) {
      setFormData({
        title: currentNote.title || '',
        content: currentNote.content || '',
        tags: currentNote.tags || []
      });
    }
  }, [currentNote, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        await updateNote(id, formData);
      } else {
        await createNote(formData);
        // Reset form for new note
        setFormData({ title: '', content: '', tags: [] });
      }
      
      if (isEditing) {
        navigate('/dashboard');
      }
    } catch (error) {
      // Error is handled in context
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!id) {
      toast.error('Please save the note first');
      return;
    }

    setIsGeneratingSummary(true);
    try {
      await generateSummary(id);
    } catch (error) {
      // Error is handled in context
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleTogglePin = async () => {
    if (!id) return;
    await togglePinNote(id);
  };

  const handleToggleShare = async () => {
    if (!id) return;
    await toggleShareNote(id);
  };

  const handleExportPDF = async () => {
    if (!id) return;
    await exportNotePDF(id, currentNote.title);
  };

  const copyShareUrl = async () => {
    if (!currentNote?.shareId) return;
    const shareUrl = `${window.location.origin}/share/${currentNote.shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Pin Button (only when editing) */}
            {isEditing && currentNote && (
              <button
                onClick={handleTogglePin}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentNote.isPinned
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Pin className="h-4 w-4" fill={currentNote.isPinned ? 'currentColor' : 'none'} />
                <span>{currentNote.isPinned ? 'Unpin' : 'Pin'}</span>
              </button>
            )}

            {/* Generate Summary Button (only when editing) */}
            {isEditing && currentNote && (
              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary || currentNote.summary}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {isGeneratingSummary 
                    ? 'Generating...' 
                    : currentNote.summary 
                      ? 'Has Summary' 
                      : 'Generate Summary'
                  }
                </span>
              </button>
            )}

            {/* Share Button (only when editing) */}
            {isEditing && currentNote && (
              <button
                onClick={handleToggleShare}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentNote.isShared
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Share2 className="h-4 w-4" />
                <span>{currentNote.isShared ? 'Shared' : 'Share'}</span>
              </button>
            )}

            {/* Export PDF Button (only when editing) */}
            {isEditing && currentNote && (
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="loading-spinner w-4 h-4"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Share URL Display */}
        {isEditing && currentNote?.isShared && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  This note is shared publicly
                </p>
                <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                  Anyone with the link can view this note
                </p>
              </div>
              <button
                onClick={copyShareUrl}
                className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded text-xs font-medium hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        )}

        {/* Main Editor */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Title Input */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter note title..."
              className="w-full text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500"
              autoFocus={!isEditing}
            />
          </div>

          {/* Content Editor */}
          <div className="p-6">
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Start writing your note..."
              className="w-full h-96 text-gray-900 dark:text-white bg-transparent border-none outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed"
            />
          </div>

          {/* Tags Section */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</span>
            </div>

            {/* Existing Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-primary-600 dark:hover:text-primary-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add New Tag */}
            <form onSubmit={handleAddTag} className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="flex items-center space-x-1 px-3 py-2 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-md text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* AI Summary Display (only when editing and has summary) */}
          {isEditing && currentNote?.summary && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Summary</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-300 leading-relaxed">
                {currentNote.summary}
              </p>
            </div>
          )}

          {/* Metadata (only when editing) */}
          {isEditing && currentNote && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>
                    Created: {new Date(currentNote.createdAt).toLocaleDateString()}
                  </span>
                  {currentNote.updatedAt !== currentNote.createdAt && (
                    <span>
                      Updated: {new Date(currentNote.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {currentNote.isPinned && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <Pin className="h-3 w-3 mr-1" fill="currentColor" />
                      Pinned
                    </span>
                  )}
                  {currentNote.isShared && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Share2 className="h-3 w-3 mr-1" />
                      Shared
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? (
              <>
                Use the buttons above to pin, share, generate AI summary, or export your note.
              </>
            ) : (
              <>
                <span className="font-medium">Tip:</span> Save your note to unlock AI summarization, sharing, and export features.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;