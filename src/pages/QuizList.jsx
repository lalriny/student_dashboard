import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/apiClient";
import QuizCard from "../components/QuizCard";
import "../styles/quiz.css";

export default function QuizList() {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [activeTab, setActiveTab] = useState("pending");
  const [pendingQuizzes, setPendingQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =====================================
  // FETCH QUIZZES FROM BACKEND
  // =====================================
  useEffect(() => {
    if (!subjectId) return;

    async function fetchQuizzes() {
      try {
        setLoading(true);
        setError(null);

        // 🔥 Using centralized axios
        const res = await api.get("/student/quizzes/", {
          params: {
            subject: subjectId,
          },
        });

        const pending = [];
        const completed = [];

        res.data.forEach((quiz) => {
          if (quiz.status === "SUBMITTED") {
            completed.push(quiz);
          } else {
            pending.push(quiz);
          }
        });

        setPendingQuizzes(pending);
        setCompletedQuizzes(completed);

      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setError("Failed to load quizzes.");
        setPendingQuizzes([]);
        setCompletedQuizzes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, [subjectId]);

  const quizzes =
    activeTab === "pending"
      ? pendingQuizzes
      : completedQuizzes;

  const handleQuizClick = (quiz) => {
    if (activeTab === "pending") {
      navigate(`/subjects/quiz/${subjectId}/take/${quiz.id}`);
    } else {
      navigate(`/subjects/quiz/${subjectId}/result/${quiz.id}`);
    }
  };

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="quizListPage">
      <button
        className="quizBackHeader"
        onClick={() => navigate(-1)}
      >
        &lt; Back
      </button>

      <div className="quizListBox">
        <h2 className="quizListTitle">Quizzes</h2>

        <div className="quizTopRow">
          <div className="quizTabs">
            <button
              className={`quizTab ${
                activeTab === "pending"
                  ? "quizTabActive"
                  : ""
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending ({pendingQuizzes.length})
            </button>

            <button
              className={`quizTab ${
                activeTab === "completed"
                  ? "quizTabActive"
                  : ""
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed ({completedQuizzes.length})
            </button>
          </div>
        </div>

        <div className="quizGrid">
          {quizzes.length === 0 ? (
            <div>No quizzes found.</div>
          ) : (
            quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                img="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600"
                title={quiz.title}
                teacher={quiz.teacher_name}
                deadline={new Date(
                  quiz.due_date
                ).toLocaleString()}
                onClick={() => handleQuizClick(quiz)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}