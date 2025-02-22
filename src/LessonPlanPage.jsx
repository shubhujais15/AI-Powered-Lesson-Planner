import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Moon, Sun } from "lucide-react";

const LessonPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lessonPlan, setLessonPlan] = useState(location?.state?.lessonPlan || { outline: [], materials: [], objectives: [] });
  const [darkMode, setDarkMode] = useState(false);

  const [remarks, setRemarks] = useState([]);
  const lessonPlanRef = useRef();
  const [outline, setOutline] = useState(lessonPlan.outline || []);

  // Apply dark mode class to HTML root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    console.log("Lesson Outline Data:", lessonPlan.outline);
  }, [lessonPlan]);

  if (!lessonPlan.topic) {
    return <div className="text-center mt-10 text-xl">No lesson plan found. Please generate one first.</div>;
  }

const downloadPDF = () => {
  try {
    const pdf = new jsPDF();

    // Title
    pdf.setFontSize(18);
    pdf.text("Lesson Plan", 105, 10, { align: "center" });

    if (!lessonPlan) {
      console.error("No lesson plan data available.");
      return;
    }

    // Convert materials & objectives to an array if they are strings
    const materialsList = Array.isArray(lessonPlan.materials)
      ? lessonPlan.materials
      : lessonPlan.materials?.split(",")?.map((item) => item.trim()) || ["NIL"];

    const objectivesList = Array.isArray(lessonPlan.objectives)
      ? lessonPlan.objectives
      : lessonPlan.objectives?.split("\n")?.map((item) => item.trim()) || ["NIL"];

    // Summary Section
    const summary = [
      ["Topic", lessonPlan.topic || "NIL"],
      ["Date", lessonPlan.date || "NIL"],
      ["Subject", lessonPlan.subject || lessonPlan.topic || "NIL"],
      ["Grade Level", lessonPlan.gradeLevel || "NIL"],
      ["Main Topic", lessonPlan.mainConcept || "NIL"],
      ["Subtopics", lessonPlan.subtopics || "NIL"]
    ];
    pdf.autoTable({
      startY: 20,
      head: [["Field", "Value"]],
      body: summary,
      theme: "striped",
    });

    // Materials Needed
    pdf.text("Materials Needed", 14, pdf.lastAutoTable.finalY + 10);
    pdf.autoTable({
      startY: pdf.lastAutoTable.finalY + 15,
      body: materialsList.map((item) => [item]),
    });

    // Learning Objectives
    pdf.text("Learning Objectives", 14, pdf.lastAutoTable.finalY + 10);
    pdf.autoTable({
      startY: pdf.lastAutoTable.finalY + 15,
      body: objectivesList.map((obj) => [obj]),
    });

    // Lesson Outline with Remarks
    if (lessonPlan.outline?.length) {
      pdf.text("Lesson Outline", 14, pdf.lastAutoTable.finalY + 10);
      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 15,
        head: [["Duration", "Guide", "Remarks"]],
        body: lessonPlan.outline.map((row, index) => [
          row.duration || "NIL",
          row.guide || "NIL",
          remarks[index] || "NIL", // Ensures remarks are displayed
        ]),
        theme: "grid",
      });
    } else {
      pdf.text("Lesson Outline: NIL", 14, pdf.lastAutoTable.finalY + 10);
    }

    // Notes Section
    const notes = lessonPlan.notes || "NIL";
    pdf.text("Notes", 14, pdf.lastAutoTable.finalY + 10);
    pdf.autoTable({
      startY: pdf.lastAutoTable.finalY + 15,
      body: [[notes]],
    });

    // Debugging: Log before saving
    console.log("Generating and saving PDF...");

    // Save the PDF
    pdf.save("lesson-plan.pdf");

    console.log("PDF successfully downloaded.");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const handleOutlineChange = (index, field, value) => {
  const updatedOutline = [...outline];
  updatedOutline[index][field] = value;
  setOutline(updatedOutline);
};



  return (
    <div className={`flex flex-col items-center min-h-screen p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
   {/* Dark Mode Toggle */}
   <button 
    onClick={() => setDarkMode(!darkMode)} 
    className="absolute top-5 right-5 p-2 rounded-full transition-colors duration-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
  >
    {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800 dark:text-gray-200" />}
  </button>
  <Card ref={lessonPlanRef} id="lesson-plan" className="w-full max-w-4xl shadow-xl rounded-xl border transition-colors duration-300 border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 p-6">
    <CardHeader>
      <h2 className="text-3xl font-bold text-indigo-900 dark:text-indigo-300 text-center">📖 Topic: {lessonPlan.topic}</h2>
      <hr className="my-3 border-gray-300 dark:border-gray-600" />
    </CardHeader>
    <CardContent>
      <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-3 font-bold text-lg rounded-t-md">Summary</div>
      <div className="border border-gray-300 dark:border-gray-600 rounded-b-md overflow-hidden bg-white dark:bg-gray-700">
        {[{ label: "Date", key: "date" }, 
          { label: "Subject", key: "subject", fallback: "topic" },
          { label: "Grade Level", key: "gradeLevel" }, 
          { label: "Main Topic or Unit", key: "mainConcept" }, 
          { label: "Subtopics", key: "subtopics" }].map((item, index) => (
            <div key={index} className="grid grid-cols-2 border-b last:border-none p-3 bg-white dark:bg-gray-800">
              <p className="font-semibold text-gray-700 dark:text-gray-300">{item.label}:</p>
              <input
                type="text"
                value={lessonPlan[item.key] || lessonPlan[item.fallback] || ""}
                onChange={(e) => setLessonPlan({ ...lessonPlan, [item.key]: e.target.value })}
                className="text-gray-900 dark:text-gray-200 w-full p-1 border dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              />
            </div>
          ))
          }
      </div>

      {/* Materials Needed Section */}
      <div className="bg-gray-900 dark:bg-gray-700 text-white p-3 font-bold text-lg mt-6 rounded-t-md">Materials Needed</div>
      <div className="border border-gray-300 dark:border-gray-600 p-4 space-y-2 rounded-b-md bg-white dark:bg-gray-800">
        {(Array.isArray(lessonPlan.materials) ? lessonPlan.materials : lessonPlan.materials?.split(",") || []).map((material, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox />
            <input
              type="text"
              value={material.trim()}
              onChange={(e) => {
                const updatedMaterials = [...lessonPlan.materials];
                updatedMaterials[index] = e.target.value;
                setLessonPlan({ ...lessonPlan, materials: updatedMaterials });
              }}
              className="w-full p-1 border rounded bg-white dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
        ))}
      </div>

      {/* Learning Objectives Section */}
      <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-3 font-bold text-lg mt-6 rounded-t-md">Learning Objectives</div>
      <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-b-md bg-white dark:bg-gray-800">
        <textarea
          value={Array.isArray(lessonPlan.objectives) ? lessonPlan.objectives.join("\n") : lessonPlan.objectives || ""}
          onChange={(e) => setLessonPlan({ ...lessonPlan, objectives: e.target.value.split("\n") })}
          className="w-full p-2 border rounded resize-none bg-white dark:bg-gray-700 dark:text-gray-200"
          rows={4}
        />
      </div>

      <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-3 font-bold text-lg mt-6 rounded-t-md">Lesson Outline</div>
      <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-b-md bg-white dark:bg-gray-800 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-indigo-200 dark:bg-indigo-500 text-black dark:text-white border border-indigo-400">
              <th className="border border-indigo-400 p-3 font-bold text-left">Duration</th>
              <th className="border border-indigo-400 p-3 font-bold text-left">Guide</th>
              <th className="border border-indigo-400 p-3 font-bold text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {lessonPlan.outline.length > 0 ? (
              lessonPlan.outline.map((row, index) => (
                <tr key={index} className="bg-indigo-50 dark:bg-gray-700 border border-indigo-300 dark:border-gray-600">
                  <td className="border border-indigo-400 dark:border-gray-500 p-3">
                    <input
                    type="text"
                    value={row.duration || ""}
                    onChange={(e) => handleOutlineChange(index, "duration", e.target.value)}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-200"
                  /></td>
                  <td className="border border-indigo-400 dark:border-gray-500 p-3">
                  <textarea
                    value={row.guide || ""}
                    onChange={(e) => handleOutlineChange(index, "guide", e.target.value)}
                    className="w-full p-2 border rounded resize-none bg-white dark:bg-gray-700 dark:text-gray-200"
                    rows={2}
                  /></td>
                  <td className="border border-indigo-400 dark:border-gray-500 p-3">
                    <Textarea
                      value={remarks[index] || ""}
                      onChange={(e) => {
                        const updatedRemarks = [...remarks];
                        updatedRemarks[index] = e.target.value;
                        setRemarks(updatedRemarks);
                      }}
                      placeholder="Add reminders..."
                      className="border-none bg-transparent dark:bg-gray-700 dark:text-gray-200 focus:ring-0"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">No lesson outline available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        {/* Notes */}
        <div className="bg-blue-600 text-white p-2 font-bold text-lg mt-6">Notes</div>
          <div className="border border-gray-300 p-4">
            <Textarea
              placeholder="Include your pre-lesson reminders or post-discussion observations here..."
              className="w-full border-none bg-transparent focus:ring-0"
            />
          </div>
    </CardContent>
  </Card>
  <div className="w-full max-w-4xl flex flex-col space-y-2 mt-6">
        <Button onClick={downloadPDF} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 font-semibold">Download as PDF</Button>
        <Button onClick={() => navigate("/lesson-planner")} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 font-semibold">Back to Form</Button>
      </div>
    </div>
  );
};

export default LessonPlanPage;