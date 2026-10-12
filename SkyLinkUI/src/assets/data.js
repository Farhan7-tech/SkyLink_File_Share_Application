import {
  CreditCard,
  Files,
  LayoutDashboard,
  Receipt,
  Share2,
  Upload,
  HelpCircle,
} from "lucide-react";

export const features = [
  {
    iconName: "ArrowUpCircle",
    iconColor: "text-purple-500",
    title: "Easy File Upload",
    description:
      "Quickly upload your files with our intuitive drag-and-drop interface.",
  },
  {
    iconName: "Shield",
    iconColor: "text-green-500",
    title: "Private by Default",
    description:
      "Files belong to your account; only files you make public can be shared.",
  },
  {
    iconName: "Share2",
    iconColor: "text-purple-500",
    title: "Simple Sharing",
    description: "Share files with anyone using secure links that you control.",
  },
  {
    iconName: "CreditCard",
    iconColor: "text-orange-500",
    title: "Flexible Credits",
    description: "Pay only for what you use with our credit-based system.",
  },
  {
    iconName: "FileText",
    iconColor: "text-red-500",
    title: "File Management",
    description: "Organize, preview, and manage your files from any device.",
  },
  {
    iconName: "Clock",
    iconColor: "text-indigo-500",
    title: "Transaction History",
    description: "Keep track of all your credit purchases and usage.",
  },
];

export const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "5 upload credits",
      "Public or private file sharing",
      "One-time PIN transfers",
      "Support tickets",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "500",
    description: "For individuals with larger needs",
    features: [
      "500 upload credits",
      "Everything in Free",
      "One-time payment via Razorpay",
    ],
    cta: "Go Premium",
    highlighted: true,
  },
  {
    name: "Ultimate",
    price: "2500",
    description: "For teams and businesses",
    features: [
      "5000 upload credits",
      "Everything in Free",
      "One-time payment via Razorpay",
    ],
    cta: "Go Ultimate",
    highlighted: false,
  },
];

//side menu bar options
export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Upload",
    icon: Upload,
    path: "/upload",
  },
  {
    id: "03",
    label: "Share OR Recieve",
    icon: Share2,
    path: "/Share",
  },
  {
    id: "04",
    label: "My Files",
    icon: Files,
    path: "/my-files",
  },
  {
    id: "05",
    label: "Subscription",
    icon: CreditCard,
    path: "/subscriptions",
  },
  {
    id: "06",
    label: "Transactions",
    icon: Receipt,
    path: "/transactions",
  },
  {
    id: "07",
    label: "Support",
    icon: HelpCircle,
    path: "/support",
  },
];
