import puppeteer from "puppeteer";
import Note from "../models/Note.js";

// @desc    Export single note as PDF
// @route   GET /api/notes/:id/export
// @access  Private
export const exportNotePDF = async (req, res) => {
  let browser;
  
  try {
    console.log(`Starting PDF export for note ID: ${req.params.id}`);
    
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user._id.toString()) {
      console.log('Note not found or unauthorized');
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    console.log(`Found note: "${note.title}"`);

    // Escape HTML content properly
    const escapeHtml = (text) => {
      if (!text) return '';
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\n/g, '<br>');
    };

    // Create clean HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(note.title)}</title>
        <style>
          @page {
            margin: 2cm;
            size: A4;
          }
          
          * {
            box-sizing: border-box;
          }
          
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6; 
            color: #1f2937;
            background: white;
            margin: 0;
            padding: 20px;
            font-size: 14px;
          }
          
          .container {
            max-width: 100%;
            margin: 0 auto;
          }
          
          h1 { 
            color: #1e40af; 
            border-bottom: 2px solid #3b82f6; 
            padding-bottom: 10px; 
            margin-bottom: 20px;
            font-size: 24px;
            font-weight: 700;
          }
          
          .meta { 
            background: #f8fafc; 
            padding: 15px; 
            border-radius: 6px;
            margin-bottom: 20px;
            border-left: 4px solid #3b82f6;
            font-size: 13px;
            color: #4b5563;
          }
          
          .meta strong {
            color: #1f2937;
          }
          
          .content { 
            margin-bottom: 25px; 
            font-size: 14px;
            line-height: 1.7;
            color: #374151;
          }
          
          .summary { 
            background: #eff6ff; 
            padding: 15px; 
            border-left: 4px solid #2563eb; 
            border-radius: 6px;
            margin: 20px 0;
          }
          
          .summary h3 {
            color: #1e40af;
            margin: 0 0 10px 0;
            font-size: 16px;
          }
          
          .summary p {
            margin: 0;
            color: #1e40af;
            font-size: 13px;
          }
          
          .tags { 
            margin-top: 20px; 
            padding: 15px;
            background: #f9fafb;
            border-radius: 6px;
          }
          
          .tags strong {
            color: #1f2937;
            display: block;
            margin-bottom: 8px;
          }
          
          .tag { 
            display: inline-block;
            background: #2563eb; 
            color: white; 
            padding: 4px 10px; 
            border-radius: 12px; 
            margin: 2px 6px 2px 0; 
            font-size: 11px;
            font-weight: 500;
          }
          
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${escapeHtml(note.title)}</h1>
          
          <div class="meta">
            <strong>Created:</strong> ${new Date(note.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}<br>
            ${note.updatedAt !== note.createdAt ? `<strong>Updated:</strong> ${new Date(note.updatedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}<br>` : ''}
            ${note.isPinned ? '<strong>Status:</strong> Pinned<br>' : ''}
          </div>
          
          <div class="content">
            ${escapeHtml(note.content)}
          </div>
          
          ${note.summary ? `
            <div class="summary">
              <h3>📝 AI Summary</h3>
              <p>${escapeHtml(note.summary)}</p>
            </div>
          ` : ''}
          
          ${note.tags && note.tags.length > 0 ? `
            <div class="tags">
              <strong>Tags:</strong>
              ${note.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
          ` : ''}
          
          <div class="footer">
            Generated by Smart Notes • ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            })}
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('Launching browser...');

    // Launch browser with minimal configuration
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--disable-default-apps',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-web-security'
      ],
      timeout: 30000
    });

    console.log('Creating new page...');
    const page = await browser.newPage();

    // Set content
    console.log('Setting page content...');
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });

    console.log('Generating PDF...');
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm', 
        bottom: '1cm',
        left: '1cm'
      },
      displayHeaderFooter: false,
      timeout: 30000
    });

    console.log(`PDF generated successfully. Size: ${pdfBuffer.length} bytes`);

    await browser.close();
    browser = null;

    // Validate PDF buffer
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('Generated PDF is empty');
    }

    // Create safe filename
    const safeTitle = note.title
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    
    const filename = `${safeTitle}.pdf`;

    console.log(`Sending PDF: ${filename}`);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Send PDF
    return res.end(pdfBuffer, 'binary');

  } catch (error) {
    console.error("PDF Export Error:", error);
    
    // Clean up browser if still open
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    // Return JSON error
    if (!res.headersSent) {
      return res.status(500).json({ 
        message: "Failed to export PDF", 
        error: error.message 
      });
    }
  }
};

