"use client";

import { useState, useMemo } from "react";
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
import { useUser } from "@clerk/nextjs";
import TutorialsLayout from "@/app/tutorials/_components/tutorials-layout.jsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/config/firebase";
import { Grip, Loader } from "lucide-react";

const initialSemesters = {
  semester_1: {
    title: "Semestre 1",
    subjects: {
      physics: {
        title: "Physique",
        sections: [
          {
            title: "Cours",
            files: [
              {
                title: "oxidation reduction - Pdf",
                downloadLink: "https://example.com/pdf",
              },
              {
                title: "loi de poisson - Pdf",
                downloadLink: "https://example.com/pdf",
              },
              {
                title: "loi de newton - Pdf",
                downloadLink: "https://example.com/pdf",
              }
            ],
          },
          {
            title: "Cours PowerPoint",
            files: [],
          },
          {
            title: "Exercices corrigés",
            files: [],
          },
          {
            title: "Devoirs surveillés",
            files: [],
          },
          {
            title: "Fiches pédagogiques",
            files: [],
          },
          {
            title: "Évaluations diagnostiques",
            files: [],
          },
          {
            title: "Vidéos",
            files: [],
          },
        ],
      },
      chemistry: {
        title: "Chimie",
        sections: [
          {
            title: "Cours",
            files: [
              {
                title: "oxidation reduction - Pdf",
                downloadLink: "https://example.com/pdf",
              },
              {
                title: "loi de poisson - Pdf",
                downloadLink: "https://example.com/pdf",
              },
              {
                title: "loi de newton - Pdf",
                downloadLink: "https://example.com/pdf",
              }
            ],
          },
          {
            title: "Cours PowerPoint",
            files: [],
          },
          {
            title: "Exercices corrigés",
            files: [],
          },
          {
            title: "Devoirs surveillés",
            files: [],
          },
          {
            title: "Fiches pédagogiques",
            files: [],
          },
          {
            title: "Évaluations diagnostiques",
            files: [],
          },
          {
            title: "Vidéos",
            files: [],
          },
        ],
      },
    }
  },
  semester_2: {
    title: "Semestre 2",
    subjects: {
      physics: {
        title: "Physique",
        sections: [
          {
            title: "Cours",
            files: [
              {
                title: "oxidation reduction - Pdf",
                downloadLink: "https://example.com/pdf",
              },
              {
                title: "loi de poisson - Pdf",
                downloadLink: "https://example.com/pdf",
              },
              {
                title: "loi de newton - Pdf",
                downloadLink: "https://example.com/pdf",
              }
            ],
          },
          {
            title: "Cours PowerPoint",
            files: [],
          },
          {
            title: "Exercices corrigés",
            files: [],
          },
          {
            title: "Devoirs surveillés",
            files: [],
          },
          {
            title: "Fiches pédagogiques",
            files: [],
          },
          {
            title: "Évaluations diagnostiques",
            files: [],
          },
          {
            title: "Vidéos",
            files: [],
          },
        ],
      },
      chemistry: {
        title: "Chimie",
        sections: [
          {
            title: "Cours",
            files: [
              {
                title: "oxidation reduction - Pdf",
                downloadLink: "https://example.com/pdf",
              },
              {
                title: "loi de poisson - Pdf",
                downloadLink: "https://example.com/pdf",
              },
              {
                title: "loi de newton - Pdf",
                downloadLink: "https://example.com/pdf",
              }
            ],
          },
          {
            title: "Cours PowerPoint",
            files: [],
          },
          {
            title: "Exercices corrigés",
            files: [],
          },
          {
            title: "Devoirs surveillés",
            files: [],
          },
          {
            title: "Fiches pédagogiques",
            files: [],
          },
          {
            title: "Évaluations diagnostiques",
            files: [],
          },
          {
            title: "Vidéos",
            files: [],
          },
        ],
      },
    }
  }
};

