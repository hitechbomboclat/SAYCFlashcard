
import jsPDF from 'jspdf';
import { Flashcard } from '@/pages/Index';

const PAGE_WIDTH = 612; // 8.5 inches * 72 DPI (Letter width)
const PAGE_HEIGHT = 792; // 11 inches * 72 DPI (Letter height)
const MARGIN = 18; // 0.25 inch margins

export const exportFlashcardsToPDF = (flashcards: Flashcard[]) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  // 4 cards per column, 2 columns = 8 cards per page
  const cardsPerColumn = 4;
  const columnsPerPage = 2;
  const cardsPerPage = cardsPerColumn * columnsPerPage;
  
  // Calculate card positions - horizontal cards
  const availableWidth = PAGE_WIDTH - (MARGIN * 2);
  const availableHeight = PAGE_HEIGHT - (MARGIN * 2) - 30; // Space for header
  const cardWidth = availableWidth / columnsPerPage; // 2 columns
  const cardHeight = availableHeight / cardsPerColumn; // 4 rows
  
  const drawCutLines = (pdf: jsPDF) => {
    pdf.setDrawColor(128, 128, 128);
    pdf.setLineWidth(0.5);
    
    // Vertical cut line (between columns)
    const x = MARGIN + cardWidth;
    pdf.line(x, MARGIN + 20, x, PAGE_HEIGHT - MARGIN);
    
    // Horizontal cut lines (between rows)
    for (let i = 1; i < cardsPerColumn; i++) {
      const y = MARGIN + 20 + (i * cardHeight);
      pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    }
  };
  
  // Process flashcards in groups of 8
  for (let pageIndex = 0; pageIndex < Math.ceil(flashcards.length / cardsPerPage); pageIndex++) {
    const startCardIndex = pageIndex * cardsPerPage;
    const endCardIndex = Math.min(startCardIndex + cardsPerPage, flashcards.length);
    const pageCards = flashcards.slice(startCardIndex, endCardIndex);
    
    // Add front side page
    if (pageIndex > 0) {
      pdf.addPage();
    }

    // Add page header for front side
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Flashcards - Front Side (Page ${pageIndex + 1}) - ${pageCards.length} cards`, MARGIN, MARGIN + 10);
    
    // Draw cut lines
    drawCutLines(pdf);
    
    // Draw front sides (words) - arranged in columns
    pageCards.forEach((card, cardIndex) => {
      const col = Math.floor(cardIndex / cardsPerColumn); // Which column (0 or 1)
      const row = cardIndex % cardsPerColumn; // Which row (0-3)
      const x = MARGIN + col * cardWidth;
      const y = MARGIN + 20 + row * cardHeight;

      // Add border
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(1);
      pdf.rect(x + 2, y + 2, cardWidth - 4, cardHeight - 4);

      // Add word (centered)
      pdf.setFontSize(22);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      
      // Display word and part of speech
      const wordLines = pdf.splitTextToSize(card.word, cardWidth - 40);
      const wordHeight = wordLines.length * 20;
      const wordY = y + (cardHeight - wordHeight) / 2 - 10;
      
      wordLines.forEach((line: string, lineIndex: number) => {
        const lineWidth = pdf.getTextWidth(line);
        const lineX = x + (cardWidth - lineWidth) / 2;
        pdf.text(line, lineX, wordY + (lineIndex * 20));
      });

      // Add part of speech underneath the word
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      const posWidth = pdf.getTextWidth(card.partOfSpeech);
      pdf.text(card.partOfSpeech, x + (cardWidth - posWidth) / 2, wordY + (wordLines.length * 20) + 20);
    });

    // Add back side page
    pdf.addPage();

    // Add page header for back side
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Flashcards - Back Side (Page ${pageIndex + 1}) - Print on reverse - ${pageCards.length} cards`, MARGIN, MARGIN + 10);
    
    // Draw cut lines
    drawCutLines(pdf);
    
    // Draw back sides (definitions) - mirrored for double-sided alignment
    pageCards.forEach((card, cardIndex) => {
      const col = Math.floor(cardIndex / cardsPerColumn); // Which column (0 or 1)
      const row = cardIndex % cardsPerColumn; // Which row (0-3)
      
      // Mirror the column for double-sided printing
      const mirroredCol = columnsPerPage - 1 - col;
      const x = MARGIN + mirroredCol * cardWidth;
      const y = MARGIN + 20 + row * cardHeight;

      // Add border
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(1);
      pdf.rect(x + 2, y + 2, cardWidth - 4, cardHeight - 4);

      // White background for definition side
      pdf.setFillColor(255, 255, 255);
      pdf.rect(x + 4, y + 4, cardWidth - 8, cardHeight - 8, 'F');

      // Add definition text with better spacing
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      const definitionLines = pdf.splitTextToSize(card.definition, cardWidth - 24);
      let currentY = y + 20;
      
      definitionLines.forEach((line: string, lineIndex: number) => {
        if (currentY + (lineIndex * 14) < y + cardHeight - 20) {
          pdf.text(line, x + 12, currentY + (lineIndex * 14));
        }
      });

      // Add example if exists and fits
      if (card.example) {
        const exampleY = currentY + (definitionLines.length * 14) + 10;
        if (exampleY < y + cardHeight - 30) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(12);
          pdf.setTextColor(80, 80, 80);
          const exampleLines = pdf.splitTextToSize(`"${card.example}"`, cardWidth - 24);
          exampleLines.forEach((line: string, lineIndex: number) => {
            if (exampleY + (lineIndex * 12) < y + cardHeight - 15) {
              pdf.text(line, x + 12, exampleY + (lineIndex * 12));
            }
          });
        }
      }
    });
  }

  // Save the PDF
  pdf.save('flashcards-double-sided.pdf');
};
