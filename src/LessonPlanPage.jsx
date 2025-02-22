import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LessonPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lessonPlan = useMemo(() => location?.state?.lessonPlan || { outline: [] }, [location.state?.lessonPlan]);

  const [remarks, setRemarks] = useState([]);
  const lessonPlanRef = useRef();

  useEffect(() => {
    console.log("Lesson Outline Data:", lessonPlan.outline);
  }, [lessonPlan]);

  if (!lessonPlan.topic) {
    return <div className="text-center mt-10 text-xl">No lesson plan found. Please generate one first.</div>;
  }

  const downloadPDF = () => {
    const element = lessonPlanRef.current;
    html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft > 0) {
        position -= 297;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save("lesson-plan.pdf");
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Card ref={lessonPlanRef} id="lesson-plan" className="w-full max-w-4xl shadow-xl rounded-xl border border-gray-200 bg-white p-6">
        <CardHeader>
          <h2 className="text-3xl font-bold text-indigo-900 text-center">📖 Topic: {lessonPlan.topic}</h2>
          <hr className="my-3 border-gray-300" />
        </CardHeader>
        <CardContent>
          <div className="bg-indigo-600 text-white p-3 font-bold text-lg rounded-t-md">Summary</div>
          <div className="border border-gray-300 rounded-b-md overflow-hidden">
            {[{ label: "Date", value: lessonPlan.date }, { label: "Subject", value: lessonPlan.subject || lessonPlan.topic }, { label: "Grade Level", value: lessonPlan.gradeLevel }, { label: "Main Topic or Unit", value: lessonPlan.mainConcept }, { label: "Subtopics", value: lessonPlan.subtopics }].map((item, index) => (
              <div key={index} className="grid grid-cols-2 border-b last:border-none p-3 bg-white">
                <p className="font-semibold text-gray-700">{item.label}:</p>
                <p className="text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 text-white p-3 font-bold text-lg mt-6 rounded-t-md">Materials Needed</div>
          <div className="border border-gray-300 p-4 space-y-2 rounded-b-md bg-white">
            {(Array.isArray(lessonPlan.materials) ? lessonPlan.materials : lessonPlan.materials?.split(",") || []).map((material, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox />
                <p>{material.trim()}</p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-600 text-white p-3 font-bold text-lg mt-6 rounded-t-md">Learning Objectives</div>
          <div className="border border-gray-300 p-4 rounded-b-md bg-white">
            <ul className="list-disc pl-5 text-gray-900">
              {(Array.isArray(lessonPlan.objectives) ? lessonPlan.objectives : lessonPlan.objectives?.split("\n") || []).map((objective, index) => (
                <li key={index}>{objective.trim()}</li>
              ))}
            </ul>
          </div>

          <div className="bg-indigo-600 text-white p-3 font-bold text-lg mt-6 rounded-t-md">Lesson Outline</div>
          <div className="border border-gray-300 p-4 rounded-b-md bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-200 text-black border border-indigo-400">
                  <th className="border border-indigo-400 p-3 font-bold text-left">Duration</th>
                  <th className="border border-indigo-400 p-3 font-bold text-left">Guide</th>
                  <th className="border border-indigo-400 p-3 font-bold text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {lessonPlan.outline.length > 0 ? (
                  lessonPlan.outline.map((row, index) => (
                    <tr key={index} className="bg-indigo-50 border border-indigo-300">
                      <td className="border border-indigo-400 p-3">{row.duration}</td>
                      <td className="border border-indigo-400 p-3">{row.guide}</td>
                      <td className="border border-indigo-400 p-3">
                        <Textarea
                          value={remarks[index] || ""}
                          onChange={(e) => {
                            const updatedRemarks = [...remarks];
                            updatedRemarks[index] = e.target.value;
                            setRemarks(updatedRemarks);
                          }}
                          placeholder="Add reminders..."
                          className="border-none bg-transparent focus:ring-0"
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