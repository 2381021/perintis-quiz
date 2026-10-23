import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Fish,
  Waves,
  Medal,
  Shield,
  Zap
} from "lucide-react";

// --- SOUND SYNTHESIZER ---
const playCuteSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "correct" || type === "catch") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "wrong" || type === "escape") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "reel") {
      osc.type = "square";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "victory") {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = freq;
        o.connect(g);
        g.connect(ctx.destination);
        const startTime = now + idx * 0.12;
        g.gain.setValueAtTime(0.2, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        o.start(startTime);
        o.stop(startTime + 0.25);
      });
    }
  } catch (e) {
    console.log("Audio play blocked");
  }
};

// --- JENIS IKAN ---
const FISH_TYPES = [
  { name: "Golden Ranger Trout 🐟", pts: 150, color: "#f59e0b", bodyColor: "#f59e0b" },
  { name: "Rainbow Crusader Bass 🐠", pts: 120, color: "#06b6d4", bodyColor: "#06b6d4" },
  { name: "Master Guide Salmon 🐡", pts: 200, color: "#f43f5e", bodyColor: "#f43f5e" },
  { name: "Campfire Catfish 🐟", pts: 100, color: "#8b5cf6", bodyColor: "#8b5cf6" }
];

// --- 10 SOAL LATIHAN SEJARAH PATHFINDER ---
const INITIAL_QUESTIONS = [
  {
    id: 1,
    category: "Sejarah Pathfinder",
    question: "1. Pada tahun berapa Sidang Raya (General Conference) resmi membentuk Departemen Pemuda yang dipimpin oleh M. E. Kern?",
    options: ["A. 1879", "B. 1907", "C. 1922", "D. 1946"],
    answerIndex: 1,
    explanation: "Departemen Pemuda resmi dibentuk pada tahun 1907 di bawah pimpinan M. E. Kern."
  },
  {
    id: 2,
    category: "Sejarah Pathfinder",
    question: "2. Siapakah tokoh yang menulis janji dan hukum yang kemudian menjadi dasar dari Pledge & Law Pathfinder sekarang?",
    options: ["A. M. E. Kern", "B. John Hancock", "C. Arthur Spalding", "D. Henry Bergh"],
    answerIndex: 2,
    explanation: "Arthur Spalding menulis janji dan hukum dasar yang menjadi fondasi Pathfinder."
  },
  {
    id: 3,
    category: "Sejarah Pathfinder",
    question: "3. Di manakah nama 'Pathfinder' pertama kali muncul, yang terinspirasi dari kisah penjelajah John Fremont?",
    options: ["A. Riverside, California", "B. Town Line Lake, Michigan", "C. Australia", "D. Idyllwild, California"],
    answerIndex: 3,
    explanation: "Nama Pathfinder pertama kali muncul di Idyllwild, California, terinspirasi kisah John Fremont."
  },
  {
    id: 4,
    category: "Sejarah Pathfinder",
    question: "4. Klub Pathfinder resmi pertama didirikan di Riverside pada tahun 1946 oleh siapa?",
    options: ["A. John Hancock", "B. Grover Fattic", "C. Lawrence Paulson", "D. Laurence Skinner"],
    answerIndex: 0,
    explanation: "John Hancock mendirikan klub resmi Pathfinder pertama di Riverside pada tahun 1946."
  },
  {
    id: 5,
    category: "Sejarah Pathfinder",
    question: "5. Pada tahun berapa program Pathfinder diterima secara resmi oleh Sidang Raya di San Francisco dan mulai dipakai di seluruh dunia?",
    options: ["A. 1949", "B. 1950", "C. 1953", "D. 1991"],
    answerIndex: 1,
    explanation: "Program Pathfinder diterima secara resmi oleh Sidang Raya pada tahun 1950 di San Francisco."
  },
  {
    id: 6,
    category: "Sejarah Pathfinder",
    question: "6. Perkumpulan bagi anak usia 10–15 tahun yang dibentuk pada periode 1909–1922 dikenal dengan nama...",
    options: [
      "A. JMV (Junior Missionary Volunteer)",
      "B. Pathfinder Club",
      "C. Witness Through Roses",
      "D. General Conference Youth"
    ],
    answerIndex: 0,
    explanation: "JMV (Junior Missionary Volunteer) adalah wadah pembinaan pemuda usia 10-15 tahun periode 1909–1922."
  },
  {
    id: 7,
    category: "Sejarah Pathfinder",
    question: "7. Kelas awal apa saja yang dibentuk pada masa perkembangan awal perkumpulan anak-anak (periode 1909–1922)?",
    options: [
      "A. Friend, Companion, dan Master Guide",
      "B. Friend, Companion, dan Comrade",
      "C. Explorer, Ranger, dan Voyager",
      "D. Builder, Helping Hand, dan Friend"
    ],
    answerIndex: 1,
    explanation: "Kelas-kelas awal yang dibentuk pada periode tersebut adalah Friend, Companion, dan Comrade."
  },
  {
    id: 8,
    category: "Sejarah Pathfinder",
    question: "8. Di manakah perkemahan pertama bagi anak-anak diadakan di luar Amerika Serikat pada tahun 1925?",
    options: ["A. California", "B. Michigan", "C. Australia", "D. San Francisco"],
    answerIndex: 2,
    explanation: "Perkemahan luar negeri pertama untuk anak-anak diadakan di Australia pada tahun 1925."
  },
  {
    id: 9,
    category: "Sejarah Pathfinder",
    question: "9. Siapakah tokoh yang membuka perkemahan di Town Line Lake, Michigan, pada tahun 1926?",
    options: ["A. Grover Fattic", "B. Lawrence Paulson", "C. Henry Bergh", "D. Ranzolin"],
    answerIndex: 0,
    explanation: "Grover Fattic membuka perkemahan bersejarah di Town Line Lake, Michigan pada tahun 1926."
  },
  {
    id: 10,
    category: "Sejarah Pathfinder",
    question: "10. Proyek Witness Through Roses yang melibatkan pembuatan hiasan kendaraan hias (float) pada Rose Parade berlangsung pada rentang tahun...",
    options: ["A. 1925–1930", "B. 1946–1949", "C. 1953–1960", "D. 1991–1997"],
    answerIndex: 3,
    explanation: "Proyek hiasan Rose Parade (Witness Through Roses) berlangsung dari tahun 1991 hingga 1997."
  }
];

