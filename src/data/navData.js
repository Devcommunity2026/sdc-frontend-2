import {
  Users,
  FileText,
  ClipboardList,
  Settings,
} from "lucide-react";

const navData = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Team', path: '/team' },
  { name: 'Blog', path: '/blog' },
  { name: 'Careers', path: '/careers' },
  { name: 'Domains', path: '/domains' },
  { name: 'Events', path: '/events' },
  { name: 'Projects', path: '/projects' },
];

export const adminNav = [
  {
    name: "Users",
    path: "/admin/user",
    icon: Users,
  },
  {
    name: "Content",
    path: "/admin/content",
    icon: FileText,
  },
  {
    name: "Applications",
    path: "/admin/application",
    icon: ClipboardList,
  },
 
];
export default navData;