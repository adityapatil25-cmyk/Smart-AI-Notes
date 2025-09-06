/*import Note from "../models/Note.js";
import axios from "axios";

// Use free Hugging Face inference API
const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

// @desc    Summarize a note using free Hugging Face API
// @route   POST /api/notes/:id/summarize
// @access  Private
export const summarizeNote = async (req, res) => {
  try {
    console.log(`Summarizing note ID: ${req.params.id}`);

    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    if (note.summary) {
      return res.json({ message: "Note already summarized", summary: note.summary });
    }

    // Prepare input text
    let inputText = `${note.title}. ${note.content}`;
    
    // Limit input length for free tier
    if (inputText.length > 500) {
      inputText = inputText.substring(0, 500) + "...";
    }

    console.log("Calling free Hugging Face API...");

    // Try without API key first (public models)
    let response;
    try {
      response = await axios.post(
        HF_API_URL,
        {
          inputs: inputText,
          options: { wait_for_model: true }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 second timeout for model loading
        }
      );
    } catch (error) {
      if (error.response?.status === 503) {
        return res.status(503).json({
          message: "AI model is loading. Please try again in 1-2 minutes.",
          error: "Model loading"
        });
      }
      throw error;
    }

    let summary;
    
    if (Array.isArray(response.data) && response.data[0]?.summary_text) {
      summary = response.data[0].summary_text;
    } else if (response.data?.summary_text) {
      summary = response.data.summary_text;
    } else {
      // Fallback to mock summary if API fails
      summary = `This note on "${note.title}" provides comprehensive information about the topic. The content includes key concepts, detailed explanations, and important insights that make it a valuable reference for understanding the subject matter.`;
      console.log("Using fallback summary due to unexpected API response");
    }

    console.log("Summary generated successfully");

    // Save summary to database
    note.summary = summary;
    await note.save();

    res.json({
      message: "Note summarized successfully",
      summary: summary,
    });

  } catch (error) {
    console.error("Summarization Error:", error);
    
    let errorMessage = "Failed to summarize note";
    let statusCode = 500;

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 503) {
        errorMessage = "AI model is currently loading. Please try again in 1-2 minutes.";
        statusCode = 503;
      } else if (status === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
        statusCode = 429;
      } else if (status === 400) {
        errorMessage = "Invalid input. Please try with shorter content.";
      } else {
        errorMessage = `Summarization service temporarily unavailable. Error: ${data?.error || 'Unknown error'}`;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = "Request timeout. The AI model might be loading, please try again.";
    }

    // Fallback to mock summary on any error
    try {
      const note = await Note.findById(req.params.id);
      if (note && !note.summary) {
        const fallbackSummary = `This note on "${note.title}" covers important information about the topic. The content provides detailed insights and key points that are valuable for understanding the subject matter.`;
        note.summary = fallbackSummary;
        await note.save();
        
        return res.json({
          message: "Note summarized successfully (using fallback due to API unavailability)",
          summary: fallbackSummary,
        });
      }
    } catch (fallbackError) {
      console.error("Fallback summary failed:", fallbackError);
    }

    res.status(statusCode).json({ 
      message: errorMessage, 
      error: error.response?.data?.error || error.message
    });
  }
};

*/


import Note from "../models/Note.js";
import axios from "axios";

// Cohere API configuration
const COHERE_API_URL = "https://api.cohere.ai/v1/summarize";

// @desc    Summarize a note using Cohere API
// @route   POST /api/notes/:id/summarize
// @access  Private
export const summarizeNote = async (req, res) => {
  try {
    console.log(`Summarizing note ID: ${req.params.id}`);

    if (!process.env.COHERE_API_KEY) {
      return res.status(500).json({ 
        message: "AI summarization not available. Please configure COHERE_API_KEY in environment variables.",
        error: "COHERE_API_KEY missing"
      });
    }

    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    if (note.summary) {
      return res.json({ message: "Note already summarized", summary: note.summary });
    }

    const inputText = `${note.title}\n\n${note.content}`;

    console.log("Calling Cohere API...");

    const response = await axios.post(
      COHERE_API_URL,
      {
        text: inputText,
        length: "medium",
        format: "paragraph",
        extractiveness: "medium"
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const summary = response.data.summary;

    if (!summary) {
      throw new Error("No summary returned from Cohere API");
    }

    console.log("Cohere summary generated successfully");

    note.summary = summary;
    await note.save();

    res.json({
      message: "Note summarized successfully",
      summary: summary,
    });

  } catch (error) {
    console.error("Cohere API Error:", error);
    
    let errorMessage = "Failed to summarize note";
    let statusCode = 500;

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
        statusCode = 429;
      } else if (status === 401) {
        errorMessage = "Invalid API key. Please check your Cohere configuration.";
      } else {
        errorMessage = `Cohere API Error: ${data?.message || 'Unknown error'}`;
      }
    } else {
      errorMessage = `Summarization Error: ${error.message}`;
    }

    res.status(statusCode).json({ 
      message: errorMessage, 
      error: error.response?.data?.message || error.message
    });
  }
};