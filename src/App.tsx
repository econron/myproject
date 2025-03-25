import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 各画面で共通の onNext プロパティ用型定義
interface ScreenProps {
  onNext: () => void;
}

// 1. トップ/レッスン概要画面
const OverviewScreen: React.FC<ScreenProps> = ({ onNext }) => {
  const userCEFR = "B1-high";
  return (
    <div>
      <h1>Lesson Overview</h1>
      <p>CEFR Level: {userCEFR}</p>
      <h2>Topic: Banning Junk Food from SNAP</h2>
      <p>
        In this lesson, we will practice important vocabulary, read an article, and discuss the implications of banning junk food from SNAP.
      </p>
      <button onClick={onNext}>Start Vocabulary Practice</button>
    </div>
  );
};

// 2. 単語・発音練習画面
const VocabularyScreen: React.FC<ScreenProps> = ({ onNext }) => {
  type VocabItem = {
    word: string;
    definition: string;
    example: string;
    audioUrl?: string;
  };

  const vocabItems: VocabItem[] = [
    { word: "strip", definition: "to remove or take something away", example: "The school is stripping art classes from the curriculum." },
    { word: "vocal", definition: "expressing opinions openly", example: "Many people are vocal on social media." },
    { word: "administer", definition: "to manage or organize something", example: "The scholarship program is administered by the university." },
    { word: "autonomy", definition: "the ability to make your own decisions", example: "The teacher encourages autonomy in learning." },
    { word: "dignity", definition: "the quality of being respected", example: "The workers demanded to be treated with dignity." }
  ];

  const playAudio = (word: string) => {
    alert(`Playing audio for ${word}`);
  };

  return (
    <div>
      <h1>Vocabulary & Pronunciation Practice</h1>
      <ul>
        {vocabItems.map((item, index) => (
          <li key={index} style={{ marginBottom: "1rem" }}>
            <strong>{item.word}</strong>: {item.definition}
            <br />
            <em>Example:</em> {item.example}
            <br />
            <button onClick={() => playAudio(item.word)}>Play Pronunciation</button>
          </li>
        ))}
      </ul>
      <button onClick={onNext}>Proceed to Article Reading</button>
    </div>
  );
};

// 3. 記事の読み取り画面
const ArticleScreen: React.FC<ScreenProps> = ({ onNext }) => {
  const articleParagraphs: string[] = [
    "A push to ban sugary drinks, candy and more from the U.S. program that helps low-income families pay for nutritious food has been tried before—but it may soon get a boost from new Trump administration officials.",
    "Robert F. Kennedy Jr., the newly confirmed Health and Human Services (HHS) Secretary, and Brooke Rollins, the new Department of Agriculture (USDA) Secretary, have both signaled that they favor stripping such treats from SNAP, the Supplemental Nutrition Assistance Program.",
    "Kennedy has been most vocal, calling for the government to stop allowing the nearly $113 billion program that serves about 42 million Americans to use benefits to pay for 'soda or processed foods.'",
    "Excluding any foods would require Congress to change the law—or for states to submit waivers to restrict purchases.",
    "Anti-hunger advocates say that limiting food choices undermines the autonomy and dignity of people who receive assistance."
  ];

  return (
    <div>
      <h1>Article Reading</h1>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "1rem"
        }}
      >
        {articleParagraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>
      <button onClick={onNext}>Proceed to Discussion Topics</button>
    </div>
  );
};

// 4. ディスカッション・トピック選択画面
const DiscussionSelectionScreen: React.FC<ScreenProps> = ({ onNext }) => {
  const topics: string[] = [
    "Is it fair for the government to decide what low-income families can buy with food assistance?",
    "Should there be limits on buying 'luxury' food with government assistance?"
  ];
  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0]);

  return (
    <div>
      <h1>Discussion Topic Selection</h1>
      <div>
        {topics.map((topic, index) => (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <input
              type="radio"
              id={`topic-${index}`}
              name="discussionTopic"
              value={topic}
              checked={selectedTopic === topic}
              onChange={() => setSelectedTopic(topic)}
            />
            <label htmlFor={`topic-${index}`}> {topic}</label>
          </div>
        ))}
      </div>
      <button onClick={onNext}>Proceed to Opinion Input</button>
    </div>
  );
};

// 5. 意見入力画面
const OpinionInputScreen: React.FC<ScreenProps> = ({ onNext }) => {
  const [opinion, setOpinion] = useState<string>("");
  const [language, setLanguage] = useState<"en" | "jp">("en");

  return (
    <div>
      <h1>Opinion Input</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setLanguage("en")} disabled={language === "en"}>
          English
        </button>
        <button onClick={() => setLanguage("jp")} disabled={language === "jp"} style={{ marginLeft: "0.5rem" }}>
          日本語
        </button>
      </div>
      <textarea
        value={opinion}
        onChange={(e) => setOpinion(e.target.value)}
        placeholder={language === "en" ? "Write your opinion in English..." : "日本語でご意見を入力してください..."}
        style={{ width: "100%", height: "150px", marginBottom: "1rem" }}
      />
      <button onClick={onNext}>Submit Opinion</button>
    </div>
  );
};

// 6. 添削・フィードバック画面
const FeedbackScreen: React.FC<ScreenProps> = ({ onNext }) => {
  const feedback = "Your opinion is well articulated. Consider using expressions like 'in my opinion' or 'I believe that' to further structure your argument.";

  return (
    <div>
      <h1>Feedback</h1>
      <p>{feedback}</p>
      <button onClick={onNext}>Proceed to Lesson Summary</button>
    </div>
  );
};

// 7. 学習ポイントまとめ画面
const SummaryScreen: React.FC = () => {
  return (
    <div>
      <h1>Lesson Summary</h1>
      <p>Key Vocabulary: strip, vocal, administer, autonomy, dignity</p>
      <p>Please review these terms and practice their usage.</p>
      <p>Thank you for participating in the lesson!</p>
    </div>
  );
};

// メインのAppコンポーネント
const App: React.FC = () => {
  return (
    <Router>
      <div className="app" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route
            path="/overview"
            element={<OverviewScreen onNext={() => window.location.href = "/vocabulary"} />}
          />
          <Route
            path="/vocabulary"
            element={<VocabularyScreen onNext={() => window.location.href = "/article"} />}
          />
          <Route
            path="/article"
            element={<ArticleScreen onNext={() => window.location.href = "/discussion"} />}
          />
          <Route
            path="/discussion"
            element={<DiscussionSelectionScreen onNext={() => window.location.href = "/opinion"} />}
          />
          <Route
            path="/opinion"
            element={<OpinionInputScreen onNext={() => window.location.href = "/feedback"} />}
          />
          <Route
            path="/feedback"
            element={<FeedbackScreen onNext={() => window.location.href = "/summary"} />}
          />
          <Route path="/summary" element={<SummaryScreen />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 