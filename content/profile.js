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

  // Career board: every entry is an LED, oldest first. `next: true` draws it unlit, joined by an unrouted wire.
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
        "Designed a C++ file relay that moves sonar data from an underwater vehicle, through a UAV, to a Qt6 ground station."
      ]
    },
    {
      short: "End of masters", when: "2027", next: true,
      org: "UPB",
      role: "Msc, Robotics and Automation", dates: "2027", place: "Bucharest",
      notes: [
        "Finishing the Dissertation and publishing it."
      ]
    }
  ],

  research: {
    title: "Voice-commanded robotic manipulation for laboratory assistance",
    meta: "MSc dissertation, Politehnica Bucharest. Advisor: Ș.l. Dr. Ing. Alexandra Ștefania Ghiță (Mănica)",
    summary:
      "You say “robot, pick up the bottle”. The arm hears it, finds the bottle with an open-vocabulary detector it was never trained for, works out where it is in 3D from a single RGB camera, and shows you the planned grasp in RViz before it moves. Everything runs on a Jetson Orin NX with a 3D-printed copy of the Interbotix VX300s arm.",
    // Slides for the media gallery. `ratio` is width / height. `fill` lets one item cover the whole slide.
    gallery: [
      {
        fill: true, caption: "Live frame from the arm's shoulder camera",
        items: [{ type: "image", src: "assets/img/detection.jpg", ratio: 16 / 9, alt: "Camera frame from the arm: YOLO-World boxes around a bottle held up by the operator, the operator, and a hand." }]
      },
      {
        caption: "The 3D-printed arm, and an early prototype picking up a bottle",
        items: [
          { type: "image", src: "assets/img/arm.jpg", ratio: 900 / 1200, alt: "The 3D-printed arm in the lab: black printed links, servos and braided cable sleeving." },
          { type: "video", src: "assets/img/armvideo_prototype1.mp4", poster: "assets/img/armvideo_prototype1.jpg", ratio: 576 / 1024, alt: "Prototype 1 of the arm reaching down to a bottle on the bench and lifting it." }
        ]
      }
    ],
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

  // Featured carousel. `flow` is the chain of steps drawn on the slide, styled by `diagram.style` (chain, link, signal or map; see assets/diagrams.js).
  // `media` (photos, clips) replaces the diagram when present.
  projects: [
    {
      title: "Robotic arm on a drone",
      blurb: "A 6-DOF Dynamixel arm flying on a Pixhawk 6 drone, controlled from a laptop over radio with joysticks.",
      flow: ["Arduino joysticks", "PyQt5 station", "MQTT over radio", "ROS 2 on Jetson", "Dynamixel arm"],
      diagram: { style: "link", link: 2, groups: [{ name: "Ground", icon: "laptop", nodes: [0, 1] }, { name: "Drone", icon: "drone", nodes: [3, 4] }] },
      stack: ["ROS 2", "Jetson Orin NX", "MAVLink", "MQTT", "PyQt5"],
      links: [], note: "Work project at MarcTel, code is private"
    },
    {
      title: "Delta robot sorter",
      blurb: "Designed, printed and built a delta robot that sorts nuts and washers with an electromagnet, driven by vision.",
      flow: ["Pi camera", "Custom YOLOv8", "Position + IK", "Path planning", "Stepper motors"],
      media: [
        { type: "image", src: "assets/img/robolicenta.jpeg", ratio: 1152 / 2048, alt: "The finished delta robot on its aluminium frame, three arms hanging from the motor plate." },
        // The clip has black bars either side of a 1134 x 1080 picture; ratio + position crop them away.
        { type: "video", src: "assets/img/deltarobotmovements.mp4", poster: "assets/img/deltarobotmovements.jpg", ratio: 1134 / 1080, position: "51.1% 50%", lightbox: "cover", alt: "CAD animation of the delta robot's three arms moving the effector around." }
      ],
      stack: ["Raspberry Pi 5", "YOLOv8", "Fusion 360", "MATLAB"],
      links: [], note: "BSc thesis"
    },
    {
      title: "Smart parking on the camera",
      blurb: "Parking-space detection that runs inside an Axis camera, with user-drawn zones and plate recognition downstream.",
      flow: ["ARTPEC-8 DLPU", "Quantized YOLOv5", "Zone overlap", "MQTT", "LPR + SQLite"],
      // A phone recording of a laptop; the crop keeps the screen. The lightbox shows the whole frame.
      media: [
        { type: "video", src: "assets/img/smartparking.mp4", poster: "assets/img/smartparking.jpg", ratio: 16 / 9, position: "50% 53%", alt: "Screen recording of the parking web app: drawing a parking zone over the camera view, then the occupancy history table." }
      ],
      stack: ["C", "Axis SDK", "Docker", "YOLOv5", "MQTT"],
      links: [], note: "Work project at Vision Technology Development"
    },
    {
      title: "Noise-robust intent detection",
      blurb: "How badly do intent classifiers break on typos and speech-recognition errors, and how much can contrastive fine-tuning win back? 31 points under keyboard noise.",
      flow: ["edge-tts", "Whisper ASR", "Noisy CLINC150", "Contrastive BERT", "Intent + OOS"],
      diagram: { style: "signal" },
      stack: ["PyTorch", "BERT", "CANINE", "Whisper"],
      links: [{ label: "Code", href: "https://github.com/AlexBrb278/nlp_project" }]
    },
    {
      title: "Shade-aware walking routes",
      blurb: "Finds the shadiest walking route through a city by projecting building shadows from the sun's position every 30 minutes.",
      flow: ["OSM buildings", "Solar position", "Shadow polygons", "Weighted graph", "Mobile app"],
      diagram: { style: "map" },
      stack: ["Shapely", "osmnx", "FastAPI", "SvelteKit", "Capacitor"],
      links: [{ label: "Code", href: "https://github.com/AlexBrb278/city_shadow_planning" }]
    }
  ],

  awards: [
    { title: "1st place, CodeQuest Hackathon, AI category", by: "Serviciul de Informații Externe", date: "Dec 2025",
      detail: "Real-time face recognition at up to 12 m, with or without masks. An SVM head cut latency by about 90% versus ArcFace and FaceNet512.",
      image: { src: "assets/img/premiucodequest.jpg", alt: "Hackathon Code Quest certificate: Premiul I (first prize), awarded to Barbu Alexandru.", caption: "First-prize certificate, Hackathon Code Quest, 5–6 December 2025" } },
    { title: "1st place, Zilele Educației Mecatronice", by: "Politehnica Bucharest", date: "May 2024",
      detail: "MATLAB applications category, for a plant-disease detector running on a field rover." ,
      image: { src: "assets/img/zem.jpeg", alt: "Zilele Educației Mecatronice certificate: Premiul I (first prize), awarded to Barbu Alexandru.", caption: "First-prize certificate, Zilele Educației Mecatronice, 9 May 2024" } },
    { title: "Excellence award, 46th Student Scientific Session", by: "Politehnica Bucharest", date: "Apr 2024",
      detail: "Same plant-disease system, presented a month earlier." }
  ],

  certifications: [
    { title: "Github Foundation", by: "DataCamp", date: "Sep 2026",
      image: { src: "assets/img/gitfoundations.png", alt: "DataCamp certificate of course completion: Github Foundation, 20 September 2026.", caption: "Github Foundation, 20 Sep 2026" }},
    { title: "CCNAv7: Enterprise Networking, Security and Automation", by: "Cisco Networking Academy", date: "Dec 2025",
      image: { src: "assets/img/ccnacertificat2.png", alt: "Cisco Networking Academy certificate: CCNA Enterprise Networking, Security, and Automation, completed 7 December 2025.", caption: "CCNA: Enterprise Networking, Security, and Automation, 7 Dec 2025" } },
    { title: "Supervised Machine Learning: Regression and Classification", by: "", date: "Jan 2025",
      image: { src: "assets/img/supervisedML.jpeg", alt: "Certificate of course completion: Supervised Machine Learning: Regression and Classification, 20 January 2025.", caption: "Supervised Machine Learning: Regression and Classification, 20 Jan 2025" }},
    { title: "Interfacing with the Arduino / Raspberry Pi", by: "", date: "Jan 2025",
      image: { src: "assets/img/certificatArduino.png", alt: "Certificate of course completion: Interfacing with the Arduino / Raspberry Pi, 20 January 2025.", caption: "Interfacing with the Arduino / Raspberry Pi, 20 Jan 2025" }},
    { title: "The Arduino Platform and C Programming", by: "", date: "Jan 2025",
      image:{src: "assets/img/certificatArduinoC.png", alt: "Certificate of course completion: The Arduino Platform and C Programming, 20 January 2025.", caption: "The Arduino Platform and C Programming, 20 Jan 2025" }},
    { title: "Python101: Modules, OOP, Web-Scraping", by: "", date: "Jan 2025" },
    { title: "CCNAv7: Switching, Routing, and Wireless Essentials", by: "Cisco Networking Academy", date: "Jul 2024",
      image: { src: "assets/img/ccnacertificat1.png", alt: "Cisco Networking Academy certificate: CCNAv7 Switching, Routing, and Wireless Essentials, completed 20 July 2024.", caption: "CCNAv7: Switching, Routing, and Wireless Essentials, 20 Jul 2024" } },
    { title: "CCNAv7: Introduction to Networks", by: "Cisco Networking Academy", date: "Feb 2024",
      image: { src: "assets/img/ccnaIntroduction.png", alt: "Cisco Networking Academy certificate of course completion: CCNAv7 Introduction to Networks, 26 February 2024.", caption: "CCNAv7: Introduction to Networks, 26 Feb 2024" } },
    { title: "Solid Edge Associate Level Certification", by: "Siemens", date: "Jan 2024" }
  ]
};
