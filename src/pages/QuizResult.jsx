import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/apiClient";
import "../styles/quiz.css";

export default function QuizResult() {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResult() {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(
          `/quizzes/${quizId}/result/`
        );

        setResultData(res.data);

      } catch (err) {
        console.error("Failed to load result:", err);
        setError("Unable to load result.");
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [quizId]);

  if (loading)
    return <div className="quizDetailPage">Loading result...</div>;

  if (error)
    return <div className="quizDetailPage">{error}</div>;

  if (!resultData) return null;

  return (
    <div className="quizDetailPage">
      <div className="quizDetailBox">

        <button
          className="quizDetailBack"
          onClick={() => navigate(-1)}
        >
          &lt; Back
        </button>

        <div className="quizDetailHeader">
          <h2 className="quizDetailTitle">
            {resultData.subject_name}
          </h2>
          <div className="quizDetailSearch">
            <input placeholder="Search..." />
            <span className="quizDetailSearchIcon">🔍</span>
          </div>
        </div>

        <div className="quizDetailContent">

          <div className="quizDetailInfo quizDetailInfo--result">
            <div className="quizDetailInfoLeft">
              <h3 className="quizDetailInfoTitle">
                {resultData.title}
              </h3>
              <p className="quizDetailInfoMeta">
                {resultData.teacher_name}
              </p>
              <p className="quizDetailInfoDue">
                Submitted:{" "}
                {new Date(resultData.submitted_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="quizDetailQuestions">
            {resultData.questions.map((q, index) => (
              <div
                key={q.id}
                className="quizDetailQuestion quizDetailQuestion--result"
              >
                <div className="quizDetailQuestionRow">
                  <p className="quizDetailQuestionText">
                    {index + 1}. {q.text}
                  </p>
                  <p className="quizDetailQuestionAnswer">
                    Correct: {q.correct_choice}
                  </p>
                </div>

                <div className="quizDetailOptions quizDetailOptions--disabled">
                  <div
                    className={`quizDetailOption ${
                      q.is_correct
                        ? "quizDetailOption--selected"
                        : ""
                    }`}
                  >
                    <span className="quizDetailOptionText">
                      Your Answer: {q.selected_choice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="quizDetailScore">
            <p className="quizDetailScoreText">
              Score: {resultData.score} /{" "}
              {resultData.total_marks}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}