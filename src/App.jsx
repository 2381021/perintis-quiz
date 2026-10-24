import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Fish,
  Medal,
  Shield
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
  { name: "Golden Ranger Trout 🐟", pts: 150, bodyColor: "#f59e0b" },
  { name: "Rainbow Crusader Bass 🐠", pts: 120, bodyColor: "#06b6d4" },
  { name: "Master Guide Salmon 🐡", pts: 200, bodyColor: "#f43f5e" },
  { name: "Campfire Catfish 🐟", pts: 100, bodyColor: "#8b5cf6" }
];

// --- 10 SOAL LATIHAN SEJARAH PATHFINDER ---
const INITIAL_QUESTIONS = [
  {
    id: 1,
    category: "Sejarah Pathfinder",
    question: "1. Pada tahun berapa Sidang Raya (General Conference) resmi membentuk Departemen Pemuda yang dipimpin oleh M. E. Kern?",
    options: ["A. 1879", "B. 1907", "C. 1922", "D. 1946"],
    answerIndex: 1
  },
  {
    id: 2,
    category: "Sejarah Pathfinder",
    question: "2. Siapakah tokoh yang menulis janji dan hukum yang kemudian menjadi dasar dari Pledge & Law Pathfinder sekarang?",
    options: ["A. M. E. Kern", "B. John Hancock", "C. Arthur Spalding", "D. Henry Bergh"],
    answerIndex: 2
  },
  {
    id: 3,
    category: "Sejarah Pathfinder",
    question: "3. Di manakah nama 'Pathfinder' pertama kali muncul, yang terinspirasi dari kisah penjelajah John Fremont?",
    options: ["A. Riverside, California", "B. Town Line Lake, Michigan", "C. Australia", "D. Idyllwild, California"],
    answerIndex: 3
  },
  {
    id: 4,
    category: "Sejarah Pathfinder",
    question: "4. Klub Pathfinder resmi pertama didirikan di Riverside pada tahun 1946 oleh siapa?",
    options: ["A. John Hancock", "B. Grover Fattic", "C. Lawrence Paulson", "D. Laurence Skinner"],
    answerIndex: 0
  },
  {
    id: 5,
    category: "Sejarah Pathfinder",
    question: "5. Pada tahun berapa program Pathfinder diterima secara resmi oleh Sidang Raya di San Francisco dan mulai dipakai di seluruh dunia?",
    options: ["A. 1949", "B. 1950", "C. 1953", "D. 1991"],
    answerIndex: 1
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
    answerIndex: 0
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
    answerIndex: 1
  },
  {
    id: 8,
    category: "Sejarah Pathfinder",
    question: "8. Di manakah perkemahan pertama bagi anak-anak diadakan di luar Amerika Serikat pada tahun 1925?",
    options: ["A. California", "B. Michigan", "C. Australia", "D. San Francisco"],
    answerIndex: 2
  },
  {
    id: 9,
    category: "Sejarah Pathfinder",
    question: "9. Siapakah tokoh yang membuka perkemahan di Town Line Lake, Michigan, pada tahun 1926?",
    options: ["A. Grover Fattic", "B. Lawrence Paulson", "C. Henry Bergh", "D. Ranzolin"],
    answerIndex: 0
  },
  {
    id: 10,
    category: "Sejarah Pathfinder",
    question: "10. Proyek Witness Through Roses yang melibatkan pembuatan hiasan kendaraan hias (float) pada Rose Parade berlangsung pada rentang tahun...",
    options: ["A. 1925–1930", "B. 1946–1949", "C. 1953–1960", "D. 1991–1997"],
    answerIndex: 3
  }
];

