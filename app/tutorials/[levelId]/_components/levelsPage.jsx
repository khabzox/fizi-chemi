"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { useUser } from "@clerk/nextjs";
import TutorialsLayout from "@/app/tutorials/_components/tutorials-layout.jsx";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

import { Grip, Loader } from "lucide-react";
import { Alert } from "@/components/ui/alert";

// Function to get subjects as an array from semesters
const getSubjectsArray = (semesters) => {
    return Object.keys(semesters).flatMap((semesterKey) => {
        const semester = semesters[semesterKey];
        return Object.keys(semester.subjects).map((subjectKey) => ({
            semester: semesterKey,
            subjectKey,
            ...semester.subjects[subjectKey],
        }));
    });
};


const LevelsPage = async ({ tutorialData, levelId }) => {
    const LEVEL_ID = levelId;
    const { user } = useUser();
    const isAdmin = user?.publicMetadata.role === "admin";

    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [semesters, setSemesters] = useState({});
    const [alertFileIsUploaded, setAlertFileIsUploaded] = useState("");
    const [progressViewerOfFile, setProgressViewerOfFile] = useState(0);

    const [formDataLesson, setFormDataLesson] = useState({
        title: "",
        downloadLink: "",
        fileLocation: []
    });

    useEffect(() => {
        // Fetch the specific level data based on levelId
        if (tutorialData && levelId) {
            setSemesters(tutorialData[levelId]);
        }
    }, [levelId, tutorialData]);

    console.log(semesters);
    console.log(levelId);

    const getFormattedSemesterName = (semester) => {
        switch (semester) {
            case "Semestre 1":
                return "semester_1";
            case "Semestre 2":
                return "semester_2";
            default:
                return "N/A";
        }
    };

    const getFormattedSubjectsName = (subject) => {
        switch (subject) {
            case "Physique":
                return "physics";
            case "Chimie":
                return "chemistry";
            default:
                return "N/A";
        }
    }

    const getFormattedSectionsName = (section) => {
        switch (section) {
            case "Cours":
                return "cours";
            case "Cours PowerPoint":
                return "course_powerpoint";
            case "Exercices corrigés":
                return "corrected_exercises";
            case "Devoirs surveillés":
                return "supervised_homework";
            case "Fiches pédagogiques":
                return "educational_sheets";
            case "Évaluations diagnostiques":
                return "diagnostic_assessments";
            case "Vidéos":
                return "videos";
            default:
                return "N/A";
        }
    };

    // Memoized semester and subject names
    const uniqueSemesters = useMemo(() => Object.values(semesters).map(sem => sem.title), [semesters]);

    const uniqueSubjects = useMemo(() => {
        const formattedSemesterName = getFormattedSemesterName(selectedSemester);
        const semesterData = semesters[formattedSemesterName];
        return semesterData ? Object.values(semesterData.subjects).map(sub => sub.title) : [];
    }, [selectedSemester, semesters]);

    const uniqueSectionTitles = useMemo(() => {
        if (selectedSemester && selectedSubjects) {
            const formattedSemesterName = getFormattedSemesterName(selectedSemester);
            const subjectData = semesters[formattedSemesterName]?.subjects[getFormattedSubjectsName(selectedSubjects)];
            return subjectData ? subjectData.sections.map(sec => sec.title) : [];
        }
        return [];
    }, [selectedSemester, selectedSubjects, semesters]);

    // Update file location reference
    useEffect(() => {
        const semester = getFormattedSemesterName(selectedSemester);
        const subject = getFormattedSubjectsName(selectedSubjects);
        const section = getFormattedSectionsName(selectedSection);

        setFormDataLesson((prev) => ({
            ...prev,
            fileLocation: [LEVEL_ID, semester, subject, section],
        }));
    }, [LEVEL_ID, selectedSemester, selectedSubjects, selectedSection]);

    async function uploadFile(file) {
        const storageRef = ref(
            storage,
            `${LEVEL_ID}/${getFormattedSemesterName(selectedSemester)}/subjects/${getFormattedSubjectsName(selectedSubjects)}/sections/${getFormattedSectionsName(selectedSection)}/${file.name}`
        );

        try {
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgressViewerOfFile(progress);
                },
                (error) => {
                    console.error("Error uploading file:", error);
                    setAlertFileIsUploaded("Error uploading file!");
                },
                async () => {
                    setProgressViewerOfFile(100);
                    setAlertFileIsUploaded("File uploaded successfully!");

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
        } catch (error) {
            console.error("Fetch error:", error);
            setErrorMessage("Failed to create lesson.");
        }
    }

    const resetForm = () => {
        setUploading(false);
        setSelectedFile(null);
        setFileTitle("");
        setSelectedSection("");
        setSelectedSemester("");
        setSelectedSubjects("");
        setSelectedSection("");
        setFormDataLesson({
            title: "",
            downloadLink: "",
            fileLocation: []
        });
    };

    const handleEdit = (fileIndex) => {
        console.log("Editing file", fileIndex);
    };

    const handleDelete = (fileIndex) => {
        console.log("Deleting file", fileIndex);
    };

    console.log(formDataLesson)

    return (
        <TutorialsLayout title="1ère Année Collège">
            <div className="w-full shadow-lg rounded-lg border-2 border-primary">
                <div className="p-4 bg-gray-100 border-b border-primary">
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
                            <form onSubmit={sendFormDataLesson}>
                                <div className="mb-4">
                                    <Label className="block mb-2" htmlFor="title">File Title:</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formDataLesson.title}
                                        type="text"
                                        className="p-2 border-2 border-primary bg-white rounded w-full placeholder:text-primary/60"
                                        placeholder="Enter file title..."
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="file" className="block mb-2">Upload File</Label>
                                    <Input
                                        id="downloadLink"
                                        name="downloadLink"
                                        type="file"
                                        onChange={handleChange}
                                        className="mb-4 bg-white text-primary"
                                        required
                                    />

                                    {/* Display progress bar if the progress is greater than 0 */}
                                    {progressViewerOfFile > 0 && (
                                        <div className="mb-4 flex items-center gap-2">
                                            <Progress
                                                value={progressViewerOfFile}
                                                className="bg-transparent border-2 border-primary"
                                            />
                                            {progressViewerOfFile}%
                                        </div>
                                    )}
                                    <Button
                                        type="submit" disabled={uploading}
                                        className="bg-primary text-white p-2 w-full rounded-lg"
                                    >
                                        {uploading ? "Uploading..." : "Upload"}
                                    </Button>

                                </div>
                            </form>
                        </>
                    )}
                </div>

                {/* Removed Drag and Drop Components */}
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
                                                                <AccordionItem value={sectionIndex.toString()}>
                                                                    <AccordionTrigger className="p-2 px-4 border-b border-primary">
                                                                        {section.title}
                                                                    </AccordionTrigger>
                                                                    <AccordionContent>
                                                                        {section.files.length === 0 ? (
                                                                            <p className="p-2 px-4 border-b border-primary">
                                                                                {`Il n'y a pas encore des ${section.title}`} 😅
                                                                            </p>
                                                                        ) : (section.files.map((file, fileIndex) => (
                                                                            <div
                                                                                key={fileIndex}
                                                                                className="p-4 border-b border-primary flex items-center justify-between"
                                                                            >
                                                                                <span>{file.title}</span>
                                                                                <div className="flex space-x-4 items-center">
                                                                                    <div className="flex space-x-2 items-center">
                                                                                        <Button onClick={() => handleEdit(fileIndex)}>Edit</Button>
                                                                                        <Button onClick={() => handleDelete(fileIndex)}>Delete</Button>
                                                                                    </div>
                                                                                    <Grip className="cursor-pointer" />
                                                                                </div>
                                                                            </div>
                                                                        )))}
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
