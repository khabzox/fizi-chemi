"use client";

import { useState, useRef } from "react";
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
import TutorialsLayout from "../../_components/tutorials-layout";
import { Grip } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,
  // background: isDragging ? "#ea5455" : "#002b5b",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  // padding: grid,
  width: "100%",
});

const LevelsPage = ({ params }) => {
  const LEVEL_ID = params.levelId;

  const { user } = useUser();
  const admin = user?.publicMetadata.role === "admin";

  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [sections, setSections] = useState([
    {
      semester: "Semestre 1",
      items: [
        {
          title: "Physique",
          items: [
            {
              title: "Cours",
              files: [],
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
        {
          title: "Chimie",
          items: [
            {
              title: "Cours",
              files: [],
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
      ],
    },
    {
      semester: "Semestre 2",
      items: [
        {
          title: "Physique",
          items: [
            {
              title: "Cours",
              files: [],
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
        {
          title: "Chimie",
          items: [
            {
              title: "Cours",
              files: [],
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
      ],
    },
  ]);

  const uniqueSections = [
    ...new Set(
      sections.flatMap((section) =>
        section.items.flatMap((subject) =>
          subject.items.map((item) => item.title)
        )
      )
    ),
  ];

  const uniqueSemester = [
    ...new Set(sections.flatMap((semester) => semester.semester)),
  ];

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setFileTitle(event.target.value);
  };

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
        body: JSON.stringify({
          level: LEVEL_ID,
          title: fileTitle,
          section: selectedSection,
          files: [selectedFile.name],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Upload failed");

      setSuccessMessage("File uploaded successfully.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setFileTitle("");
      setSelectedSection("");
    }
  };

  const handleEdit = (fileIndex, sectionIndex, subjectIndex, itemIndex) => {
    const newTitle = prompt(
      "Enter new title:",
      sections[sectionIndex].items[subjectIndex].items[itemIndex].files[
        fileIndex
      ]
    );
    if (newTitle) {
      const updatedSections = [...sections];
      updatedSections[sectionIndex].items[subjectIndex].items[itemIndex].files[
        fileIndex
      ] = newTitle;
      setSections(updatedSections);
      // Optionally save changes to backend
    }
  };

  const handleDelete = (fileIndex, sectionIndex, subjectIndex, itemIndex) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (confirmDelete) {
      const updatedSections = [...sections];
      updatedSections[sectionIndex].items[subjectIndex].items[
        itemIndex
      ].files.splice(fileIndex, 1);
      setSections(updatedSections);
      // Optionally remove from backend
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) return;

    const [sectionIndex, subjectIndex] = source.droppableId
      .split("-")
      .map(Number);
    const items = Array.from(sections[sectionIndex].items[subjectIndex].files);
    const [movedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, movedItem);

    const newSections = [...sections];
    newSections[sectionIndex].items[subjectIndex].files = items;
    setSections(newSections);
  };

  console.log(selectedSemester);
  return (
    <TutorialsLayout title="1ère Année Collège">
      <div className="w-full shadow-lg rounded-lg border-2 border-primary">
        <div className="p-4 bg-gray-100 border-b border-primary">
          <h2 className="text-xl font-semibold mb-2">Admin Upload</h2>

          {errorMessage && (
            <div className="mb-4 p-2 text-red-600 border border-red-600 bg-red-100 rounded">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-2 text-green-600 border border-green-600 bg-green-100 rounded">
              {successMessage}
            </div>
          )}

          <div className="mb-4">
            <Label className="block mb-2">Select Semester:</Label>
            <Select
              onValueChange={(value) => setSelectedSemester(value)}
              value={selectedSemester}
            >
              <SelectTrigger className="border-2 border-primary">
                <SelectValue placeholder="-- Select a Semester --" />
              </SelectTrigger>
              <SelectContent>
                {uniqueSemester.map((semesterTitle, index) => (
                  <SelectItem key={index} value={semesterTitle}>
                    {semesterTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label className="block mb-2 mt-4">Select Section:</Label>
            <Select
              onValueChange={(value) => setSelectedSection(value)}
              value={selectedSection}
            >
              <SelectTrigger className="border-2 border-primary">
                <SelectValue placeholder="-- Select a Section --" />
              </SelectTrigger>
              <SelectContent>
                {uniqueSections.map((sectionTitle, index) => (
                  <SelectItem key={index} value={sectionTitle}>
                    {sectionTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSection && (
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
          )}

          {selectedSection && (
            <div>
              <Input
                type="file"
                onChange={handleFileChange}
                className="mb-4 bg-white text-primary"
              />
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-primary text-white p-2 rounded"
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          )}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          {sections.map((section, sectionIndex) => (
            <Droppable
              key={sectionIndex}
              droppableId={`section-${sectionIndex}`}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={getListStyle(false)}
                >
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`section-${sectionIndex}`}>
                      <AccordionTrigger className="flex justify-between items-center bg-black text-white p-4">
                        <span>{section.semester}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        {section.items.map((subject, subjectIndex) => (
                          <Accordion
                            key={subjectIndex}
                            type="single"
                            collapsible
                          >
                            <AccordionItem value={`subject-${subjectIndex}`}>
                              <AccordionTrigger className="p-4 border-b bg-secondary-hover border-primary">
                                {subject.title}
                              </AccordionTrigger>
                              <AccordionContent>
                                <Droppable
                                  droppableId={`subject-${subjectIndex}`}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      style={getListStyle(false)}
                                    >
                                      {subject.items.map((item, itemIndex) => (
                                        <Accordion
                                          key={itemIndex}
                                          type="single"
                                          collapsible
                                        >
                                          <AccordionItem
                                            value={`item-${itemIndex}`}
                                          >
                                            <AccordionTrigger className="p-4 border-b border-primary">
                                              {item.title}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                              <Droppable
                                                droppableId={`item-${itemIndex}`}
                                              >
                                                {(provided) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    style={getListStyle(false)}
                                                  >
                                                    {item.files.map(
                                                      (file, fileIndex) => (
                                                        <Draggable
                                                          key={fileIndex}
                                                          draggableId={`file-${fileIndex}`}
                                                          index={fileIndex}
                                                        >
                                                          {(
                                                            provided,
                                                            snapshot
                                                          ) => (
                                                            <div
                                                              ref={
                                                                provided.innerRef
                                                              }
                                                              {...provided.draggableProps}
                                                              {...provided.dragHandleProps}
                                                              style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided
                                                                  .draggableProps
                                                                  .style
                                                              )}
                                                            >
                                                              <li className="p-4 flex justify-between items-center">
                                                                <div className="flex gap-2">
                                                                  <Grip className="text-gray-400 cursor-pointer" />
                                                                  {file}
                                                                </div>
                                                                <div>
                                                                  <Button
                                                                    onClick={() =>
                                                                      handleEdit(
                                                                        fileIndex
                                                                      )
                                                                    }
                                                                    className="mr-2 bg-green-600 hover:bg-green-600/90 px-2 text-white p-1 rounded"
                                                                  >
                                                                    Edit
                                                                  </Button>
                                                                  <Button
                                                                    onClick={() =>
                                                                      handleDelete(
                                                                        fileIndex
                                                                      )
                                                                    }
                                                                    className="bg-red-600 hover:bg-red-600/90 px-2 text-white p-1 rounded"
                                                                  >
                                                                    Delete
                                                                  </Button>
                                                                </div>
                                                              </li>
                                                            </div>
                                                          )}
                                                        </Draggable>
                                                      )
                                                    )}
                                                    {provided.placeholder}
                                                  </div>
                                                )}
                                              </Droppable>
                                            </AccordionContent>
                                          </AccordionItem>
                                        </Accordion>
                                      ))}
                                    </div>
                                  )}
                                </Droppable>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  {provided.placeholder}
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
