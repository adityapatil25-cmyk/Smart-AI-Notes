import React, { createContext, useContext, useReducer, useCallback } from 'react';
import noteService from '../services/noteService';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
  stats: {
    totalNotes: 0,
    totalSummarized: 0,
    pinnedNotes: 0,
    mostUsedTags: [],
  },
  filters: {
    search: '',
    tag: '',
  },
};

// Action types
const NOTES_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTES: 'SET_NOTES',
  SET_CURRENT_NOTE: 'SET_CURRENT_NOTE',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_STATS: 'SET_STATS',
  SET_FILTERS: 'SET_FILTERS',
  TOGGLE_PIN_NOTE: 'TOGGLE_PIN_NOTE',
  UPDATE_NOTE_SUMMARY: 'UPDATE_NOTE_SUMMARY',
  TOGGLE_SHARE_NOTE: 'TOGGLE_SHARE_NOTE',
};

// Reducer function
const notesReducer = (state, action) => {
  switch (action.type) {
    case NOTES_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case NOTES_ACTIONS.SET_NOTES:
      return {
        ...state,
        notes: action.payload,
        loading: false,
        error: null,
      };
    case NOTES_ACTIONS.SET_CURRENT_NOTE:
      return {
        ...state,
        currentNote: action.payload,
        loading: false,
        error: null,
      };
    case NOTES_ACTIONS.ADD_NOTE:
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        loading: false,
        error: null,
      };
    case NOTES_ACTIONS.UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes.map(note =>
          note._id === action.payload._id ? action.payload : note
        ),
        currentNote: state.currentNote?._id === action.payload._id 
          ? action.payload 
          : state.currentNote,
        loading: false,
        error: null,
      };
    case NOTES_ACTIONS.DELETE_NOTE:
      return {
        ...state,
        notes: state.notes.filter(note => note._id !== action.payload),
        currentNote: state.currentNote?._id === action.payload ? null : state.currentNote,
        loading: false,
        error: null,
      };
    case NOTES_ACTIONS.TOGGLE_PIN_NOTE:
      return {
        ...state,
        notes: state.notes.map(note =>
          note._id === action.payload.id 
            ? { ...note, isPinned: action.payload.isPinned }
            : note
        ),
      };
    case NOTES_ACTIONS.UPDATE_NOTE_SUMMARY:
      return {
        ...state,
        notes: state.notes.map(note =>
          note._id === action.payload.id 
            ? { ...note, summary: action.payload.summary }
            : note
        ),
        currentNote: state.currentNote?._id === action.payload.id
          ? { ...state.currentNote, summary: action.payload.summary }
          : state.currentNote,
      };
    case NOTES_ACTIONS.TOGGLE_SHARE_NOTE:
      return {
        ...state,
        notes: state.notes.map(note =>
          note._id === action.payload.id 
            ? { 
                ...note, 
                isShared: action.payload.isShared,
                shareId: action.payload.shareId 
              }
            : note
        ),
      };
    case NOTES_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case NOTES_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case NOTES_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload,
      };
    case NOTES_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    default:
      return state;
  }
};

// Create context
const NotesContext = createContext();

