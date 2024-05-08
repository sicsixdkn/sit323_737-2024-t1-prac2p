import {DragDropContext, Droppable, OnDragEndResponder} from "@hello-pangea/dnd";
import {Draggable} from "@hello-pangea/dnd";
import {ChangeEventHandler, useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {Box, Button, Chip, CircularProgress, Typography} from "@mui/material";
import io from "socket.io-client";

const {appConfig} = window;

function PdfConcat() {
    // State variables
    const [pdfFiles, setPdfFiles] = useState<{ id: string, file: File; displayName: string; }[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [concatFilename, setConcatFilename] = useState<string | null>(null);

    // Effect hook to connect to the server and listen for events
    useEffect(() => {
        // Connect to the server
        const socket = io(appConfig.PDF_SERVICE_SOCKET_IO_URI, {path: appConfig.PDF_SERVICE_SOCKET_IO_PATH});

        // Listen for the 'pdfReady' event
        socket.on("pdfReady", (data) => {
            // Set the filename and clear the merging flag
            setIsMerging(false);
            setConcatFilename(data.filename);
        });

        // Listen for the 'pdfError' event
        socket.on("pdfError", () => {
            console.error("Error merging PDFs");
            // Clear the merging flag
            setIsMerging(false);
        });

        // Cleanup function to remove event listeners when component unmounts
        return () => {
            socket.off("pdfReady");
            socket.off("pdfError");
        };
    }, []);

    // Event handler for file input change
    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        // If no files are selected, return early
        if (!event.target.files) {
            return;
        }

        // Map the files to an array including the existing files with a unique ID
        const files = Array.from(event.target.files).map(file => ({
            id: uuidv4(),
            file,
            displayName: file.name
        }));

        // Add the files to the state
        setPdfFiles(prevFiles => [...prevFiles, ...files]);

        // Clear the input field
        event.target.value = "";
    };

    // Event handler for drag and drop reordering
    const onDragEnd: OnDragEndResponder = (result) => {
        // If dropped outside the list, return early
        if (!result.destination) {
            return;
        }

        // Reorder the items in the state
        const files = Array.from(pdfFiles);
        const [reorderedItem] = files.splice(result.source.index, 1);
        files.splice(result.destination.index, 0, reorderedItem);

        // Set the new ordering of files
        setPdfFiles(files);
    };

    // Event handler for deleting a file
    const handleDelete = (index: number) => {
        // Remove the file from the state at the specified index
        const files = Array.from(pdfFiles);
        files.splice(index, 1);

        // Set the new list of files
        setPdfFiles(files);
    };

    // Event handler for merging the PDFs when the button is clicked
    const handleMerge = async () => {
        // Create a new FormData object and append each file to it
        const formData = new FormData();
        pdfFiles.forEach(pdf => {
            formData.append("pdfs", pdf.file, pdf.file.name);
        });

        // Send a POST request to the API to merge the PDFs, including the JWT token and the form data
        const response = await fetch(`${appConfig.PDF_SERVICE_API_URI}/pdf`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        });

        // If the response is successful, set the merging flag, we will wait for the 'pdfReady' event
        if (response.ok) {
            setIsMerging(true);
        } else {
            console.error("Error merging PDFs");
        }
    };

    // Event handler for downloading the merged PDF
    const handleDownload = async () => {
        // If there is no filename, return early
        if (!concatFilename) {
            return;
        }

        // Get the filename and clear the state
        const filename = concatFilename;
        setConcatFilename(null);

        // Send a GET request to the API to download the PDF, including the JWT token
        const response = await fetch(`${appConfig.PDF_SERVICE_API_URI}/pdf?filename=${encodeURIComponent(filename)}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        // If the response is successful, create a URL and download the PDF
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            console.error("Error downloading PDF");
        }
    };

    return (
        <>
            {isMerging ? (
                <>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress/>
                        <Typography variant="h6" component="div" sx={{marginTop: 2}}>
                            Waiting for download...
                        </Typography>
                    </Box>
                </>
            ) : concatFilename ? (
                    <>
                        <Button variant="contained" onClick={handleDownload}>
                            Download PDF
                        </Button>
                    </>
                ) :
                (
                    <Box display="flex" flexDirection="column" alignItems="center" paddingTop={6}>

                        <label htmlFor="fileInput" style={{cursor: "pointer", margin: 10}}>
                            <Button variant="outlined" component="span" sx={{width: 200}}>
                                Upload PDF
                            </Button>
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept="application/pdf"
                            multiple
                            onChange={handleFileChange}
                            style={{display: "none"}}
                        />

                        <Button variant="contained" component="span" sx={{marginTop: 1, marginBottom: 4, width: 200}}
                                disabled={pdfFiles.length < 2} onClick={handleMerge}>
                            Merge PDFs
                        </Button>


                        <DragDropContext onDragEnd={onDragEnd}>

                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            padding: 4,
                                            width: 250,
                                            minHeight: 450
                                        }}
                                    >
                                        {pdfFiles.map((pdf, index) => (
                                            <Draggable key={pdf.id} draggableId={pdf.id} index={index}>
                                                {(provided) => (
                                                    <Chip
                                                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                        label={pdf.displayName} variant="outlined"
                                                        onDelete={() => handleDelete(index)}
                                                        sx={{margin: 1, width: 250}}
                                                    />
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Box>
                )}
        </>
    );
}

export default PdfConcat;