const LevelsPage = ({ params }) => {
  const LEVEL_ID = params.levelId;
  const { user } = useUser();
  const isAdmin = user?.publicMetadata.role === "admin";

  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [semesters, setSemesters] = useState(initialSemesters);

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
        return "Cours";
      case "Cours PowerPoint":
        return "Cours PowerPoint";
      case "Exercices corrigés":
        return "Exercices corrigés";
      case "Devoirs surveillés":
        return "Devoirs surveillés";
      case "Fiches pédagogiques":
        return "Fiches pédagogiques";
      case "Évaluations diagnostiques":
        return "Évaluations diagnostiques";
      case "Vidéos":
        return "Vidéos";
      default:
        return "N/A";
    }
  };


  const uniqueSemesters = useMemo(() => {
    return Object.values(semesters).map(semester => semester.title) || [];
  }, [semesters]);

  const uniqueSubjects = useMemo(() => {
    const formattedSemesterName = getFormattedSemesterName(selectedSemester);
    const semesterData = semesters[formattedSemesterName];
    return semesterData?.subjects ? Object.keys(semesterData.subjects) : [];
  }, [selectedSemester, semesters]);

  const uniqueSectionTitles = useMemo(() => {
    if (selectedSemester && selectedSubjects) {
      const formattedSemesterName = getFormattedSemesterName(selectedSemester);
      const subjectData = semesters[formattedSemesterName]?.subjects[getFormattedSubjectsName(selectedSubjects)];
      return subjectData?.sections ? subjectData.sections.map(section => section.title) : [];
    }
    return [];
  }, [selectedSemester, selectedSubjects, semesters]);
  // Debugging statement
  console.log(`${LEVEL_ID}/${getFormattedSemesterName(selectedSemester)}/subjects/${selectedSubjects}/sections/${selectedSection}`);

  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  const handleTitleChange = (event) => setFileTitle(event.target.value);

  const handleUpload = async () => {
    if (!selectedFile || !selectedSection || !fileTitle) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", fileTitle);
      formData.append("section", selectedSection);

      const response = await fetch("/api/tutorials/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setSuccessMessage("File uploaded successfully.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      resetForm();
    }
  };

  const resetForm = () => {
    setUploading(false);
    setSelectedFile(null);
    setFileTitle("");
    setSelectedSection("");
  };


  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.droppableId !== destination.droppableId) return;

    const [semesterKey, subjectKey] = source.droppableId.split("-");
    const semesterData = semesters[semesterKey];
    if (!semesterData) return;

    const subjectData = semesterData.subjects[subjectKey];
    if (!subjectData) return;

    const files = [...subjectData.files];
    const [movedFile] = files.splice(source.index, 1);
    files.splice(destination.index, 0, movedFile);

    setSemesters({
      ...semesters,
      [semesterKey]: {
        ...semesterData,
        subjects: {
          ...semesterData.subjects,
          [subjectKey]: {
            ...subjectData,
            files
          }
        }
      }
    });
  };


  const handleEdit = (fileIndex) => {
    console.log("Editing file", fileIndex);
  };

  const handleDelete = (fileIndex) => {
    console.log("Deleting file", fileIndex);
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

        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(semesters).map(([semesterKey, semester], sectionIndex) => (
            <Droppable key={semesterKey} droppableId={`semester-${semesterKey}`} direction="vertical">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
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
                                {subject.sections.map((section, sectionIndex) => (
                                  <Droppable
                                    key={sectionIndex}
                                    droppableId={`semester-${semesterKey}-subject-${subjectKey}-section-${sectionIndex}`}
                                    type="TASK"
                                  >
                                    {(provided) => (
                                      <div ref={provided.innerRef} {...provided.droppableProps}>
                                        <Accordion type="single" collapsible>
                                          <AccordionItem value={sectionIndex.toString()}>
                                            <AccordionTrigger className="p-2 border-b border-primary">
                                              {section.title}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                              {section.files.length === 0 ? (
                                                <p className="p-2 border-b border-primary">
                                                  No files exist
                                                </p>
                                              ) : (section.files.map((file, fileIndex) => (
                                                <Draggable
                                                  key={fileIndex}
                                                  draggableId={`file-${fileIndex}`}
                                                  index={fileIndex}
                                                >
                                                  {(provided) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
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
                                                  )}
                                                </Draggable>
                                              )))}
                                              {provided.placeholder}
                                            </AccordionContent>
                                          </AccordionItem>
                                        </Accordion>
                                      </div>
                                    )}
                                  </Droppable>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </TutorialsLayout>
  );
};

export default LevelsPage;
