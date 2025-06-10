export const NAV_LINKS = [
  { id: "home", label: "Home", href: "#home" },
  { id: "features", label: "Features", href: "#features" },
  { id: "how-it-works", label: "How It Works", href: "#how-it-works" },
  { id: "benefits", label: "Benefits", href: "#benefits" },
  { id: "faq", label: "FAQ", href: "#faq" },
];

export const FEATURES = [
  {
    id: "voice-interaction",
    title: "Voice Interaction",
    description: "Speak naturally to the game and receive personalized responses, creating an immersive learning experience.",
    icon: "Mic"
  },
  {
    id: "touch-controls",
    title: "Intuitive Touch Controls",
    description: "Interact with elements directly using multi-touch gestures designed for natural engagement.",
    icon: "TouchTool"
  },
  {
    id: "haptic-feedback",
    title: "Haptic Feedback",
    description: "Feel responses through subtle vibrations, creating a multi-sensory learning environment.",
    icon: "Vibrate"
  },
  {
    id: "ai-content",
    title: "AI-Generated Content",
    description: "Experience unique challenges and narratives that adapt to your learning style and progress.",
    icon: "BrainCircuit"
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    id: "1",
    title: "Analyze Learning Style",
    description: "The AI observes how you interact with challenges and identifies your unique learning preferences.",
    icon: "Search"
  },
  {
    id: "2",
    title: "Generate Custom Content",
    description: "Based on your style, the AI creates personalized challenges, characters, and narratives.",
    icon: "Sparkles"
  },
  {
    id: "3",
    title: "Multimodal Interaction",
    description: "Engage with content using voice commands, touch gestures, and receive haptic feedback.",
    icon: "Layers"
  },
  {
    id: "4",
    title: "Continuous Adaptation",
    description: "As you progress, the game evolves, adjusting difficulty and approach to optimize your learning.",
    icon: "RefreshCw"
  }
];

export const BENEFITS = [
  {
    id: "personalized",
    title: "Truly Personalized Learning",
    description: "Unlike traditional educational games with fixed content, every experience is tailored to your needs.",
    icon: "UserCog"
  },
  {
    id: "engagement",
    title: "Increased Engagement",
    description: "Multiple interaction methods keep learning fresh and maintain attention for longer periods.",
    icon: "Heart"
  },
  {
    id: "accessibility",
    title: "Enhanced Accessibility",
    description: "Different input methods make learning accessible to students with various preferences and needs.",
    icon: "Accessibility"
  },
  {
    id: "retention",
    title: "Improved Retention",
    description: "Multi-sensory engagement helps information stick, leading to better long-term learning outcomes.",
    icon: "Brain"
  }
];

export const FAQ_ITEMS = [
  {
    question: "How does the AI customize content for each learner?",
    answer: "Our AI analyzes interaction patterns, including response time, error types, and engagement levels. It then generates content that addresses specific learning needs while maintaining educational objectives."
  },
  {
    question: "Is internet connectivity required to use the game?",
    answer: "Initial content packages can be downloaded for offline use, but continuous AI adaptation and fresh content generation requires an internet connection."
  },
  {
    question: "What subjects and age groups is the game suitable for?",
    answer: "The platform is designed to be adaptable across subjects from elementary to higher education. Content difficulty and presentation automatically adjust based on user interactions."
  },
  {
    question: "How is user privacy protected when the AI is learning from interactions?",
    answer: "All learning data is anonymized and processed with strict privacy controls. Personal information is never shared, and parents/educators can control data collection settings."
  },
  {
    question: "Can educators customize the learning objectives?",
    answer: "Yes, educators can set specific learning goals, and the AI will generate content to meet these objectives while maintaining its adaptive approach to each student's needs."
  }
];

export const SIDEBAR_ITEMS_TEACHER = [
  { id: "quizzes", label: "Quizzes", icon: "BookOpen" },
  { id: "students", label: "Students", icon: "Users" },
  { id: "analytics", label: "Analytics", icon: "BarChart3" },
  { id: "logout", label: "Logout", icon: "LogOut" }
]

export const SIDEBAR_ITEMS_STUDENT = [
  { id: "quizzes", label: "Quizzes", icon: "BookOpen" },
  { id: "analytics", label: "Analytics", icon: "BarChart3" },
  { id: "logout", label: "Logout", icon: "LogOut" }
]