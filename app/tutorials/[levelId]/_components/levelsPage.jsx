/**
 * Renders the Levels page, allowing admins to manage tutorials by adding, editing, or deleting lessons.
 * @param {object} tutorialData - Initial tutorial data fetched from Firestore.
 * @param {string} tutorialData.levelId - ID of the current level.
 * @returns {ReactElement} LevelsPage React component.
 */


"use client";

import { useState, useEffect, useMemo, useRef } from "react";

import { useUser } from "@clerk/nextjs";

import TutorialsLayout from "@/app/tutorials/_components/tutorials-layout.jsx";

import { db, storage } from "@/config/firebase";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { Grip, Loader } from "lucide-react";

import {
    getFormattedSemesterName,
    getFormattedSubjectsName,
    getFormattedSectionsName
} from "./getFormatted";

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

    const handleEdit = (id, currentTitle) => {
        setEditingFile(id);
        setNewTitle(currentTitle);
    };

    const handleSave = async ({ levelId, semester, subject, section, id }) => {
        setLoadingFileSave(true);

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
        }
    };

    const handleCancel = () => {
        setEditingFile(null);
        setNewTitle('');
    };

    const handleDelete = async ({ levelId, semester, subject, section, id }) => {
        // Set loading to true immediately after the delete action is initiated
        setLoadingDelete(id);

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
        <TutorialsLayout tutorialData={tutorialData} title={choseLevelTitle(levelId)} pathName={levelId} path={levelId}>
            <div className="w-full shadow-lg border-2 border-primary rounded-lg">
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

                {Object.entries(semesters).map(([semesterKey, semester], sectionIndex) => (
                    <div key={semesterKey}>
                        <Accordion type="single" collapsible>
                            <AccordionItem value={`semester-${sectionIndex}`}>
                                <AccordionTrigger className="flex justify-between items-center bg-primary text-white p-4">
                                    <span>{semester.title}</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {Object.entries(semester.subjects).map(([subjectKey, subject], subjectIndex) => (
                                        <Accordion key={subjectKey} type="single" collapsible>
                                            <AccordionItem value={`subject-${subjectIndex}`}>
                                                <AccordionTrigger className="p-4 border-b bg-secondary-hover border-primary flex items-center">
                                                    {subject.title}

                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    {Object.entries(subject.sections).map(([sectionKey, section], sectionIndex) => (
                                                        <div key={sectionKey}>
                                                            <Accordion type="single" collapsible>
                                                                <AccordionItem value={sectionKey}>
                                                                    <AccordionTrigger className="p-2 px-4 border-b border-primary" alert={reorderSaving[sectionKey] ? "saving..." : ""}>
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
                                                                                                containerRef.current = ref;
                                                                                            }}
                                                                                        >
                                                                                            {Object.entries(section.files).map(
                                                                                                ([fileKey, { title, downloadLink, id, fileName }], fileIndex) => (
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

                                                                                                                key={id}
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
                                                                                                                                "Done"
                                                                                                                            )}
                                                                                                                        </Button>
                                                                                                                        <Button
                                                                                                                            onClick={handleCancel}
                                                                                                                            disabled={loadingFileSave}
                                                                                                                            className="relative"
                                                                                                                        >
                                                                                                                            Cancel
                                                                                                                        </Button>
                                                                                                                    </div>
                                                                                                                ) : (
                                                                                                                    <>
                                                                                                                        <Link
                                                                                                                            href={downloadLink}
                                                                                                                            download={
                                                                                                                                selectedSection === "Vidéos" ? downloadLink : undefined
                                                                                                                            }
                                                                                                                            target="_blank"
                                                                                                                            className="flex-1"
                                                                                                                        >
                                                                                                                            <div className="flex items-center py-2 justify-between cursor-pointer">
                                                                                                                                <span>{title}</span>
                                                                                                                            </div>
                                                                                                                        </Link>

                                                                                                                        {isAdmin && (
                                                                                                                            <div className="flex items-center space-x-4 py-1">
                                                                                                                                <Button
                                                                                                                                    onClick={() => handleEdit(id, title)}
                                                                                                                                    disabled={loadingFileSave}
                                                                                                                                >
                                                                                                                                    Edit
                                                                                                                                </Button>
                                                                                                                                <Button
                                                                                                                                    onClick={() =>
                                                                                                                                        handleDelete({
                                                                                                                                            levelId,
                                                                                                                                            semester: semesterKey,
                                                                                                                                            subject: subjectKey,
                                                                                                                                            section: sectionKey,
                                                                                                                                            id,
                                                                                                                                            fileName,
                                                                                                                                        })
                                                                                                                                    }
                                                                                                                                    disabled={loadingDelete === id || loadingFileSave}
                                                                                                                                    className="relative"
                                                                                                                                >
                                                                                                                                    {loadingDelete === id ? (
                                                                                                                                        <Loader className="animate-spin text-white" />
                                                                                                                                    ) : (
                                                                                                                                        "Delete"
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
                                                        </div>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                ))}

            </div>
        </TutorialsLayout >
    );
};

export default LevelsPage;