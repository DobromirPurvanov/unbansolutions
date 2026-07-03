// utils/ParseForm.ts - DEFENSIVE FINAL VERSION AGAINST AMBIGUOUS BUSBOY

import type { VercelRequest } from "@vercel/node";
import Busboy from "busboy";

// Define the type for parsed attachments
export interface ParsedAttachment {
  filename: string;
  content: string; // base64 string
  mimetype: string;
}

export interface ParsedFormData {
  [key: string]: string | ParsedAttachment[] | undefined;
  attachments?: ParsedAttachment[];
}

// NOTE: We change the signature to 'any' here to allow for dynamic checking of arguments
export const parseForm = (req: VercelRequest): Promise<ParsedFormData> => {
  return new Promise((resolve, reject) => {
    // Check content-type header for Busboy
    if (!req.headers["content-type"]) {
      reject(new Error("Missing Content-Type header"));
      return;
    }

    const busboy = Busboy({ headers: req.headers });
    const data: Record<string, string> = {};
    const attachments: ParsedAttachment[] = [];

    // Use 'any' to accept any arguments and handle them defensively
    busboy.on(
      "file",
      (
        _fieldname: string,
        file: NodeJS.ReadableStream,
        arg3: any, // Positional 3
        arg4: any, // Positional 4 (could be 'info' object or 'encoding' string)
        arg5: any, // Positional 5 (could be 'mimeType' string)
      ) => {
        
        let filename = 'unknown_file.dat'; // Default fallback
        let mimeType = 'application/octet-stream'; // Default fallback
        
        // **DEFENSIVE CHECK LOGIC:**

        // 1. Try modern signature (4th argument is 'info' object)
        if (typeof arg4 === 'object' && arg4 !== null && 'filename' in arg4) {
            filename = arg4.filename;
            mimeType = arg4.mimeType;
        } 
        // 2. Try classic signature (3rd argument is filename string, 5th is mimeType string)
        else if (typeof arg3 === 'string' && typeof arg5 === 'string') {
            filename = arg3;
            mimeType = arg5;
        }
        // 3. Last-ditch effort: Check if the 3rd argument is the metadata object (the cause of the error)
        else if (typeof arg3 === 'object' && arg3 !== null && 'filename' in arg3) {
             filename = arg3.filename;
             mimeType = arg3.mimeType;
        }

        const buffer: Buffer[] = [];

        file.on("data", (chunk: Buffer) => buffer.push(chunk));
        
        file.on("error", (err) => {
          console.error(`Busboy file stream error for ${filename}:`, err);
        });

        file.on("end", () => {
          const fileBuffer = Buffer.concat(buffer);
          
          if (fileBuffer.length > 0) {
            attachments.push({
              filename,
              content: fileBuffer.toString("base64"),
              mimetype: mimeType,
            });
            // Log the filename found by the defensive logic
            console.log(`[ParseForm] Added attachment: ${filename}, Size: ${fileBuffer.length} bytes`); 
          } else {
            console.log(`[ParseForm] Skipped empty file: ${filename}`);
          }
        });
      }
    );

    busboy.on("field", (fieldname: string, val: string) => {
      data[fieldname] = val;
    });

    busboy.on("finish", () => {
      resolve({ ...data, attachments });
    });

    busboy.on("error", (err: Error) => {
      console.error("Busboy parsing error:", err);
      reject(err);
    });

    req.pipe(busboy);
  });
};