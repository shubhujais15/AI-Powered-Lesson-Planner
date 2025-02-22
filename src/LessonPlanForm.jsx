import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const LessonPlanForm = () => {
  const [lessonPlan, setLessonPlan] = useState({
    topic: "",
    gradeLevel: "",
    mainConcept: "",
    subtopics: "",
    materials: "",
    objectives: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonPlan({ ...lessonPlan, [name]: value });
  };

  const extractLessonOutline = (text) => {
    const cleanedText = text
      .replace(/[*-]/g, "") // Remove bullets
      .replace(/\n\s*\n/g, "\n\n") // Normalize spacing
      .trim();

    console.log("🔹 Cleaned AI Response:\n", cleanedText);

    const sections = cleanedText.split("\n\n"); // Split sections based on newlines

    const outline = sections
      .map((section) => {
        const match = section.match(/(\d+)\s*mins?/i); // Extract duration
        if (!match) return null;

        const guideText = section
          .replace(/^\d+\.\s*/, "") // Remove numbering like "1. "
          .replace(match[0], "") // Remove "15 mins" part
          .replace(/\(utes\)/gi, "") // Remove incorrect "utes" text
          .trim();

        return {
          duration: `${match[1]} mins`,
          guide: guideText || "Topic Not Extracted",
        };
      })
      .filter(Boolean);

    console.log("✅ Extracted Lesson Outline:", outline);
    return outline.length ? outline : [{ duration: "-", guide: "No outline available" }];
  };

  const generateLessonPlan = async () => {
    if (Object.values(lessonPlan).some((value) => value.trim() === "")) {
      alert("Please fill in all fields before generating the lesson plan.");
      return;
    }

    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Generate a structured and detailed lesson plan based on the following input: 

      - Topic: ${lessonPlan.topic}
      - Grade Level: ${lessonPlan.gradeLevel}
      - Main Concept: ${lessonPlan.mainConcept}
      - Subtopics: ${lessonPlan.subtopics}
      - Materials Needed: ${lessonPlan.materials}
      - Learning Objectives: ${lessonPlan.objectives}
      
      The lesson plan should include:
      - A structured **Lesson Outline** with 6-8 sections.
      - Each section should have:
          1. **Duration (in minutes)**
          2. **Main Topic & Subtopics Covered in brief about 20-40 words**
      - Present the output clearly and concisely.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      console.log("Generated Lesson Plan:\n", text);

      const extractedOutline = extractLessonOutline(text);
      console.log("Extracted Outline:", extractedOutline);

      const structuredLessonPlan = {
        ...lessonPlan,
        date: new Date().toLocaleDateString(),
        outline: extractedOutline.length ? extractedOutline : [{ duration: "-", guide: "No outline available" }],
      };

      navigate("/lesson-plan", { state: { lessonPlan: structuredLessonPlan } });
    } catch (error) {
      console.error("Error fetching lesson plan:", error);
      alert("Failed to generate lesson plan. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-2xl rounded-xl border border-gray-300 bg-white p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-3xl font-bold text-gray-900">
              📚 Lesson Plan Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                { name: "topic", label: "Lesson Topic" },
                { name: "gradeLevel", label: "Grade Level" },
                { name: "mainConcept", label: "Main Concept" },
                { name: "subtopics", label: "Subtopics" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <Label className="text-sm font-semibold text-gray-700">{label}</Label>
                  <Input
                    type="text"
                    name={name}
                    value={lessonPlan[name]}
                    onChange={handleChange}
                    className="mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              ))}

              {[
                { name: "materials", label: "Materials Needed" },
                { name: "objectives", label: "Learning Objectives" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <Label className="text-sm font-semibold text-gray-700">{label}</Label>
                  <Textarea
                    name={name}
                    value={lessonPlan[name]}
                    onChange={handleChange}
                    className="mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              ))}
            </div>

            <Button
              onClick={generateLessonPlan}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg mt-6 py-2 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} /> Generating...
                </span>
              ) : (
                "Generate Lesson Plan"
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LessonPlanForm;
