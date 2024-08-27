import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { cn } from "@/libs/utils";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

function Sidebar({ tutorialData, className }) {
    const [data, setData] = useState(tutorialData);
    const [openCategoryKeys, setOpenCategoryKeys] = useState([]);
    const [openSemesterKeys, setOpenSemesterKeys] = useState({});
    const [openSubjectKeys, setOpenSubjectKeys] = useState({});

    const categoryRefs = useRef({});
    const semesterRefs = useRef({});
    const subjectRefs = useRef({});

    useEffect(() => {
        // Ensure that all sections are closed initially
        Object.keys(categoryRefs.current).forEach((categoryKey) => {
            gsap.set(categoryRefs.current[categoryKey], { height: 0, opacity: 0 });
        });

        Object.keys(semesterRefs.current).forEach((key) => {
            gsap.set(semesterRefs.current[key], { height: 0, opacity: 0 });
        });

        Object.keys(subjectRefs.current).forEach((key) => {
            gsap.set(subjectRefs.current[key], { height: 0, opacity: 0 });
        });
    }, [tutorialData]);

    const handleCategoryClick = (categoryKey) => {
        const isOpen = openCategoryKeys.includes(categoryKey);

        if (isOpen) {
            gsap.to(categoryRefs.current[categoryKey], {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    setOpenCategoryKeys((prev) => prev.filter((key) => key !== categoryKey));
                },
            });
        } else {
            gsap.fromTo(
                categoryRefs.current[categoryKey],
                { height: 0, opacity: 0 },
                { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
            );
            setOpenCategoryKeys((prev) => [...prev, categoryKey]);
        }
    };

    const handleSemesterClick = (categoryKey, semesterKey) => {
        const isOpen = openSemesterKeys[`${categoryKey}-${semesterKey}`] || false;

        if (isOpen) {
            gsap.to(semesterRefs.current[`${categoryKey}-${semesterKey}`], {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    setOpenSemesterKeys((prev) => ({
                        ...prev,
                        [`${categoryKey}-${semesterKey}`]: false,
                    }));
                },
            });
        } else {
            gsap.fromTo(
                semesterRefs.current[`${categoryKey}-${semesterKey}`],
                { height: 0, opacity: 0 },
                { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
            );
            setOpenSemesterKeys((prev) => ({
                ...prev,
                [`${categoryKey}-${semesterKey}`]: true,
            }));
        }
    };

    const handleSubjectClick = (categoryKey, semesterKey, subjectIndex) => {
        const key = `${categoryKey}-${semesterKey}-${subjectIndex}`;
        const isOpen = openSubjectKeys[key] || false;

        if (isOpen) {
            gsap.to(subjectRefs.current[key], {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    setOpenSubjectKeys((prev) => ({
                        ...prev,
                        [key]: false,
                    }));
                },
            });
        } else {
            gsap.fromTo(
                subjectRefs.current[key],
                { height: 0, opacity: 0 },
                { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
            );
            setOpenSubjectKeys((prev) => ({
                ...prev,
                [key]: true,
            }));
        }
    };

    function choseLevelTitle(categoryKey) {
        switch (categoryKey) {
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
        <aside className={cn(`bg-white rounded-lg border-2 border-primary p-6`, className)}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Accès Rapide</h2>
            {Object.entries(data).map(([categoryKey, semesters]) => (
                <div key={categoryKey}>
                    <div
                        className="flex justify-between items-center cursor-pointer text-lg font-semibold text-white bg-secondary p-1 rounded-md mb-4 border-l-4 border-primary pl-4 hover:underline"
                        onClick={() => handleCategoryClick(categoryKey)}
                    >
                        {choseLevelTitle(categoryKey)}
                        <ChevronDown
                            className={cn("transition-transform duration-300", {
                                "rotate-180": openCategoryKeys.includes(categoryKey),
                            })}
                        />
                    </div>
                    <div
                        ref={(el) => (categoryRefs.current[categoryKey] = el)}
                        className="pl-6 border-l-2 border-gray-300 overflow-hidden"
                    >
                        {Object.entries(semesters).map(([semesterKey, semester]) => (
                            <div key={semesterKey} className="mb-3">
                                <div
                                    className="flex justify-between items-center cursor-pointer text-lg font-semibold text-primary bg-secondary-hover/90 p-1 rounded-md mb-4 border-l-4 border-primary pl-4 hover:underline"
                                    onClick={() => handleSemesterClick(categoryKey, semesterKey)}
                                >
                                    {semester.title}
                                    <ChevronDown
                                        className={cn("transition-transform duration-300", {
                                            "rotate-180": openSemesterKeys[`${categoryKey}-${semesterKey}`],
                                        })}
                                    />
                                </div>
                                <div
                                    ref={(el) => (semesterRefs.current[`${categoryKey}-${semesterKey}`] = el)}
                                    className="overflow-hidden"
                                >
                                    <ul className="pl-6 space-y-4 overflow-hidden border-l-2 border-gray-300">
                                        {Object.entries(semester.subjects).map(([subjectKey, subject], subjectIndex) => {
                                            const key = `${categoryKey}-${semesterKey}-${subjectIndex}`;
                                            return (
                                                <li key={subjectKey} className="mb-4">
                                                    <div
                                                        className="flex justify-between items-center cursor-pointer text-base text-primary bg-destructive-hover p-1 rounded-md mb-2 border-l-2 border-primary pl-4 hover:underline"
                                                        onClick={() => handleSubjectClick(categoryKey, semesterKey, subjectIndex)}
                                                    >
                                                        {subject.title}
                                                        <ChevronDown
                                                            className={cn("transition-transform duration-300", {
                                                                "rotate-180": openSubjectKeys[key],
                                                            })}
                                                        />
                                                    </div>
                                                    <ul
                                                        ref={(el) => (subjectRefs.current[key] = el)}
                                                        className="pl-6 space-y-2 overflow-hidden border-l-2 border-gray-300"
                                                    >
                                                        {Object.entries(subject.sections).map(([sectionKey, section]) => (
                                                            <li key={sectionKey} className="text-sm text-primary bg-muted-hover p-1 rounded-md border-l-2 border-primary pl-4 hover:underline">
                                                                <Link href={"/"} className="flex justify-between items-center">
                                                                    {section.title}
                                                                    <SquareArrowOutUpRight className="pr-2" />
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </aside>
    );
}

export default Sidebar;