// Notes Provider component
export const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // Fetch notes - wrapped with useCallback to prevent infinite re-renders
  const fetchNotes = useCallback(async (search = '', tag = '') => {
    try {
      dispatch({ type: NOTES_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });

      const notes = await noteService.getNotes(search, tag);
      dispatch({ type: NOTES_ACTIONS.SET_NOTES, payload: notes });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notes';
      dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  }, []);

  // Fetch single note
  const fetchNoteById = useCallback(async (id) => {
    try {
      dispatch({ type: NOTES_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });

      const note = await noteService.getNoteById(id);
      dispatch({ type: NOTES_ACTIONS.SET_CURRENT_NOTE, payload: note });
      return note;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch note';
      dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  }, []);

  // Create note
  const createNote = useCallback(async (noteData) => {
    try {
      dispatch({ type: NOTES_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });

      const newNote = await noteService.createNote(noteData);
      dispatch({ type: NOTES_ACTIONS.ADD_NOTE, payload: newNote });
      toast.success('Note created successfully!');
      return newNote;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create note';
      dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  }, []);

  // Update note
  const updateNote = useCallback(async (id, noteData) => {
    try {
      dispatch({ type: NOTES_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });

      const updatedNote = await noteService.updateNote(id, noteData);
      dispatch({ type: NOTES_ACTIONS.UPDATE_NOTE, payload: updatedNote });
      toast.success('Note updated successfully!');
      return updatedNote;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update note';
      dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  }, []);

  // Delete note
  const deleteNote = useCallback(async (id) => {
    try {
      dispatch({ type: NOTES_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });

      await noteService.deleteNote(id);
      dispatch({ type: NOTES_ACTIONS.DELETE_NOTE, payload: id });
      toast.success('Note deleted successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete note';
      dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  }, []);

  // Toggle pin note
  const togglePinNote = useCallback(async (id) => {
    try {
      const result = await noteService.togglePinNote(id);
      dispatch({
        type: NOTES_ACTIONS.TOGGLE_PIN_NOTE,
        payload: { id, isPinned: result.isPinned },
      });
      toast.success(result.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle pin';
      toast.error(errorMessage);
    }
  }, []);

  // Generate summary
  const generateSummary = useCallback(async (id) => {
    try {
      const result = await noteService.generateSummary(id);
      dispatch({
        type: NOTES_ACTIONS.UPDATE_NOTE_SUMMARY,
        payload: { id, summary: result.summary },
      });
      toast.success('Summary generated successfully!');
      return result.summary;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to generate summary';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Toggle share note
  const toggleShareNote = useCallback(async (id) => {
    try {
      const result = await noteService.toggleShareNote(id);
      dispatch({
        type: NOTES_ACTIONS.TOGGLE_SHARE_NOTE,
        payload: { 
          id, 
          isShared: result.isShared,
          shareId: result.shareId 
        },
      });
      toast.success(result.message);
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle sharing';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      const stats = await noteService.getDashboardStats();
      dispatch({ type: NOTES_ACTIONS.SET_STATS, payload: stats });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Export note as PDF
  const exportNotePDF = useCallback(async (id, title) => {
    try {
      console.log('Starting PDF export for note:', id);
      const response = await noteService.exportNotePDF(id);
      
      console.log('Response received:', response);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);
      
      // Ensure we have a valid blob
      if (!response.data || !(response.data instanceof Blob)) {
        throw new Error('Invalid response data - not a blob');
      }
      
      const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '_')}.pdf`;
      console.log('Downloading file:', filename);
      
      noteService.downloadFile(response.data, filename);
      toast.success('Note exported successfully!');
    } catch (error) {
      console.error('PDF Export Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to export note';
      toast.error(errorMessage);
    }
  }, []);

  // Export all notes as PDF
  const exportAllNotesPDF = useCallback(async () => {
    try {
      console.log('Starting all notes PDF export');
      const response = await noteService.exportAllNotesPDF();
      
      console.log('Response received:', response);
      
      // Ensure we have a valid blob
      if (!response.data || !(response.data instanceof Blob)) {
        throw new Error('Invalid response data - not a blob');
      }
      
      const filename = `All_Smart_Notes_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Downloading file:', filename);
      
      noteService.downloadFile(response.data, filename);
      toast.success('All notes exported successfully!');
    } catch (error) {
      console.error('All Notes PDF Export Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to export notes';
      toast.error(errorMessage);
    }
  }, []);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({ type: NOTES_ACTIONS.SET_FILTERS, payload: filters });
  }, []);

  // Clear current note
  const clearCurrentNote = useCallback(() => {
    dispatch({ type: NOTES_ACTIONS.SET_CURRENT_NOTE, payload: null });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    notes: state.notes,
    currentNote: state.currentNote,
    loading: state.loading,
    error: state.error,
    stats: state.stats,
    filters: state.filters,
    fetchNotes,
    fetchNoteById,
    createNote,
    updateNote,
    deleteNote,
    togglePinNote,
    generateSummary,
    toggleShareNote,
    fetchStats,
    exportNotePDF,
    exportAllNotesPDF,
    setFilters,
    clearCurrentNote,
    clearError,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook to use notes context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export default NotesContext;