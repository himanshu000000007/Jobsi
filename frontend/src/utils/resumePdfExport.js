/**
 * resumePdfExport.js
 *
 * WHY: html2pdf.js breaks with Tailwind CSS — it renders HTML in a sandboxed
 * iframe where Tailwind JIT classes aren't available, collapsing grid/flex layouts.
 *
 * THIS APPROACH:
 * 1. Clone the resume DOM into a fixed-width (794px = A4) off-screen container
 * 2. html2canvas takes a pixel-perfect 2x screenshot (no iframe, no Tailwind loss)
 * 3. jsPDF slices the canvas into A4 pages and saves the PDF
 *
 * Install: npm install jspdf html2canvas
 *
 * Usage in ResumeBuilder.jsx:
 *   import { exportResumeToPDF } from '../../utils/resumePdfExport';
 *   await exportResumeToPDF(resumeRef.current, 'My_Resume.pdf');
 */

import jsPDF       from 'jspdf';
import html2canvas from 'html2canvas';

const A4_W_PX  = 794;   // ~210mm at 96dpi
const A4_H_PX  = 1123;  // ~297mm at 96dpi
const SCALE    = 2;     // Retina quality

export const exportResumeToPDF = async (element, filename = 'resume.pdf') => {
  if (!element) {
    console.error('exportResumeToPDF: element is null');
    return;
  }

  // 1. Build a fixed-width off-screen clone so Tailwind CSS applies correctly
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position:   'fixed',
    top:        '-9999px',
    left:       '-9999px',
    width:      `${A4_W_PX}px`,
    background: 'white',
    zIndex:     '-1',
  });

  const clone = element.cloneNode(true);
  Object.assign(clone.style, {
    width:     `${A4_W_PX}px`,
    padding:   '40px',
    boxSizing: 'border-box',
    background:'white',
  });

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    // 2. Screenshot at 2x scale
    const canvas = await html2canvas(wrapper, {
      scale:           SCALE,
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: '#ffffff',
      logging:         false,
      width:           A4_W_PX,
      height:          wrapper.scrollHeight,
    });

    // 3. Slice canvas into A4 pages
    const pdf          = new jsPDF('p', 'pt', 'a4');
    const pdfW         = pdf.internal.pageSize.getWidth();
    const pdfH         = pdf.internal.pageSize.getHeight();
    const canvasPageH  = A4_H_PX * SCALE;
    const totalPages   = Math.ceil(canvas.height / canvasPageH);

    for (let page = 0; page < totalPages; page++) {
      const srcY       = page * canvasPageH;
      const srcH       = Math.min(canvasPageH, canvas.height - srcY);

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width  = canvas.width;
      pageCanvas.height = srcH;

      pageCanvas.getContext('2d').drawImage(
        canvas,
        0, srcY, canvas.width, srcH,
        0, 0,   canvas.width, srcH
      );

      const imgData    = pageCanvas.toDataURL('image/png');
      const imgHeightPt = (srcH / SCALE / A4_W_PX) * pdfW;

      if (page > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, imgHeightPt);
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(wrapper); // always clean up
  }
};