import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import LessonPlanForm from "./LessonPlanForm";
import LessonPlanPage from "./LessonPlanPage"; // Import the new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lesson-planner" element={<LessonPlanForm />} />
        <Route path="/lesson-plan" element={<LessonPlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
