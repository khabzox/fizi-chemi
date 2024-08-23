"use client";

import { useState, useEffect, useMemo } from "react";


import { useUser } from "@clerk/nextjs";

import TutorialsLayout from "@/app/tutorials/_components/tutorials-layout.jsx";

import { db, storage } from "@/config/firebase";
import { doc, onSnapshot, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';

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

const LevelsPage = ({ tutorialData, levelId }) => {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata.role === "admin";

    const [semesters, setSemesters] = useState(tutorialData[levelId]);
    const [editingFile, setEditingFile] = useState(null); // Track which file is being edited
    const [newTitle, setNewTitle] = useState(''); // Track the new title for the file
    const [loadingFileSave, setLoadingFileSave] = useState(false); // Loading state for saving changes
    const [loadingDelete, setLoadingDelete] = useState(null); // Track loading state for deleting a file

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
        console.log({ levelId, semester, subject, section, id });

        // Set loading to true immediately after the delete action is initiated
        setLoadingDelete(id); // Set the loading state to the ID of the file being deleted

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

                console.log("File reference removed from Firestore");

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
            setLoadingDelete(null); // Reset the loading state
        }
    };



    return (
        <TutorialsLayout title="1ère Année Collège">
            <div className="w-full shadow-lg rounded-lg border-2 border-primary">
                <div className="p-4 bg-gray-100 border-b border-primary">
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
                                                {subjectsTitle}
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
                            <div className="mb-4">
                                <Label className="block mb-2">File Title:</Label>
                                <Input
                                    type="text"
                                    value={fileTitle}
                                    onChange={handleTitleChange}
                                    className="p-2 border-2 border-primary bg-white rounded w-full placeholder:text-primary/60"
                                    placeholder="Enter file title..."
                                />
                            </div>

                            <div>
                                <Input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="mb-4 bg-white text-primary"
                                />
                                <Button onClick={handleUpload} disabled={uploading} className="bg-primary text-white p-2 rounded">
                                    {uploading ? "Uploading..." : "Upload"}
                                </Button>
                            </div>
                        </>
                    )}
                </div>


                {Object.entries(semesters).map(([semesterKey, semester], sectionIndex) => (
                    <div key={semesterKey}>
                        <Accordion type="single" collapsible>
                            <AccordionItem value={`semester-${sectionIndex}`}>
                                <AccordionTrigger className="flex justify-between items-center bg-black text-white p-4">
                                    <span>{semester.title}</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {Object.entries(semester.subjects).map(([subjectKey, subject], subjectIndex) => (
                                        <Accordion key={subjectKey} type="single" collapsible>
                                            <AccordionItem value={`subject-${subjectIndex}`}>
                                                <AccordionTrigger className="p-4 border-b bg-secondary-hover border-primary">
                                                    {subject.title}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    {Object.entries(subject.sections).map(([sectionKey, section], sectionIndex) => (
                                                        <div key={sectionKey}>
                                                            <Accordion type="single" collapsible>
                                                                <AccordionItem value={sectionKey}>
                                                                    <AccordionTrigger className="p-2 px-4 border-b border-primary">
                                                                        {section.title}
                                                                    </AccordionTrigger>
                                                                    <AccordionContent>
                                                                        {Object.keys(section.files).length === 0 ? (
                                                                            <p className="p-2 px-4 border-b border-primary">
                                                                                {`Il n'y a pas encore des ${section.title}`} 😅
                                                                            </p>
                                                                        ) : (
                                                                            Object.entries(section.files).map(([fileKey, { title, id, fileName }], fileIndex) => (
                                                                                <div
                                                                                    key={id}
                                                                                    className="p-4 border-b border-primary flex items-center justify-between"
                                                                                >
                                                                                    {editingFile === id ? (
                                                                                        <>
                                                                                            <Input
                                                                                                value={newTitle}
                                                                                                onChange={(e) => setNewTitle(e.target.value)}
                                                                                                className="flex-1 mr-2 bg-white border-2 border-primary"
                                                                                            />
                                                                                            <Button
                                                                                                onClick={() => handleSave({ levelId, semester: semesterKey, subject: subjectKey, section: sectionKey, id })}
                                                                                                disabled={loadingFileSave}
                                                                                                className="relative mr-2"
                                                                                            >
                                                                                                {loadingFileSave ? (
                                                                                                    <Loader className="animate-spin h-5 w-5 text-white" />
                                                                                                ) : (
                                                                                                    "Done"
                                                                                                )}
                                                                                            </Button>
                                                                                            <Button onClick={handleCancel} disabled={loadingFileSave ? true : false} className="relative">
                                                                                                Cancel
                                                                                            </Button>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <span>{title}</span>
                                                                                            <div className="flex space-x-4 items-center">
                                                                                                <Button onClick={() => handleEdit(id, title)} disabled={loadingFileSave ? true : false} >Edit</Button>
                                                                                                <Button
                                                                                                    onClick={() => handleDelete({ levelId, semester: semesterKey, subject: subjectKey, section: sectionKey, id, fileName })}
                                                                                                    disabled={loadingDelete === id || loadingFileSave ? true : false}
                                                                                                    className="relative"
                                                                                                >
                                                                                                    {loadingDelete === id ? (
                                                                                                        <Loader className="animate-spin h-5 w-5 text-white" />
                                                                                                    ) : (
                                                                                                        "Delete"
                                                                                                    )}
                                                                                                </Button>
                                                                                            </div>
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            ))
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
        </TutorialsLayout>
    );
};

export default LevelsPage;