/**
 * Renders the Levels page, allowing admins to manage tutorials by adding, editing, or deleting lessons.
 * @param {object} tutorialData - Initial tutorial data fetched from Firestore.
 * @param {string} tutorialData.levelId - ID of the current level.
 * @returns {ReactElement} LevelsPage React component.
 */


"use client";

import { useState, useEffect, useMemo, useRef } from "react";

import { useUser } from "@clerk/nextjs";

import TutorialsLayout from "@/components/tutorials/tutorials-layout.jsx";

import { db, storage } from "@/config/firebase";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { Grip, Loader, Pencil, Trash2, Check, X } from "lucide-react";

import {
    getFormattedSemesterName,
    getFormattedSubjectsName,
    getFormattedSectionsName
} from "@/components/tutorials/getFormatted";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";


import { useRouter } from "next/navigation";
import Link from "next/link";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const LevelsPage = ({ tutorialData, levelId }) => {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata.role === "admin";

    const router = useRouter();

    const [semesters, setSemesters] = useState(tutorialData[levelId]);

    const containerRef = useRef(null);
    const [reorderSaving, setReorderSaving] = useState(false)

    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState("");
    const [selectedSection, setSelectedSection] = useState("");


    const [formDataLesson, setFormDataLesson] = useState({
        title: "",
        downloadLink: "",
        fileLocation: []
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [alertFileIsUploaded, setAlertFileIsUploaded] = useState("");
    const [progressViewerOfFile, setProgressViewerOfFile] = useState(0);

    // btns of edit and delete
    const [editingFile, setEditingFile] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [loadingFileSave, setLoadingFileSave] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(null);

    // Navigation
    const [openItems, setOpenItems] = useState({
        semester: null,
        subject: null,
        section: null
    });

    const containerTutorialsRef = useRef(null);

    // Update state based on hash
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            // Split the hash by '#' and ignore the first element
            const parts = hash.slice(1).split('#').slice(1);
            handleHash(parts);
        }
    }, []);

    // Handle hash parts to update state
    const handleHash = (parts) => {
        if (parts.length > 0) {
            const [semesterKey, subjectKey, sectionKey] = parts;
            setOpenItems({
                semester: `semester-${semesterKey}`,
                subject: `subject-${subjectKey}`,
                section: `section-${sectionKey}`
            });
        }
    };

    // Scroll to the section after state updates
    useEffect(() => {
        const targetId = openItems.section;
        if (targetId) {
            // Find the target element and scroll into view
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [openItems]);

    const handleAccordionTrigger = (key, type) => {
        setOpenItems((prev) => ({
            [type]: prev[type] === key
        }));
    };


    const handleEdit = (id, currentTitle) => {
        setEditingFile(id);
        setNewTitle(currentTitle);
    };

    const handleSave = async ({ levelId, semester, subject, section, id }) => {
        setLoadingFileSave(true);
        setEditingFile(id)

        try {
            const sectionRef = doc(db, levelId, semester, "subjects", subject, "sections", section);
            const sectionSnap = await getDoc(sectionRef);

            if (sectionSnap.exists()) {
                const existingData = sectionSnap.data();
                const updatedFiles = existingData.files.map((file) =>
                    file.id === id ? { ...file, title: newTitle } : file
                );

                await updateDoc(sectionRef, { files: updatedFiles });

                setSemesters((prevSemesters) => {
                    const updatedSemesters = { ...prevSemesters };
                    const semesterData = updatedSemesters[semester];
                    const subjectData = semesterData.subjects[subject];
                    const sectionData = subjectData.sections[section];

                    sectionData.files = sectionData.files.map((file) =>
                        file.id === id ? { ...file, title: newTitle } : file
                    );
                    return updatedSemesters;
                });
            } else {
                console.error("Document does not exist");
            }

            setEditingFile(null);
        } catch (error) {
            console.error("Error saving file: ", error);
        } finally {
            setLoadingFileSave(false);
            setEditingFile(false)
        }
    };

    const handleCancel = () => {
        setEditingFile(null);
        setNewTitle('');
    };


    const handleDelete = async ({ levelId, semester, subject, section, id, fileUrl }) => {
        // Set loading to true immediately after the delete action is initiated
        setLoadingDelete(id);

        const extractFilePathFromUrl = (url) => {
            const encodedPath = url.split("/o/")[1].split("?alt=media")[0];
            return decodeURIComponent(encodedPath);
        };

        try {
            // Firestore: Reference to the section document
            const sectionRef = doc(db, levelId, semester, "subjects", subject, "sections", section);

            // Get the document snapshot
            const sectionSnap = await getDoc(sectionRef);

            if (sectionSnap.exists()) {
                const existingData = sectionSnap.data();
                const updatedFiles = existingData.files.filter((file) => file.id !== id);

                // Update the document with the filtered files
                await updateDoc(sectionRef, {
                    files: updatedFiles
                });

                // Extract the file path from the URL
                const filePath = extractFilePathFromUrl(fileUrl);

                // Firebase Storage: Reference to the file in storage
                const fileRef = ref(storage, filePath);

                // Delete the file from storage
                await deleteObject(fileRef);

                // Update the UI only after a successful response from Firestore
                setSemesters((prevSemesters) => {
                    const updatedSemesters = { ...prevSemesters };
                    const semesterData = updatedSemesters[semester];
                    const subjectData = semesterData.subjects[subject];
                    const sectionData = subjectData.sections[section];

                    sectionData.files = sectionData.files.filter((file) => file.id !== id);
                    return updatedSemesters;
                });
            } else {
                console.error("Document does not exist");
            }
        } catch (error) {
            console.error("Error deleting file: ", error);
        } finally {
            // Set loading to false after the delete action is complete
            setLoadingDelete(false);
        }
    };


    // Memoized semester and subject names
    const uniqueSemesters = useMemo(() => Object.values(semesters).map(sem => sem.title), [semesters]);

    const uniqueSubjects = useMemo(() => {
        const formattedSemesterName = getFormattedSemesterName(selectedSemester);
        const semesterData = semesters[formattedSemesterName];
        return semesterData?.subjects ? Object.keys(semesterData.subjects) : [];
    }, [selectedSemester, semesters]);

    const uniqueSectionTitles = useMemo(() => {
        if (selectedSemester && selectedSubjects) {
            const formattedSemesterName = getFormattedSemesterName(selectedSemester);
            const subjectData = semesters[formattedSemesterName]?.subjects[selectedSubjects];
            return subjectData ? Object.values(subjectData.sections).map(sec => sec.title) : [];
        }
        return [];
    }, [selectedSemester, selectedSubjects, semesters]);

    // Update file location reference
    useEffect(() => {
        const semester = getFormattedSemesterName(selectedSemester);
        const subject = selectedSubjects;
        const section = getFormattedSectionsName(selectedSection);

        setFormDataLesson((prev) => ({
            ...prev,
            fileLocation: [
                levelId,
                [semester, { "title": selectedSemester }],
                [subject, { "title": getFormattedSubjectsName(selectedSubjects) }],
                [section, { "title": selectedSection }]],
        }));
    }, [levelId, selectedSemester, selectedSubjects, selectedSection]);

    async function uploadFile(file) {
        const storageRef = ref(
            storage,
            `${levelId}/${getFormattedSemesterName(selectedSemester)}/subjects/${selectedSubjects}/sections/${getFormattedSectionsName(selectedSection)}/${file.name}`
        );

        try {
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgressViewerOfFile(progress);
                    setUploadingFile(true)
                },
                (error) => {
                    console.error("Error uploading file:", error);
                    setAlertFileIsUploaded("Error uploading file!");
                },
                async () => {
                    setProgressViewerOfFile(100);
                    setAlertFileIsUploaded("File uploaded successfully!");
                    setUploadingFile(false)

                    try {
                        const downloadURL = await getDownloadURL(storageRef);
                        setFormDataLesson((prev) => ({
                            ...prev,
                            downloadLink: downloadURL,
                        }));
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                    }
                }
            );
        } catch (err) {
            console.error('Upload failed:', err);
        }
    }

    function handleChange(e) {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            setSelectedFile(files[0]);
            uploadFile(files[0]);
        } else {
            setFormDataLesson((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    async function sendFormDataLesson(e) {
        e.preventDefault();

        setUploading(true)

        try {
            const res = await fetch("/api/tutorial", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataLesson),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            setSuccessMessage("Lesson created successfully!");
            resetForm();
            router.refresh()
        } catch (error) {
            console.error("Fetch error:", error);
            setErrorMessage("Failed to create lesson.");
        } finally {
            setUploading(false)
        }
    }

    const resetForm = () => {
        setUploading(false);
        setUploadingFile(false);
        setSelectedFile(null);
        setAlertFileIsUploaded("");
        setSelectedSemester("");
        setSelectedSubjects("");
        setSelectedSection("");

        // Reset form data
        setFormDataLesson({
            title: "",
            downloadLink: "",
            fileLocation: []
        });
    };

    const handleDragEnd = async (semesterKey, subjectKey, sectionKey, result) => {
        if (!result.destination) return;

        const semesterData = semesters[semesterKey];
        const subjectData = semesterData.subjects[subjectKey];
        const sectionData = subjectData.sections[sectionKey];

        const reorderedFiles = Array.from(sectionData.files);
        const [removed] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, removed);

        setSemesters((prevSemesters) => {
            const updatedSemesters = { ...prevSemesters };
            updatedSemesters[semesterKey].subjects[subjectKey].sections[sectionKey].files = reorderedFiles;
            return updatedSemesters;
        });

        try {
            setReorderSaving((prev) => ({ ...prev, [sectionKey]: true }));
            const sectionDocRef = doc(
                db,
                levelId,
                semesterKey,
                "subjects",
                subjectKey,
                "sections",
                sectionKey
            );

            await updateDoc(sectionDocRef, {
                files: reorderedFiles,
            });

            setReorderSaving((prev) => ({ ...prev, [sectionKey]: false }));
        } catch (error) {
            console.error("Error saving reorder to Firestore:", error);
            setReorderSaving((prev) => ({ ...prev, [sectionKey]: false }));
        }
    };

    function choseLevelTitle(levelId) {
        switch (levelId) {
            case "1ac": return "1ère Année Collège";
            case "2ac": return "2ère Année Collège";
            case "3ac": return "3ère Année Collège";
            case "tc": return "Tronc Commun";
            case "1bac": return "1ère Bac";
            case "2bac": return "2ème Bac";
            default: 'No Title';
        }
    }

    return (
        <TutorialsLayout tutorialData={tutorialData} title={choseLevelTitle(levelId)} pathName={levelId} path={`tutorials/${levelId}`}>
            <div className="w-full border-2 border-primary rounded-lg">
                {isAdmin && (
                    <div className="p-4 bg-gray-100 border-b border-primary rounded-t-lg">
                        <div className="pb-4">
                            {errorMessage && <Alert variant="error" className="mb-2">{errorMessage}</Alert>}
                            {successMessage && <Alert variant="success" className="mb-2">{successMessage}</Alert>}
                            {alertFileIsUploaded && <Alert variant="info">{alertFileIsUploaded}</Alert>}
                        </div>
                        <div className="mb-4">
                            <Label className="block mb-2">Select Semester:</Label>
                            <Select onValueChange={setSelectedSemester} value={selectedSemester}>
                                <SelectTrigger className="border-2 border-primary">
                                    <SelectValue placeholder="-- Select a Semester --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueSemesters.map((semesterTitle, index) => (
                                        <SelectItem key={index} value={semesterTitle}>
                                            {semesterTitle}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedSemester && (
                                <>
                                    <Label className="block mb-2 mt-4">Select subjects:</Label>
                                    <Select onValueChange={setSelectedSubjects} value={selectedSubjects}>
                                        <SelectTrigger className="border-2 border-primary">
                                            <SelectValue placeholder="-- Select a Section --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {uniqueSubjects.map((subjectsTitle, index) => (
                                                <SelectItem key={index} value={subjectsTitle}>
                                                    {getFormattedSubjectsName(subjectsTitle)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                            {selectedSubjects && (
                                <>
                                    <Label className="block mb-2 mt-4">Select Section:</Label>
                                    <Select onValueChange={setSelectedSection} value={selectedSection}>
                                        <SelectTrigger className="border-2 border-primary">
                                            <SelectValue placeholder="-- Select a Section --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {uniqueSectionTitles.map((sectionTitle, index) => (
                                                <SelectItem key={index} value={sectionTitle}>
                                                    {sectionTitle}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div>

                        {selectedSection && (
                            <>
                                <form onSubmit={sendFormDataLesson}>
                                    <div className="mb-4">
                                        <Label className="block mb-2">File Title:</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formDataLesson.title}
                                            type="text"
                                            className="p-2 border-2 border-primary bg-white rounded w-full placeholder:text-primary/60"
                                            placeholder="Enter file title..."
                                            onChange={handleChange}
                                            required />
                                    </div>

                                    <div>
                                        {selectedSection === "Vidéos" ? (
                                            <>
                                                <Label htmlFor="file" className="block mb-2">Link Url:</Label>
                                                <Input
                                                    id="downloadLink"
                                                    name="downloadLink"
                                                    value={formDataLesson.downloadLink}
                                                    type="url"
                                                    className="p-2 border-2 border-primary bg-white mb-4 rounded w-full placeholder:text-primary/60"
                                                    placeholder="Enter file title..."
                                                    onChange={handleChange}
                                                    required />
                                            </>
                                        ) : (
                                            <>
                                                <Label htmlFor="file" className="block mb-2">Upload File</Label>
                                                <Input
                                                    id="downloadLink"
                                                    name="downloadLink"
                                                    type="file"
                                                    onChange={handleChange}
                                                    className="mb-4 bg-white text-primary"
                                                    disabled={uploadingFile || uploading}
                                                    required
                                                />

                                                {progressViewerOfFile > 0 && (
                                                    <div className="mb-4 flex items-center gap-2">
                                                        <Progress
                                                            value={progressViewerOfFile}
                                                            className="bg-transparent border-2 border-primary"
                                                        />
                                                        {progressViewerOfFile}%
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={uploadingFile || uploading}
                                            className={`p-2 w-full rounded-lg ${uploadingFile || uploading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-primary text-white'
                                                }`}
                                        >
                                            {uploadingFile ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader className="animate-spin h-5 w-5 text-white" /> Uploading file...
                                                </span>
                                            ) : uploading ? (
                                                "Uploading..."
                                            ) : (
                                                "Upload"
                                            )}
                                        </Button>

                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                )}
                <div id="tutorials">
                    {Object.entries(semesters).map(([semesterKey, semester]) => (
                        <Accordion type="single" collapsible key={semesterKey} value={openItems.semester === `semester-${semesterKey}` ? `semester-${semesterKey}` : undefined}>
                            <AccordionItem value={`semester-${semesterKey}`}>
                                <AccordionTrigger
                                    className="flex justify-between items-center bg-primary text-white p-4"
                                    onClick={() => handleAccordionTrigger(`semester-${semesterKey}`, 'semester')}
                                >
                                    <span>{semester.title}</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {Object.entries(semester.subjects).map(([subjectKey, subject]) => (
                                        <Accordion type="single" collapsible key={subjectKey} value={openItems.subject === `subject-${subjectKey}` ? `subject-${subjectKey}` : undefined}>
                                            <AccordionItem value={`subject-${subjectKey}`}>
                                                <AccordionTrigger
                                                    className="p-4 border-b bg-secondary-hover border-primary flex items-center"
                                                    onClick={() => handleAccordionTrigger(`subject-${subjectKey}`, 'subject')}
                                                >
                                                    {subject.title}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    {Object.entries(subject.sections).map(([sectionKey, section]) => (
                                                        <Accordion type="single" collapsible key={sectionKey} value={openItems.section === `section-${sectionKey}` ? `section-${sectionKey}` : undefined}>
                                                            <AccordionItem value={`section-${sectionKey}`} id={`section-${sectionKey}`}>
                                                                <AccordionTrigger
                                                                    className="p-2 px-4 border-b border-primary"
                                                                    alert={reorderSaving[sectionKey] ? "saving..." : ""}
                                                                    onClick={() => handleAccordionTrigger(`section-${sectionKey}`, 'section')}
                                                                >
                                                                    {section.title}
                                                                </AccordionTrigger>
                                                                <AccordionContent>
                                                                    {Object.keys(section.files).length === 0 ? (
                                                                        <p className="p-2 px-4 border-b border-primary">
                                                                            {`Il n'y a pas encore de ${section.title}`} 😅
                                                                        </p>
                                                                    ) : (
                                                                        <DragDropContext onDragEnd={(result) => handleDragEnd(semesterKey, subjectKey, sectionKey, result)}>
                                                                            <Droppable droppableId={sectionKey}>
                                                                                {(provided) => (
                                                                                    <div
                                                                                        {...provided.droppableProps}
                                                                                        ref={(ref) => {
                                                                                            provided.innerRef(ref);
                                                                                            containerTutorialsRef.current = ref;
                                                                                        }}
                                                                                    >
                                                                                        {Object.entries(section.files).map(
                                                                                            ([fileKey, { title, downloadLink, id }], fileIndex) => (
                                                                                                <Draggable
                                                                                                    key={id}
                                                                                                    draggableId={id}
                                                                                                    index={fileIndex}
                                                                                                    isDragDisabled={!isAdmin}
                                                                                                >
                                                                                                    {(provided, snapshot) => (
                                                                                                        <div
                                                                                                            ref={provided.innerRef}
                                                                                                            {...provided.draggableProps}
                                                                                                            className="px-4 border-b border-primary bg-white flex items-center justify-between space-x-2"
                                                                                                        >
                                                                                                            {isAdmin && (
                                                                                                                <div className="drag-handle" {...provided.dragHandleProps}>
                                                                                                                    <span className="drag-icon cursor-move"><Grip size={12} /></span>
                                                                                                                </div>
                                                                                                            )}
                                                                                                            {editingFile === id ? (
                                                                                                                <div className="py-1 flex items-center justify-between w-full">
                                                                                                                    <Input
                                                                                                                        value={newTitle}
                                                                                                                        onChange={(e) => setNewTitle(e.target.value)}
                                                                                                                        className="flex-1 mr-2 bg-white border-2 border-primary"
                                                                                                                    />
                                                                                                                    <Button
                                                                                                                        onClick={() =>
                                                                                                                            handleSave({
                                                                                                                                levelId,
                                                                                                                                semester: semesterKey,
                                                                                                                                subject: subjectKey,
                                                                                                                                section: sectionKey,
                                                                                                                                id,
                                                                                                                            })
                                                                                                                        }
                                                                                                                        disabled={loadingFileSave}
                                                                                                                        className="relative mr-2"
                                                                                                                    >
                                                                                                                        {loadingFileSave ? (
                                                                                                                            <Loader className="animate-spin h-5 w-5 text-white" />
                                                                                                                        ) : (
                                                                                                                            <Check size={18} />
                                                                                                                        )}
                                                                                                                    </Button>
                                                                                                                    <Button
                                                                                                                        onClick={handleCancel}
                                                                                                                        disabled={loadingFileSave}
                                                                                                                        className="relative"
                                                                                                                    >
                                                                                                                        <X size={18} />
                                                                                                                    </Button>
                                                                                                                </div>
                                                                                                            ) : (
                                                                                                                <>
                                                                                                                    <a
                                                                                                                        href={downloadLink}
                                                                                                                        download={
                                                                                                                            selectedSection === "Vidéos" ? false : downloadLink
                                                                                                                        }
                                                                                                                        target="_blank"
                                                                                                                        className="flex-1"
                                                                                                                    >
                                                                                                                        <div className="flex items-center py-1 justify-between cursor-pointer">
                                                                                                                            <span>{title}</span>
                                                                                                                        </div>
                                                                                                                    </a>
                                                                                                                    {isAdmin && (
                                                                                                                        <div className="flex items-center space-x-2 py-1">
                                                                                                                            <Button
                                                                                                                                onClick={() => handleEdit(id, title)}
                                                                                                                                disabled={loadingFileSave === id || loadingDelete === id}
                                                                                                                            >
                                                                                                                                <Pencil size={18} />
                                                                                                                            </Button>
                                                                                                                            <Button
                                                                                                                                onClick={() =>
                                                                                                                                    handleDelete({
                                                                                                                                        levelId,
                                                                                                                                        semester: semesterKey,
                                                                                                                                        subject: subjectKey,
                                                                                                                                        section: sectionKey,
                                                                                                                                        id,
                                                                                                                                        fileUrl: downloadLink,
                                                                                                                                    })
                                                                                                                                }
                                                                                                                                disabled={loadingDelete === id || loadingFileSave === id}
                                                                                                                                className="relative"
                                                                                                                            >
                                                                                                                                {loadingDelete === id ? (
                                                                                                                                    <Loader className="animate-spin text-white" />
                                                                                                                                ) : (
                                                                                                                                    <Trash2 size={18} />
                                                                                                                                )}
                                                                                                                            </Button>
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                </>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </Draggable>
                                                                                            )
                                                                                        )}
                                                                                        {provided.placeholder}
                                                                                    </div>
                                                                                )}
                                                                            </Droppable>
                                                                        </DragDropContext>
                                                                    )}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        </Accordion>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </div>
            </div>
        </TutorialsLayout >
    );
};

export default LevelsPage;