// @desc    Export all user notes as PDF
// @route   GET /api/notes/export/all
// @access  Private
export const exportAllNotesPDF = async (req, res) => {
  let browser;
  
  try {
    console.log(`Starting export all notes for user: ${req.user._id}`);
    
    const notes = await Note.find({ user: req.user._id }).sort({ 
      isPinned: -1,
      createdAt: -1 
    });

    if (notes.length === 0) {
      return res.status(404).json({ message: "No notes found to export" });
    }

    console.log(`Found ${notes.length} notes to export`);

    // Escape HTML content
    const escapeHtml = (text) => {
      if (!text) return '';
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\n/g, '<br>');
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Smart Notes Collection</title>
        <style>
          @page {
            margin: 2cm;
            size: A4;
          }
          
          * {
            box-sizing: border-box;
          }
          
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #1f2937;
            background: white;
            margin: 0;
            padding: 15px;
            font-size: 13px;
          }
          
          .note { 
            margin-bottom: 40px; 
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          h1 { 
            color: #1e40af; 
            border-bottom: 3px solid #3b82f6; 
            padding-bottom: 15px; 
            text-align: center;
            font-size: 28px;
            margin-bottom: 30px;
          }
          
          h2 { 
            color: #1e40af; 
            font-size: 18px;
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          
          .collection-info {
            text-align: center;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #e5e7eb;
          }
          
          .meta { 
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 12px;
            background: #f9fafb;
            padding: 8px;
            border-radius: 4px;
          }
          
          .content { 
            margin-bottom: 15px; 
            font-size: 13px;
            line-height: 1.6;
            color: #374151;
          }
          
          .summary { 
            background: #eff6ff; 
            padding: 12px; 
            border-left: 3px solid #2563eb; 
            border-radius: 4px;
            margin: 15px 0;
          }
          
          .summary strong {
            color: #1e40af;
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
          }
          
          .tags { 
            margin: 15px 0; 
          }
          
          .tag { 
            display: inline-block;
            background: #2563eb; 
            color: white; 
            padding: 2px 8px; 
            border-radius: 10px; 
            margin: 2px 4px 2px 0; 
            font-size: 10px;
          }
          
          .divider { 
            border-top: 1px solid #d1d5db; 
            margin: 30px 0;
          }
          
          .pinned-badge {
            background: #fbbf24;
            color: #92400e;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 10px;
            margin-left: 8px;
          }
        </style>
      </head>
      <body>
        <h1>📚 Smart Notes Collection</h1>
        
        <div class="collection-info">
          <strong>Total Notes:</strong> ${notes.length}<br>
          <strong>Exported:</strong> ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}
        </div>
        
        ${notes.map((note, index) => `
          <div class="note">
            <h2>
              ${escapeHtml(note.title)}
              ${note.isPinned ? '<span class="pinned-badge">📌 Pinned</span>' : ''}
            </h2>
            
            <div class="meta">
              Created: ${new Date(note.createdAt).toLocaleDateString('en-US')}
              ${note.updatedAt !== note.createdAt ? ` • Updated: ${new Date(note.updatedAt).toLocaleDateString('en-US')}` : ''}
            </div>
            
            <div class="content">
              ${escapeHtml(note.content)}
            </div>
            
            ${note.summary ? `
              <div class="summary">
                <strong>📝 AI Summary:</strong>
                ${escapeHtml(note.summary)}
              </div>
            ` : ''}
            
            ${note.tags && note.tags.length > 0 ? `
              <div class="tags">
                <strong style="font-size: 11px; color: #1f2937;">Tags:</strong><br>
                ${note.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
              </div>
            ` : ''}
            
            ${index < notes.length - 1 ? '<div class="divider"></div>' : ''}
          </div>
        `).join('')}
      </body>
      </html>
    `;

    console.log('Launching browser for all notes...');

    browser = await puppeteer.launch({ 
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu'
      ],
      timeout: 60000
    });

    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    console.log('Generating all notes PDF...');
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm', 
        left: '1cm'
      },
      displayHeaderFooter: false,
      timeout: 60000
    });

    console.log(`All notes PDF generated. Size: ${pdfBuffer.length} bytes`);

    await browser.close();
    browser = null;

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('Generated PDF is empty');
    }

    const filename = `Smart_Notes_${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store');

    return res.end(pdfBuffer, 'binary');

  } catch (error) {
    console.error("All Notes PDF Export Error:", error);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    if (!res.headersSent) {
      return res.status(500).json({ 
        message: "Failed to export all notes", 
        error: error.message 
      });
    }
  }
};