// --- EXPANDED 3D LIVE POV FISHING CANVAS ---
const Interactive3DFishingCanvas = ({ animState = "idle", activeFishColor = "#f59e0b" }) => {
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
      ctx.arc(w / 2, horizonY - 16, 16, 0, Math.PI * 2);
      ctx.fill();

      // 2. 3D Ocean Surface
      const waterGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      waterGrad.addColorStop(0, "#0369a1");
      waterGrad.addColorStop(1, "#0284c7");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Perspective Wave Lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1.5;

      for (let y = horizonY; y < h; y += 14) {
        const lineY = y + Math.sin((tick + y) * 0.08) * 2.5;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(w, lineY);
        ctx.stroke();
      }

      // 3. 3D Fishing Rod Tip
      const rodStartX = w * 0.88;
      const rodStartY = h + 15;
      let rodTipX = w * 0.5;
      let rodTipY = horizonY + 20;

      if (animState === "success") {
        rodTipX += Math.sin(tick * 0.3) * 8;
        rodTipY -= 12;
      }

      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(rodStartX, rodStartY);
      ctx.lineTo(rodTipX, rodTipY);
      ctx.stroke();

      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(rodTipX, rodTipY, 4, 0, Math.PI * 2);
      ctx.fill();

      // 4. Bobber & Fish Jump Animation
      let bobberX = w * 0.5;
      let bobberY = horizonY + 45;

      if (animState === "fail") {
        // Red Line Snap
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rodTipX, rodTipY);
        ctx.lineTo(rodTipX - 35, rodTipY + 45);
        ctx.stroke();

        // Water Splash Ripple where line snapped
        ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
        ctx.beginPath();
        ctx.ellipse(bobberX, bobberY, 16 + Math.sin(tick * 0.3) * 6, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (animState === "success") {
        // Line pulling fish up
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(rodTipX, rodTipY);

        // 3D Fish Parabolic Jump Arc
        const jumpProgress = Math.min((tick % 40) / 40, 1);
        const fishX = bobberX + Math.sin(jumpProgress * Math.PI) * 40;
        const fishY = bobberY - Math.sin(jumpProgress * Math.PI) * 45;

        ctx.lineTo(fishX, fishY);
        ctx.stroke();

        // Water Splash
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.ellipse(bobberX, bobberY + 10, 20 + jumpProgress * 10, 8, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 3D Leaping Fish
        ctx.save();
        ctx.translate(fishX, fishY);
        ctx.scale(1.2, 1.2);

        ctx.fillStyle = activeFishColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 9, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(-24, -10);
        ctx.lineTo(-24, 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(8, -2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        // Idle Floating Line & Bobber
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(rodTipX, rodTipY);
        ctx.lineTo(bobberX, bobberY);
        ctx.stroke();

        const floatY = bobberY + Math.sin(tick * 0.1) * 3;

        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.ellipse(bobberX, floatY + 4, 12 + Math.sin(tick * 0.2) * 3, 5, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(bobberX, floatY, 6, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(bobberX, floatY, 6, 0, Math.PI);
        ctx.fill();
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [animState, activeFishColor]);

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={160}
      style={{
        width: "100%",
        height: "160px",
        borderRadius: "20px",
        border: "4px solid #0284c7",
        boxShadow: "0 6px 0 #0369a1, inset 0 4px 8px rgba(0,0,0,0.25)",
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
      width={220}
      height={220}
      style={{
        borderRadius: "50%",
        border: "10px solid #78350f",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.6), 0 10px 18px rgba(0,0,0,0.2)",
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
  const [animState, setAnimState] = useState("idle");

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
      setAnimState("success");
      setFishCaught((prev) => [...prev, randomFish]);
      setScore((prev) => prev + randomFish.pts + streak * 10);
      setStreak((prev) => prev + 1);
    } else {
      triggerAudio("wrong");
      setStreak(0);
      setCaughtFish(null);
      setAnimState("fail");
      if (fishCaught.length > 0) {
        setFishCaught((prev) => prev.slice(0, -1));
      }
    }
  };

  const handleNextQuestion = () => {
    triggerAudio("click");
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
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
        padding: "8px",
        boxSizing: "border-box"
      }}
    >
      <style>{`
        .btn-3d {
          transition: all 0.1s ease;
          position: relative;
        }
        .btn-3d:active {
          transform: translateY(3px) !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* CONTAINER UTAMA / 3D MOBILE CABINET */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "28px",
          border: "5px solid #fde047",
          boxShadow: "0 20px 0 #eab308, 0 25px 35px rgba(0,0,0,0.15)",
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
            padding: "10px 14px",
            borderBottom: "4px solid #fde047",
            boxShadow: "0 3px 0 #fef08a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                backgroundColor: "#15803d",
                padding: "6px",
                borderRadius: "12px",
                boxShadow: "0 3px 0 #166534"
              }}
            >
              <Compass style={{ width: 20, height: 20, color: "#ffffff" }} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: "13px",
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
              padding: "6px",
              borderRadius: "12px",
              boxShadow: "0 3px 0 #facc15",
              cursor: "pointer"
            }}
          >
            {soundEnabled ? (
              <Volume2 style={{ width: 16, height: 16, color: "#713f12" }} />
            ) : (
              <VolumeX style={{ width: 16, height: 16, color: "#94a3b8" }} />
            )}
          </button>
        </div>

        {/* AREA ISI UTAMA */}
        <div
          style={{
            padding: "12px",
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
                gap: "12px",
                margin: "auto 0"
              }}
            >
              <div
                style={{
                  backgroundColor: "#dcfce7",
                  color: "#15803d",
                  padding: "5px 12px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 900,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "2px solid #86efac",
                  boxShadow: "0 3px 0 #bbf7d0"
                }}
              >
                <Shield style={{ width: 14, height: 14, color: "#16a34a" }} />
                Ranger Class Exclusive • Crusader Club
              </div>

              <Interactive3DFishingCanvas animState="idle" />

              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#713f12",
                  margin: "0"
                }}
              >
                3D Sejarah Pathfinder Quest! 🎣
              </h2>

              <p
                style={{
                  fontSize: "11px",
                  color: "#475569",
                  fontWeight: 600,
                  lineHeight: "1.4",
                  margin: "0 6px"
                }}
              >
                Jawab semua 10 soal! Jawaban benar memancing ikan melompat dari laut (+1 ikan), sedangkan jawaban salah memutus tali (-1 ikan)!
              </p>

              <div style={{ width: "100%", textAlign: "left", marginTop: "2px" }}>
                <label
                  style={{
                    fontSize: "10px",
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
                    padding: "12px",
                    marginTop: "4px",
                    backgroundColor: "#fefce8",
                    border: "3px solid #fde047",
                    borderRadius: "16px",
                    fontWeight: 900,
                    textAlign: "center",
                    fontSize: "15px",
                    color: "#713f12",
                    boxShadow: "inset 0 3px 5px rgba(0,0,0,0.06)",
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
                  padding: "14px",
                  backgroundColor: "#15803d",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "18px",
                  fontWeight: 900,
                  fontSize: "16px",
                  boxShadow: "0 5px 0 #166534",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <Fish style={{ width: 20, height: 20, color: "#ffffff" }} />
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
                gap: "8px",
                flex: 1
              }}
            >
              {/* METERAN ATAS 3D */}
              <div
                style={{
                  backgroundColor: "#fefce8",
                  padding: "8px 10px",
                  borderRadius: "14px",
                  border: "2px solid #fde047",
                  boxShadow: "0 3px 0 #facc15",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    backgroundColor: "#fef08a",
                    color: "#713f12",
                    padding: "3px 8px",
                    borderRadius: "8px"
                  }}
                >
                  Q {currentIdx + 1}/{questions.length}
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: 900,
                    color: "#0284c7"
                  }}
                >
                  <Fish style={{ width: 16, height: 16, color: "#0284c7" }} />
                  <span>Bucket: {fishCaught.length} 🐟</span>
                </div>
              </div>

              {/* TIMER 3D */}
              <div
                style={{
                  width: "100%",
                  height: "6px",
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

              {/* 3D LIVE POV CANVAS SCENE (FULL UNOBSTRUCTED SCENERY) */}
              <Interactive3DFishingCanvas
                animState={animState}
                activeFishColor={caughtFish?.bodyColor || "#f59e0b"}
              />

              {/* SOAL & PILIHAN JAWABAN */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "2px"
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fffbeb",
                    padding: "10px 12px",
                    borderRadius: "16px",
                    border: "2px solid #fcd34d",
                    boxShadow: "0 3px 0 #fef08a",
                    fontSize: "12px",
                    fontWeight: 900,
                    color: "#713f12",
                    lineHeight: "1.3"
                  }}
                >
                  {activeQuestion.question}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
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
                          padding: "10px 12px",
                          backgroundColor: btnBg,
                          border: `2px solid ${btnBorder}`,
                          borderRadius: "14px",
                          boxShadow: `0 3px 0 ${btnShadow}`,
                          textAlign: "left",
                          fontWeight: 800,
                          fontSize: "11px",
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
                              width: 16,
                              height: 16,
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
                                width: 16,
                                height: 16,
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
              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="btn-3d"
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#f59e0b",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "16px",
                    fontWeight: 900,
                    fontSize: "14px",
                    boxShadow: "0 4px 0 #b45309",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    marginTop: "auto"
                  }}
                >
                  <span>
                    {currentIdx + 1 === questions.length
                      ? "Lihat ke Dalam Ember Ikan 🪣"
                      : "Soal Selanjutnya"}
                  </span>
                  <ChevronRight style={{ width: 16, height: 16 }} />
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
                gap: "12px",
                margin: "auto 0"
              }}
            >
              <div
                style={{
                  backgroundColor: "#dcfce7",
                  padding: "5px 12px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 900,
                  color: "#15803d",
                  border: "2px solid #86efac",
                  boxShadow: "0 3px 0 #bbf7d0"
                }}
              >
                👀 MENGINTIP KE DALAM EMBER IKAN
              </div>

              <AnimatedBucketPOVCanvas fishCount={fishCaught.length} fishList={fishCaught} />

              <div
                style={{
                  backgroundColor: "#fffbeb",
                  border: "2px solid #fcd34d",
                  borderRadius: "18px",
                  padding: "10px 14px",
                  boxShadow: "0 3px 0 #fef08a",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 900, color: "#713f12" }}>
                  Ember Tangkapan {cadetName}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 900, color: "#0284c7", marginTop: "2px" }}>
                  Total {fishCaught.length} Ikan Tersimpan! 🐟
                </div>
              </div>

              <button
                onClick={finishBucketViewAndGoSummary}
                className="btn-3d"
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#15803d",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "16px",
                  fontWeight: 900,
                  fontSize: "15px",
                  boxShadow: "0 5px 0 #166534",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <span>Lihat Hasil Akhir</span>
                <ChevronRight style={{ width: 18, height: 18 }} />
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
                gap: "12px",
                margin: "auto 0"
              }}
            >
              <div
                style={{
                  backgroundColor: "#fef08a",
                  padding: "10px",
                  borderRadius: "999px",
                  display: "inline-block",
                  boxShadow: "0 5px 0 #facc15"
                }}
              >
                <Medal style={{ width: 40, height: 40, color: "#ca8a04" }} />
              </div>

              <h2
                style={{
                  fontSize: "20px",
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
                  border: "3px solid #fde047",
                  borderRadius: "20px",
                  padding: "12px",
                  boxShadow: "0 5px 0 #facc15",
                  boxSizing: "border-box",
                  width: "100%"
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    color: "#b45309",
                    margin: "2px 0"
                  }}
                >
                  {cadetName}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#15803d",
                    marginBottom: "8px"
                  }}
                >
                  Ranger Class • Crusader Pathfinder Club
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    backgroundColor: "#ffffff",
                    padding: "8px",
                    borderRadius: "12px",
                    border: "2px solid #fde047"
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        color: "#94a3b8"
                      }}
                    >
                      TOTAL IKAN
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
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
                        fontSize: "9px",
                        fontWeight: 900,
                        color: "#94a3b8"
                      }}
                    >
                      TOTAL SKOR
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
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
                  padding: "14px",
                  backgroundColor: "#15803d",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: 900,
                  fontSize: "14px",
                  boxShadow: "0 5px 0 #166534",
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
            padding: "6px",
            textAlign: "center",
            fontSize: "9px",
            fontWeight: 800,
            color: "#15803d",
            borderTop: "2px solid #fde047"
          }}
        >
          Khusus Ranger Class - Crusader Pathfinder Club
        </div>
      </div>
    </div>
  );
}