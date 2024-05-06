import express from "express";
import {Server} from "socket.io";
import multer from "multer";
import {PDFDocument} from "pdf-lib";
import fs from "fs";
import path from "path";
import {authenticateUser} from "../middleware/authenticateUser";
import crypto from "crypto";

// Directories for uploading and downloading PDF files
const uploadDir = "/pdf/uploads/";
const downloadDir = "/pdf/downloads/";

export default function (io: Server) {
    // Create a router for the PDF routes
    const router = express.Router();
    // Create a multer instance for uploading PDF files
    const upload = multer({dest: uploadDir});

    // POST /api/pdf
    router.post("/", authenticateUser, upload.array("pdfs"), async (req, res) => {
        let files: Express.Multer.File[];
        try {
            // If no files were uploaded, return an error
            if (!req.files) {
                return res.status(400).json({message: "No PDF files were uploaded."});
            }

            files = req.files as Express.Multer.File[];

            // If less than two files were uploaded, return an error
            if (files.length < 2) {
                return res.status(400).json({message: "Upload at least two PDFs."});
            }

            // Return a 202 status code to indicate that the PDFs are being processed
            res.status(202).json({message: "PDFs are being processed."});
        } catch (error) {
            console.error("Error with the uploaded PDFs", error);
            return res.status(500).json({message: "Error with the uploaded PDFs"});
        }

        // Add a delay of 3 seconds for testing purposes
        setTimeout(async () => {
            try {
                // Create a new PDF document to merge the PDFs
                const mergedPdf = await PDFDocument.create();

                // Iterate over the uploaded files, read each PDF, and copy its pages to the merged PDF
                for (const file of files) {
                    const pdfBytes = fs.readFileSync(file.path);
                    const pdfDoc = await PDFDocument.load(pdfBytes);
                    const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                    for (const page of pages) {
                        mergedPdf.addPage(page);
                    }
                    // Delete the uploaded file after reading it
                    fs.unlinkSync(file.path);
                }

                // Save the merged PDF to a file
                const mergedPdfFile = await mergedPdf.save();

                // Generate a random filename for the merged PDF and create the output path
                const randomString = crypto.randomBytes(10).toString("hex");
                const filename = `merged-${randomString}.pdf`;
                const outputPath = path.join(downloadDir, filename);

                // Ensure the directory exists
                fs.mkdirSync(path.dirname(outputPath), {recursive: true});

                // Write the merged PDF to the output path
                fs.writeFileSync(outputPath, mergedPdfFile);

                // Emit an event to notify the client that the PDF is ready for download with the filename
                io.emit("pdfReady", {filename});
            } catch (error) {
                // If there is an error merging the PDFs, log the error and emit an error event
                console.error("Error merging PDFs", error);
                io.emit("pdfError", "Error merging PDFs");
            }
        }, 3000);
    });

    // GET /api/pdf
    router.get("/", authenticateUser, (req, res) => {
        // Get the filename from the query parameters
        const filename = req.query.filename as string;

        // Check if the filename contains ".." to prevent directory traversal attacks
        if (filename.includes("..")) {
            return res.status(400).json({message: "Invalid filename."});
        }
        const filepath = path.join(downloadDir, filename);

        // Check if the file exists
        fs.access(filepath, fs.constants.F_OK, (err) => {
            // If the file does not exist, return an error
            if (err) {
                return res.status(404).json({message: "File not found"});
            }

            // If the file exists, send the file for download
            res.download(filepath);
        });
    });

    return router;
}