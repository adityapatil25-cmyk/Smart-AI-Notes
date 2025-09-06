import api from './api';

class NoteService {
  // Get all notes with optional search and tag filter
  async getNotes(searchQuery = '', tagFilter = '') {
    try {
      let url = '/notes';
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (tagFilter) params.append('tag', tagFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get single note by ID
  async getNoteById(id) {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create new note
  async createNote(noteData) {
    try {
      const response = await api.post('/notes', noteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update note
  async updateNote(id, noteData) {
    try {
      const response = await api.put(`/notes/${id}`, noteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete note
  async deleteNote(id) {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Toggle pin note
  async togglePinNote(id) {
    try {
      const response = await api.put(`/notes/${id}/pin`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generate AI summary for note
  async generateSummary(id) {
    try {
      const response = await api.post(`/notes/${id}/summarize`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Toggle note sharing
  async toggleShareNote(id) {
    try {
      const response = await api.put(`/notes/${id}/share`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/notes/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Export single note as PDF
  async exportNotePDF(id) {
    try {
      console.log('Making PDF export request for note:', id);
      
      const response = await api.get(`/notes/${id}/export`, {
        responseType: 'blob',
        timeout: 30000, // 30 second timeout for PDF generation
        headers: {
          'Accept': 'application/pdf',
        }
      });
      
      console.log('PDF export response received:', {
        status: response.status,
        dataType: typeof response.data,
        dataSize: response.data?.size,
        contentType: response.headers['content-type']
      });
      
      // Check if response is an error disguised as blob
      if (response.data && response.data.type === 'application/json') {
        // This means we got an error response as JSON instead of PDF
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || 'PDF generation failed');
      }
      
      // Validate the response
      if (!response.data || !(response.data instanceof Blob)) {
        throw new Error('Invalid PDF response - not a blob');
      }
      
      if (response.data.size === 0) {
        throw new Error('PDF response is empty');
      }
      
      return response;
    } catch (error) {
      console.error('PDF Export Service Error:', error);
      
      // Handle blob error responses that contain JSON
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'PDF export failed');
        } catch (parseError) {
          // If we can't parse the blob as JSON, use the original error
          throw error;
        }
      }
      
      throw error;
    }
  }

  // Export all notes as PDF
  async exportAllNotesPDF() {
    try {
      console.log('Making PDF export request for all notes');
      
      const response = await api.get('/notes/export/all', {
        responseType: 'blob',
        timeout: 60000, // 60 second timeout for all notes
        headers: {
          'Accept': 'application/pdf',
        }
      });
      
      console.log('All notes PDF export response received:', {
        status: response.status,
        dataType: typeof response.data,
        dataSize: response.data?.size,
        contentType: response.headers['content-type']
      });
      
      // Check if response is an error disguised as blob
      if (response.data && response.data.type === 'application/json') {
        // This means we got an error response as JSON instead of PDF
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || 'PDF generation failed');
      }
      
      // Validate the response
      if (!response.data || !(response.data instanceof Blob)) {
        throw new Error('Invalid PDF response - not a blob');
      }
      
      if (response.data.size === 0) {
        throw new Error('PDF response is empty');
      }
      
      return response;
    } catch (error) {
      console.error('All Notes PDF Export Service Error:', error);
      
      // Handle blob error responses that contain JSON
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'PDF export failed');
        } catch (parseError) {
          // If we can't parse the blob as JSON, use the original error
          throw error;
        }
      }
      
      throw error;
    }
  }

  // Get shared note (public endpoint)
  async getSharedNote(shareId) {
    try {
      const response = await api.get(`/share/public/${shareId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Helper method to download blob as file
  downloadFile(blob, filename) {
    try {
      console.log('Starting file download:', {
        filename,
        blobSize: blob.size,
        blobType: blob.type
      });

      // Additional validation
      if (!blob || !(blob instanceof Blob)) {
        throw new Error('Invalid blob provided for download');
      }

      if (blob.size === 0) {
        throw new Error('Cannot download empty file');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      console.log('Created blob URL:', url);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Make link invisible and add to DOM
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger download
      console.log('Triggering download...');
      link.click();
      
      // Cleanup with slight delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('Download cleanup completed');
      }, 100);
      
    } catch (error) {
      console.error('Download file error:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }
}

export default new NoteService();