// --- FIRST-PERSON 3D FISHING CANVAS ---
const Interactive3DFishingCanvas = ({ animState = "idle", reelProgress = 0 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frameId;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const horizonY = 55;

      // 1. 3D Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, "#0284c7");
      skyGrad.addColorStop(1, "#bae6fd");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY);

      // Sun
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(w / 2, horizonY - 15, 14, 0, Math.PI * 2);
      ctx.fill();

      // 2. 3D Water Surface with Perspective Lines
      const waterGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      waterGrad.addColorStop(0, "#0369a1");
      waterGrad.addColorStop(1, "#0284c7");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Perspective Grid / Wave lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1.5;

      for (let y = horizonY; y < h; y += 12) {
        const lineY = y + (Math.sin((tick + y) * 0.08) * 2);
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(w, lineY);
        ctx.stroke();
      }

      // 3. 3D Fishing Rod Tip (First Person POV from Bottom Right)
      const rodStartX = w * 0.85;
      const rodStartY = h + 10;
      let rodTipX = w * 0.5;
      let rodTipY = horizonY + 20;

      if (animState === "reeling") {
        rodTipX += Math.sin(tick * 0.4) * 6;
        rodTipY += Math.cos(tick * 0.4) * 4;
      }

      // Fishing Rod
      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(rodStartX, rodStartY);
      ctx.lineTo(rodTipX, rodTipY);
      ctx.stroke();

      // Rod Guides / Rings
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(rodTipX, rodTipY, 4, 0, Math.PI * 2);
      ctx.fill();

      // 4. Fishing Line & 3D Bobber / Fish Position
      let bobberX = w * 0.5;
      let bobberY = horizonY + 35 + (1 - reelProgress / 100) * 50;

      if (animState === "fail") {
        // Line Snapped Effect
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rodTipX, rodTipY);
        ctx.lineTo(rodTipX - 30, rodTipY + 40);
        ctx.stroke();
      } else {
        // Active Line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(rodTipX, rodTipY);
        ctx.lineTo(bobberX, bobberY);
        ctx.stroke();

        // 3D Bobber Float
        const floatY = bobberY + Math.sin(tick * 0.1) * 3;

        // Ripple Ring
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.ellipse(bobberX, floatY + 4, 12 + Math.sin(tick * 0.2) * 3, 5, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Red/White Bobber
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(bobberX, floatY, 6, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(bobberX, floatY, 6, 0, Math.PI);
        ctx.fill();

        // If reeling or success, draw the fish approaching in 3D
        if (animState === "reeling" || animState === "success") {
          const fishScale = 0.5 + (reelProgress / 100) * 0.8;
          ctx.save();
          ctx.translate(bobberX, floatY + 15);
          ctx.scale(fishScale, fishScale);

          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.ellipse(0, 0, 16, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(-12, 0);
          ctx.lineTo(-22, -8);
          ctx.lineTo(-22, 8);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [animState, reelProgress]);

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={140}
      style={{
        width: "100%",
        height: "140px",
        borderRadius: "20px",
        border: "4px solid #0284c7",
        boxShadow: "0 8px 0 #0369a1, inset 0 4px 10px rgba(0,0,0,0.3)",
        display: "block"
      }}
    />
  );
};

// --- ANIMATED CANVAS POV INSIDE BUCKET ---
const AnimatedBucketPOVCanvas = ({ fishCount = 0, fishList = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frameId;
    let tick = 0;

    const fishData = Array.from({ length: fishCount }).map((_, i) => ({
      x: 60 + (i % 3) * 50 + (Math.random() * 20 - 10),
      y: 60 + Math.floor(i / 3) * 45 + (Math.random() * 15 - 7.5),
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: (Math.random() - 0.5) * 1.2,
      color: fishList[i]?.bodyColor || "#f59e0b",
      size: 14 + (i % 2) * 4
    }));

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.arc(120, 120, 110, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(120, 120, 60 + Math.sin(tick * 0.05) * 10, 0, Math.PI * 2);
      ctx.stroke();

      fishData.forEach((f) => {
        f.x += f.speedX;
        f.y += f.speedY;

        const dx = f.x - 120;
        const dy = f.y - 120;
        if (Math.sqrt(dx * dx + dy * dy) > 80) {
          f.speedX *= -1;
          f.speedY *= -1;
        }

        ctx.save();
        ctx.translate(f.x, f.y);

        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, f.size, f.size / 2, Math.atan2(f.speedY, f.speedX), 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        const angle = Math.atan2(f.speedY, f.speedX);
        const tailX = -Math.cos(angle) * f.size;
        const tailY = -Math.sin(angle) * f.size;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(tailX - 8, tailY - 6);
        ctx.lineTo(tailX - 8, tailY + 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * (f.size / 2), Math.sin(angle) * (f.size / 2), 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * (f.size / 2), Math.sin(angle) * (f.size / 2), 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [fishCount, fishList]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={240}
      style={{
        borderRadius: "50%",
        border: "12px solid #78350f",
        boxShadow: "inset 0 0 25px rgba(0,0,0,0.6), 0 12px 20px rgba(0,0,0,0.25)",
        display: "block",
        margin: "0 auto"
      }}
    />
  );
};

export default function App() {
  const [questions] = useState(INITIAL_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [fishCaught, setFishCaught] = useState([]);
  const [streak, setStreak] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cadetName, setCadetName] = useState("Ranger Scout");
  const [gameState, setGameState] = useState("welcome");
  const [timer, setTimer] = useState(25);
  const [timerActive, setTimerActive] = useState(false);
  const [caughtFish, setCaughtFish] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [animState, setAnimState] = useState("idle");

  // 3D Interactive Reel Mechanic State
  const [reelProgress, setReelProgress] = useState(0);
  const [isReelingMode, setIsReelingMode] = useState(false);

  const activeQuestion = questions[currentIdx];

  useEffect(() => {
    let interval = null;
    if (timerActive && timer > 0 && !isAnswered && gameState === "quiz") {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && !isAnswered && timerActive && gameState === "quiz") {
      handleOptionSelect(-1);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, isAnswered, gameState]);

  const triggerAudio = (type) => {
    if (soundEnabled) playCuteSound(type);
  };

  const startQuiz = () => {
    triggerAudio("click");
    setGameState("quiz");
    setCurrentIdx(0);
    setScore(0);
    setFishCaught([]);
    setStreak(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setAnimState("idle");
    setReelProgress(0);
    setIsReelingMode(false);
    setTimer(25);
    setTimerActive(true);
  };

  const handleOptionSelect = (index) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);
    setTimerActive(false);

    if (index === activeQuestion.answerIndex) {
      triggerAudio("correct");
      const randomFish = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
      setCaughtFish(randomFish);
      setIsReelingMode(true);
      setAnimState("reeling");
      setReelProgress(20);
      setActionMessage("FISH ON THE HOOK! TAP REEL FAST! 🎣🔥");
    } else {
      triggerAudio("wrong");
      setStreak(0);
      setCaughtFish(null);
      setAnimState("fail");
      setIsReelingMode(false);
      if (fishCaught.length > 0) {
        setFishCaught((prev) => prev.slice(0, -1));
        setActionMessage("LINE SNAPPED! (-1 Ikan dari ember) 🦀💔");
      } else {
        setActionMessage("TALI TERSANGKUT DI GANGGANG! 🌿");
      }
    }
  };

  const handleTapReel = () => {
    if (!isReelingMode) return;
    triggerAudio("reel");
    const nextProgress = reelProgress + 25;
    if (nextProgress >= 100) {
      triggerAudio("catch");
      setReelProgress(100);
      setIsReelingMode(false);
      setAnimState("success");
      setFishCaught((prev) => [...prev, caughtFish]);
      setScore((prev) => prev + caughtFish.pts + streak * 10);
      setStreak((prev) => prev + 1);
      setActionMessage(`Landed ${caughtFish.name}! (+1 Ikan) 🐟✨`);
    } else {
      setReelProgress(nextProgress);
    }
  };

  const handleNextQuestion = () => {
    triggerAudio("click");
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsReelingMode(false);
      setReelProgress(0);
      setAnimState("idle");
      setTimer(25);
      setTimerActive(true);
    } else {
      triggerAudio("victory");
      setGameState("bucket_pov");
    }
  };

  const finishBucketViewAndGoSummary = () => {
    triggerAudio("click");
    setGameState("summary");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#fefce8",
        color: "#1e293b",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        boxSizing: "border-box"
      }}
    >
      <style>{`
        .btn-3d {
          transition: all 0.1s ease;
          position: relative;
        }
        .btn-3d:active {
          transform: translateY(4px) !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* CONTAINER UTAMA / 3D MOBILE CABINET */}
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          backgroundColor: "#ffffff",
          borderRadius: "32px",
          border: "5px solid #fde047",
          boxShadow: "0 25px 0 #eab308, 0 30px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: "92vh",
          position: "relative"
        }}
      >
        {/* HEADER BAR 3D */}
        <div
          style={{
            backgroundColor: "#fef9c3",
            padding: "12px 16px",
            borderBottom: "4px solid #fde047",
            boxShadow: "0 4px 0 #fef08a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#15803d",
                padding: "8px",
                borderRadius: "14px",
                boxShadow: "0 4px 0 #166534"
              }}
            >
              <Compass style={{ width: 22, height: 22, color: "#ffffff" }} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: "14px",
                  color: "#15803d",
                  lineHeight: "1.1"
                }}
              >
                CRUSADER PATHFINDER CLUB
              </div>
              <div
                style={{ fontSize: "10px", fontWeight: 800, color: "#854d0e" }}
              >
                Ranger Class Official Game
              </div>
            </div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-3d"
            style={{
              backgroundColor: "#fef08a",
              border: "2px solid #fde047",
              padding: "8px",
              borderRadius: "14px",
              boxShadow: "0 4px 0 #facc15",
              cursor: "pointer"
            }}
          >
            {soundEnabled ? (
              <Volume2 style={{ width: 18, height: 18, color: "#713f12" }} />
            ) : (
              <VolumeX style={{ width: 18, height: 18, color: "#94a3b8" }} />
            )}
          </button>
        </div>

        {/* AREA ISI UTAMA */}
        <div
          style={{
            padding: "14px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          {/* 1. LAYAR UTAMA (WELCOME) */}
          {gameState === "welcome" && (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
                margin: "auto 0"
              }}
            >
              <div
                style={{
                  backgroundColor: "#dcfce7",
                  color: "#15803d",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 900,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "2px solid #86efac",
                  boxShadow: "0 4px 0 #bbf7d0"
                }}
              >
                <Shield style={{ width: 14, height: 14, color: "#16a34a" }} />
                Ranger Class Exclusive • Crusader Club
              </div>

              <Interactive3DFishingCanvas animState="idle" reelProgress={0} />

              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  color: "#713f12",
                  margin: "0"
                }}
              >
                3D Sejarah Pathfinder Quest! 🎣
              </h2>

              <p
                style={{
                  fontSize: "12px",
                  color: "#475569",
                  fontWeight: 600,
                  lineHeight: "1.4",
                  margin: "0 8px"
                }}
              >
                Jawab semua 10 soal! Saat ikan menyangkut di kail, ketuk tombol 3D Reel secepatnya untuk menarik ikan ke dalam ember!
              </p>

              <div style={{ width: "100%", textAlign: "left", marginTop: "4px" }}>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    color: "#854d0e",
                    textTransform: "uppercase"
                  }}
                >
                  Ranger's Name:
                </label>
                <input
                  type="text"
                  value={cadetName}
                  onChange={(e) => setCadetName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "6px",
                    backgroundColor: "#fefce8",
                    border: "3px solid #fde047",
                    borderRadius: "18px",
                    fontWeight: 900,
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#713f12",
                    boxShadow: "inset 0 4px 6px rgba(0,0,0,0.06)",
                    boxSizing: "border-box"
                  }}
                  placeholder="Ketik nama Ranger..."
                />
              </div>

              <button
                onClick={startQuiz}
                className="btn-3d"
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#15803d",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "20px",
                  fontWeight: 900,
                  fontSize: "17px",
                  boxShadow: "0 6px 0 #166534",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <Fish style={{ width: 22, height: 22, color: "#ffffff" }} />
                MULAI KUIS RANGER CLASS!
              </button>
            </div>
          )}

          {/* 2. LAYAR KUIS */}
          {gameState === "quiz" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                flex: 1
              }}
            >
              {/* METERAN ATAS 3D */}
              <div
                style={{
                  backgroundColor: "#fefce8",
                  padding: "10px 12px",
                  borderRadius: "16px",
                  border: "3px solid #fde047",
                  boxShadow: "0 4px 0 #facc15",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 900,
                    backgroundColor: "#fef08a",
                    color: "#713f12",
                    padding: "4px 10px",
                    borderRadius: "10px"
                  }}
                >
                  Q {currentIdx + 1}/{questions.length}
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: 900,
                    color: "#0284c7"
                  }}
                >
                  <Fish style={{ width: 18, height: 18, color: "#0284c7" }} />
                  <span>Bucket: {fishCaught.length} 🐟</span>
                </div>
              </div>

              {/* TIMER 3D */}
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "999px",
                  overflow: "hidden",
                  border: "1px solid #cbd5e1"
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(timer / 25) * 100}%`,
                    backgroundColor: timer > 10 ? "#15803d" : "#f43f5e",
                    transition: "width 1s linear"
                  }}
                />
              </div>

              {/* 3D LIVE POV CANVAS SCENE */}
              <div style={{ position: "relative" }}>
                <Interactive3DFishingCanvas animState={animState} reelProgress={reelProgress} />

                {/* Reel-In Interactive Overlay Button */}
                {isReelingMode && (
                  <button
                    onClick={handleTapReel}
                    className="btn-3d"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "#f59e0b",
                      color: "#ffffff",
                      border: "3px solid #ffffff",
                      borderRadius: "16px",
                      padding: "10px 18px",
                      fontSize: "15px",
                      fontWeight: 900,
                      boxShadow: "0 6px 0 #b45309",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <Zap style={{ width: 18, height: 18, color: "#ffffff" }} />
                    REEL IN FAST! ({reelProgress}%)
                  </button>
                )}

                {isAnswered && !isReelingMode && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor:
                        animState === "success" ? "#22c55e" : "#ef4444",
                      color: "#ffffff",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 900,
                      boxShadow: "0 4px 0 rgba(0,0,0,0.2)"
                    }}
                  >
                    {actionMessage}
                  </div>
                )}
              </div>

              {/* SOAL & PILIHAN JAWABAN */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginTop: "2px"
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fffbeb",
                    padding: "12px 14px",
                    borderRadius: "18px",
                    border: "3px solid #fcd34d",
                    boxShadow: "0 4px 0 #fef08a",
                    fontSize: "13px",
                    fontWeight: 900,
                    color: "#713f12",
                    lineHeight: "1.35"
                  }}
                >
                  {activeQuestion.question}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  {activeQuestion.options.map((opt, idx) => {
                    let btnBg = "#ffffff";
                    let btnBorder = "#fde047";
                    let btnShadow = "#facc15";
                    let btnColor = "#1e293b";

                    if (isAnswered) {
                      if (idx === activeQuestion.answerIndex) {
                        btnBg = "#dcfce7";
                        btnBorder = "#22c55e";
                        btnShadow = "#16a34a";
                        btnColor = "#14532d";
                      } else if (idx === selectedOption) {
                        btnBg = "#ffe4e6";
                        btnBorder = "#f43f5e";
                        btnShadow = "#e11d48";
                        btnColor = "#881337";
                      } else {
                        btnBg = "#f8fafc";
                        btnBorder = "#cbd5e1";
                        btnShadow = "#94a3b8";
                        btnColor = "#94a3b8";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswered}
                        className="btn-3d"
                        style={{
                          padding: "12px 14px",
                          backgroundColor: btnBg,
                          border: `2px solid ${btnBorder}`,
                          borderRadius: "16px",
                          boxShadow: `0 4px 0 ${btnShadow}`,
                          textAlign: "left",
                          fontWeight: 800,
                          fontSize: "12px",
                          color: btnColor,
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <span>{opt}</span>
                        {isAnswered && idx === activeQuestion.answerIndex && (
                          <CheckCircle2
                            style={{
                              width: 18,
                              height: 18,
                              color: "#16a34a",
                              flexShrink: 0
                            }}
                          />
                        )}
                        {isAnswered &&
                          idx === selectedOption &&
                          idx !== activeQuestion.answerIndex && (
                            <XCircle
                              style={{
                                width: 18,
                                height: 18,
                                color: "#e11d48",
                                flexShrink: 0
                              }}
                            />
                          )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TOMBOL SELANJUTNYA / LIHAT BUCKET */}
              {isAnswered && !isReelingMode && (
                <button
                  onClick={handleNextQuestion}
                  className="btn-3d"
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: "#f59e0b",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "18px",
                    fontWeight: 900,
                    fontSize: "15px",
                    boxShadow: "0 5px 0 #b45309",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "auto"
                  }}
                >
                  <span>
                    {currentIdx + 1 === questions.length
                      ? "Lihat ke Dalam Ember Ikan 🪣"
                      : "Soal Selanjutnya"}
                  </span>
                  <ChevronRight style={{ width: 18, height: 18 }} />
                </button>
              )}
            </div>
          )}

          {/* 3. INSIDE BUCKET POV SCREEN */}
          {gameState === "bucket_pov" && (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
                margin: "auto 0"
              }}
            >
              <div
                style={{
                  backgroundColor: "#dcfce7",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 900,
                  color: "#15803d",
                  border: "2px solid #86efac",
                  boxShadow: "0 4px 0 #bbf7d0"
                }}
              >
                👀 MENGINTIP KE DALAM EMBER IKAN
              </div>

              <AnimatedBucketPOVCanvas fishCount={fishCaught.length} fishList={fishCaught} />

              <div
                style={{
                  backgroundColor: "#fffbeb",
                  border: "3px solid #fcd34d",
                  borderRadius: "20px",
                  padding: "12px 16px",
                  boxShadow: "0 4px 0 #fef08a",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 900, color: "#713f12" }}>
                  Ember Tangkapan {cadetName}
                </div>
                <div style={{ fontSize: "18px", fontWeight: 900, color: "#0284c7", marginTop: "2px" }}>
                  Total {fishCaught.length} Ikan Tersimpan! 🐟
                </div>
              </div>

              <button
                onClick={finishBucketViewAndGoSummary}
                className="btn-3d"
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#15803d",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "18px",
                  fontWeight: 900,
                  fontSize: "16px",
                  boxShadow: "0 6px 0 #166534",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <span>Lihat Hasil Akhir</span>
                <ChevronRight style={{ width: 20, height: 20 }} />
              </button>
            </div>
          )}

          {/* 4. SUMMARY (RINGKASAN AKHIR) */}
          {gameState === "summary" && (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
                margin: "auto 0"
              }}
            >
              <div
                style={{
                  backgroundColor: "#fef08a",
                  padding: "12px",
                  borderRadius: "999px",
                  display: "inline-block",
                  boxShadow: "0 6px 0 #facc15"
                }}
              >
                <Medal style={{ width: 44, height: 44, color: "#ca8a04" }} />
              </div>

              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  color: "#713f12",
                  margin: 0
                }}
              >
                PETUALANGAN SELESAI! 🐟
              </h2>

              <div
                style={{
                  backgroundColor: "#fefce8",
                  border: "4px solid #fde047",
                  borderRadius: "22px",
                  padding: "14px",
                  boxShadow: "0 6px 0 #facc15",
                  boxSizing: "border-box",
                  width: "100%"
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 900,
                    color: "#b45309",
                    margin: "2px 0"
                  }}
                >
                  {cadetName}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#15803d",
                    marginBottom: "10px"
                  }}
                >
                  Ranger Class • Crusader Pathfinder Club
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    backgroundColor: "#ffffff",
                    padding: "10px",
                    borderRadius: "14px",
                    border: "2px solid #fde047"
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 900,
                        color: "#94a3b8"
                      }}
                    >
                      TOTAL IKAN
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 900,
                        color: "#0284c7"
                      }}
                    >
                      {fishCaught.length} 🐟
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 900,
                        color: "#94a3b8"
                      }}
                    >
                      TOTAL SKOR
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 900,
                        color: "#b45309"
                      }}
                    >
                      {score} pts
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="btn-3d"
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#15803d",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "16px",
                  fontWeight: 900,
                  fontSize: "15px",
                  boxShadow: "0 6px 0 #166534",
                  cursor: "pointer"
                }}
              >
                Main Lagi
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            backgroundColor: "#fefce8",
            padding: "8px",
            textAlign: "center",
            fontSize: "9px",
            fontWeight: 800,
            color: "#15803d",
            borderTop: "2px solid #fde047"
          }}
        >
          Ranger Class - Crusader Pathfinder Club
        </div>
      </div>
    </div>
  );
}