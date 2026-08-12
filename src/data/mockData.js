// Mock data for the entire application

export const communityStats = [
  { label: "Members", value: 150, suffix: "+" },
  { label: "Events", value: 25, suffix: "+" },
  { label: "Workshops", value: 40, suffix: "+" },
  { label: "Mentors", value: 12, suffix: "+" },
];

export const applicationDomain = [
    "Web Development",
    "AI / Machine Learning",
    "Cybersecurity",
    "Mobile App Development",
  ]
export const domains = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "Build modern, responsive web applications using cutting-edge frameworks and technologies like React, Next.js, and Node.js.",
    icon: "Globe",
    color: "primary",
  },
  {
    id: "ai-ml",
    title: "AI / Machine Learning",
    description: "Explore the world of artificial intelligence, deep learning, and data science with hands-on projects and research.",
    icon: "Brain",
    color: "purple",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    description: "Learn ethical hacking, network security, and vulnerability assessment to protect digital infrastructure.",
    icon: "Shield",
    color: "primary",
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development",
    description: "Create native and cross-platform mobile applications using React Native, Flutter, and Swift.",
    icon: "Smartphone",
    color: "purple",
  },
  {
    id: "open-source",
    title: "Open Source",
    description: "Contribute to open-source projects, learn collaborative development, and build your developer profile.",
    icon: "GitBranch",
    color: "primary",
  },
];

export const events = [
  {
    id: "1",
    title: "Hackathon 2026",
    description: "A 48-hour coding marathon to build innovative solutions for real-world problems. Open to all skill levels.",
    date: "2026-04-15",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
    registrationLink: "#",
  },
  {
    id: "2",
    title: "Web Dev Workshop",
    description: "Hands-on workshop covering React 19, server components, and modern full-stack development patterns.",
    date: "2026-04-01",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    registrationLink: "#",
  },
  {
    id: "3",
    title: "AI/ML Bootcamp",
    description: "Intensive 3-day bootcamp on machine learning fundamentals, neural networks, and model deployment.",
    date: "2026-04-20",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
    registrationLink: "#",
  },
  {
    id: "4",
    title: "Open Source Contribution Day",
    description: "Learn how to contribute to open source projects. We'll guide you through your first PR!",
    date: "2026-05-05",
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=400&fit=crop",
    registrationLink: "#",
  },
];

export const teamMembers = [
  {
    name: "Arjun Sharma",
    role: "President",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Priya Patel",
    role: "Vice President",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Rahul Gupta",
    role: "Technical Lead",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Sneha Reddy",
    role: "Event Coordinator",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Vikram Singh",
    role: "Design Lead",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Ananya Mishra",
    role: "Community Manager",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    linkedin: "#",
  },
];

export const mentors = [
  {
    name: "Dr. Kailash Chandra Bandhu",
    role: "Chair-Person",
    bio: "Chair-Person, Developers Community, Medi-Caps University. Guiding the community with vision and academic leadership.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Dr. Prashant Panse",
    role: "Secretary",
    bio: "Secretary, Developers Community, Medi-Caps University. Driving operations and ensuring smooth functioning of community activities.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
  },
  {
    name: "Dr. Sanket Gupta",
    role: "Manager",
    bio: "Manager, Developers Community, Medi-Caps University. Managing resources and coordinating community initiatives.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
  },
];

export const blogs = [
  {
    id: "1",
    title: "Getting Started with React 19: A Complete Guide",
    description: "Learn the latest features of React 19 including server components, actions, and the new compiler.",
    category: "Programming Tutorial",
    date: "2026-03-01",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Cracking DSA: Top 50 Problems for Placements",
    description: "A curated list of must-solve data structures and algorithms problems with detailed solutions.",
    category: "DSA Preparation",
    date: "2026-02-20",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "How to Win Your First Hackathon",
    description: "Practical tips, team strategies, and project ideas to help you stand out at your next hackathon.",
    category: "Hackathon Tips",
    date: "2026-02-15",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "Placement Preparation Roadmap 2026",
    description: "A complete guide covering aptitude, DSA, system design, and behavioral interview preparation.",
    category: "Placement Guidance",
    date: "2026-02-10",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    title: "Building Your First AI Model with Python",
    description: "Step-by-step tutorial on building and deploying a machine learning model using TensorFlow and Flask.",
    category: "Programming Tutorial",
    date: "2026-01-25",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    title: "Open Source: Your Gateway to Tech Careers",
    description: "How contributing to open source projects can accelerate your career and help you land your dream job.",
    category: "Placement Guidance",
    date: "2026-01-15",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=400&fit=crop",
  },
];

export const projects = [
  {
    id: "1",
    title: "Medgel",
    description: "A medical platform built with modern full-stack technologies for healthcare solutions.",
    tech: ["Next.js", "React", "Node.js", "MongoDB"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    github: "#",
    live: "#",
  },
  {
    id: "2",
    title: "SDC Website",
    description: "The official SDC community website showcasing events, projects, and team members.",
    tech: ["React", "Java 21", "Spring Boot", "MySQL"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    github: "#",
    live: "#",
  },
  {
    id: "3",
    title: "Employment Recruitment Portal",
    description: "A job recruitment portal connecting employers with potential candidates seamlessly.",
    tech: ["HTML", "JavaScript", "Java 8", "Spring Boot", "MySQL"],
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop",
    github: "#",
    live: "#",
  },
  {
    id: "4",
    title: "TEC Website",
    description: "A dynamic website built with vanilla web technologies for the TEC organization.",
    tech: ["HTML", "JavaScript", "PHP", "MySQL"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    github: "#",
    live: "#",
  },
  {
    id: "5",
    title: "Mentor-Mentee",
    description: "A platform to connect mentors with mentees for guided learning and skill development.",
    tech: ["React", "Node.js", "Supabase"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    github: "#",
    live: "#",
  },
  {
    id: "6",
    title: "ERP Portal",
    description: "An enterprise resource planning portal for managing organizational operations efficiently.",
    tech: ["React", "Node.js", "MySQL"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    github: "#",
    live: "#",
  },
  {
    id: "7",
    title: "MII Foundation Website",
    description: "A foundation website with full-stack capabilities for content management and outreach.",
    tech: ["React", "Node.js", "MongoDB"],
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
    github: "#",
    live: "#",
  },
  {
    id: "8",
    title: "Grievance",
    description: "A grievance management system for submitting and tracking complaints efficiently.",
    tech: ["React", "Node.js", "MongoDB"],
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
    github: "#",
    live: "#",
  },
  {
    id: "9",
    title: "Notesheet",
    description: "A digital notesheet management system for streamlining document approvals and workflows.",
    tech: ["React", "Node.js", "MySQL"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
    github: "#",
    live: "#",
  },
];

export const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Domains", path: "/domains" },
  { label: "Events", path: "/events" },
  { label: "Projects", path: "/projects" },
  { label: "People", path: "/people" },
  { label: "Blogs", path: "/blogs" },
  { label: "Career", path: "/career" },
];
