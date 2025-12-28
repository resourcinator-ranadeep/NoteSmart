import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker (essential for performance)
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface PdfData {
    text: string;
    pageCount: number;
}

export async function extractPdfData(file: File): Promise<PdfData> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageCount = pdf.numPages;

        let fullText = '';

        for (let i = 1; i <= pageCount; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Join tokens with space and normalize whitespace
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');

            fullText += `\n--- Page ${i} ---\n${pageText}`;
        }

        return {
            text: fullText,
            pageCount
        };
    } catch (error) {
        console.error("Error extracting PDF data:", error);
        throw new Error("Failed to parse PDF document.");
    }
}
