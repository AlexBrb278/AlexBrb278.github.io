// Everything written about you lives here. Edit this file, not app.js.
window.PROFILE = {
  name: "Alex Barbu",
  fullName: "Alexandru-Mihai Barbu",
  roles: ["Robotics engineer"],
  intro:
    "I want to build robots that see and listen. Right now that means a voice-commanded arm that finds objects it was never trained on, running entirely on a Jetson. Next, I want to go deeper into robot perception through a PhD.",
  status: { label: "Exploring PhD positions for 2027", href: "#research" },
  email: "alexbrb27@gmail.com",
  cv: "assets/Alex_Barbu_CV.pdf",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/alex-barbu-5ba183264", icon: "linkedin" },
    { label: "GitHub", href: "https://github.com/AlexBrb278", icon: "github" },
    { label: "Email", href: "mailto:alexbrb27@gmail.com", icon: "mail" }
  ],

  // Career trace: oldest first. The last entry with `next: true` is drawn dashed.
  career: [
    {
      short: "UPB, BSc", when: "2021",
      org: "Politehnica Bucharest, Mechanical Engineering & Mechatronics",
      role: "BSc, Mechatronics and Robotics", dates: "2021 – 2025", place: "Bucharest",
      notes: [
        "Graduated with a final grade of 9.50.",
        "Thesis: a 3D-printed delta robot that sorts nuts and washers with a custom YOLOv8 model, running inverse kinematics and stepper control on a Raspberry Pi 5."
      ]
    },
    {
      short: "Vision Tech", when: "2024",
      org: "Vision Technology Development",
      role: "IoT Engineer", dates: "Jun 2024 – Oct 2025", place: "Bucharest",
      notes: [
        "Shipped a smart-parking app that runs a quantized YOLOv5 directly on Axis ARTPEC-8 cameras, with under 500 ms end-to-end latency.",
        "Built face recognition with anti-spoofing (ToF liveness) and led a team of interns on a PTZ fire-detection camera."
      ]
    },
    {
      short: "UPB, MSc", when: "2025",
      org: "Politehnica Bucharest, Automatic Control & Computers",
      role: "MSc, Robotics and Automation", dates: "2025 – 2027 (expected)", place: "Bucharest",
      notes: [
        "Half of my courses come from the AI master's programme: computer vision, NLP and ML theory on top of the robotics core.",
        "Dissertation: voice-commanded manipulation for lab assistance (see below)."
      ]
    },
    {
      short: "MarcTel", when: "Nov 2025",
      org: "MarcTel S.I.T.",
      role: "Software Engineer", dates: "Nov 2025 – present", place: "Bucharest",
      notes: [
        "Built the ROS 2 control stack for a 6-DOF arm mounted on a drone, plus the PyQt5 ground station that drives it over radio.",
        "Designed a C++17 file relay that moves sonar data from an underwater vehicle, through a UAV, to a Qt6 ground station."
      ]
    },
    {
      short: "UPB, End of Msc?", when: "2027", next: true,
      org: "Your lab, maybe",
      role: "Finishing the dissertation and publishing it", dates: "From 2027", place: "Bucharest",
      
    }
  ],

  research: {
    title: "Voice-commanded robotic manipulation for laboratory assistance",
    meta: "MSc dissertation, Politehnica Bucharest. Advisor: Ș.l. Dr. Ing. Alexandra Ștefania Ghiță (Mănica)",
    summary:
      "You say “robot, pick up the bottle”. The arm hears it, finds the bottle with an open-vocabulary detector it was never trained for, works out where it is in 3D from a single RGB camera, and shows you the planned grasp in RViz before it moves. Everything runs on a Jetson Orin NX with a 3D-printed copy of the Interbotix VX300s arm.",
    image: "assets/img/detection.jpg",
    imageAlt: "Camera frame from the arm: YOLO-World boxes around a bottle held up by the operator, the operator, and a hand.",
    // Timeline tracks, in seconds. `measured: false` blocks are drawn as illustrative.
    span: 6,
    tracks: [
      { node: "voice_node", blocks: [{ from: 0, to: 2.0, label: "faster-Whisper, ~2 s", tone: "violet", measured: true }] },
      { node: "vision_node", blocks: [{ from: 2.0, to: 2.8, label: "YOLO-World, 0.5–0.8 s", tone: "orange", measured: true }] },
      { node: "grasp_planner", blocks: [{ from: 2.8, to: 3.1, label: "ray cast", tone: "pink", measured: false }] },
      { node: "operator", blocks: [{ from: 3.1, to: 4.5, label: "RViz confirm", tone: "outline", measured: false }] },
      { node: "arm_control", blocks: [{ from: 4.5, to: 6, label: "grasp: pending", tone: "pending", measured: false }] }
    ],
    timelineNote: "Voice and vision times measured on the Jetson Orin NX CPU. Planner and operator blocks are illustrative.",
    status: [
      { done: true, text: "Voice commands with wake word, and a VAD gate that stops Whisper hallucinating on silence" },
      { done: true, text: "Open-vocabulary detection of arbitrary objects from the spoken name, no retraining" },
      { done: true, text: "Two independent 3D estimates from one camera (fixed-depth ray cast and known-size depth), agreeing within 82 mm" },
      { done: false, text: "Physical grasp and handover: in commissioning" }
    ]
  },

  skills: [
    "Python", "C/C++", "ROS 2", "PyTorch", "YOLO", "OpenCV", "TensorFlow Lite", "Model quantization",
    "Jetson Orin", "Dynamixel", "MQTT", "MAVLink", "Qt / PyQt5", "Docker", "FastAPI", "MATLAB",
    "Fusion 360", "SolidWorks", "Git"
  ],

  // Featured carousel. `flow` is the signal chain drawn on the slide.
  projects: [
    {
      title: "Robotic arm on a drone",
      blurb: "A 6-DOF Dynamixel arm flying on a Pixhawk 6 drone, controlled from a laptop over radio with joysticks.",
      flow: ["Arduino joysticks", "PyQt5 station", "MQTT over radio", "ROS 2 on Jetson", "Dynamixel arm"],
      stack: ["ROS 2", "Jetson Orin NX", "MAVLink", "MQTT", "PyQt5"],
      links: [], note: "Work project at MarcTel, code is private"
    },
    {
      title: "Delta robot sorter",
      blurb: "Designed, printed and built a delta robot that sorts nuts and washers with an electromagnet, driven by vision.",
      flow: ["Pi camera", "Custom YOLOv8", "Position + IK", "Path planning", "Stepper motors"],
      stack: ["Raspberry Pi 5", "YOLOv8", "Fusion 360", "MATLAB"],
      links: [], note: "BSc thesis"
    },
    {
      title: "Smart parking on the camera",
      blurb: "Parking-space detection that runs inside an Axis camera, with user-drawn zones and plate recognition downstream.",
      flow: ["ARTPEC-8 DLPU", "Quantized YOLOv5", "Zone overlap", "MQTT", "LPR + SQLite"],
      stack: ["C", "Axis SDK", "Docker", "YOLOv5", "MQTT"],
      links: [], note: "Work project at Vision Technology Development"
    },
    {
      title: "Noise-robust intent detection",
      blurb: "How badly do intent classifiers break on typos and speech-recognition errors, and how much can contrastive fine-tuning win back? 31 points under keyboard noise.",
      flow: ["edge-tts", "Whisper ASR", "Noisy CLINC150", "Contrastive BERT", "Intent + OOS"],
      stack: ["PyTorch", "BERT", "CANINE", "Whisper"],
      links: [{ label: "Code", href: "https://github.com/AlexBrb278/nlp_project" }]
    },
    {
      title: "Shade-aware walking routes",
      blurb: "Finds the shadiest walking route through a city by projecting building shadows from the sun's position every 30 minutes.",
      flow: ["OSM buildings", "Solar position", "Shadow polygons", "Weighted graph", "Mobile app"],
      stack: ["Shapely", "osmnx", "FastAPI", "SvelteKit", "Capacitor"],
      links: [{ label: "Code", href: "https://github.com/AlexBrb278/city_shadow_planning" }]
    }
  ],

  awards: [
    { title: "1st place, CodeQuest Hackathon, AI category", by: "Serviciul de Informații Externe", date: "Dec 2025",
      detail: "Real-time face recognition at up to 12 m, with or without masks. An SVM head cut latency by about 90% versus ArcFace and FaceNet512." },
    { title: "1st place, Zilele Educației Mecatronice", by: "Politehnica Bucharest", date: "May 2024",
      detail: "MATLAB applications category, for a plant-disease detector running on a field rover." },
    { title: "Excellence award, 46th Student Scientific Session", by: "Politehnica Bucharest", date: "Apr 2024",
      detail: "Same plant-disease system, presented a month earlier." }
  ],

  certifications: [
    { title: "CCNAv7: Enterprise Networking, Security and Automation", by: "Cisco Networking Academy", date: "Dec 2025" },
    { title: "Supervised Machine Learning: Regression and Classification", by: "", date: "Jan 2025" },
    { title: "Interfacing with the Arduino / Raspberry Pi", by: "", date: "Jan 2025" },
    { title: "Python101: Modules, OOP, Web-Scraping", by: "", date: "Jan 2025" },
    { title: "CCNAv7: Switching, Routing, and Wireless Essentials", by: "Cisco Networking Academy", date: "Jun 2024" },
    { title: "CCNAv7: Introduction to Networks", by: "Cisco Networking Academy", date: "Feb 2024" },
    { title: "Solid Edge Associate Level Certification", by: "Siemens", date: "Jan 2024" }
  ]
};
