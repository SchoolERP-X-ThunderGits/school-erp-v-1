import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Link } from 'react-router-dom';
import { useSidebar } from "../context/SidebarContext";
import { FiChevronDown } from "react-icons/fi";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { PiExam, PiStudentFill } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { LiaMoneyCheckSolid } from "react-icons/lia";
import { CiSettings } from "react-icons/ci";
import { MdOutlinePayment } from "react-icons/md";
import logo1 from '../assets/Images/logo/ThunderGits_Logos/1.png';
import logo2 from '../assets/Images/logo/ThunderGits_Logos/2.png';
import logo3 from '../assets/Images/logo/ThunderGits_Logos/3.png';
import logo4 from '../assets/Images/logo/ThunderGits_Logos/4.png';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// === Role-based menu configuration ===

const adminNavItems: NavItem[] = [
  {
    icon: <RxDashboard />,
    name: "Home",
    subItems: [{ name: "Dashboard", path: "/admin/home" }],
  },
  {
    icon: <HiMiniAcademicCap />,
    name: "Academics",
    subItems: [
      { name: "Section", path: "/admin/section" },
      { name: "Class", path: "/admin/class" },
      { name: "Houses", path: "/admin/houses" },
      { name: "Subject", path: "/admin/subject" },
      { name: "Assign Subject", path: "/admin/assign-subject" },
      { name: "Upgrade Class", path: "/admin/upgrade-class" },
      { name: "Upgrade Roll No.", path: "/admin/Upgrade-RollNo" }
    ],
  },
  {
    icon: <PiStudentFill />,
    name: "Students",
    subItems: [
      { name: "Student", path: "/admin/student" },
      { name: "ID Card", path: "/admin/student-id-card" }
    ],
  },
  {
    icon: <PiExam />,
    name: "Exam",
    subItems: [
      { name: "Exam", path: "/admin/exams" },
      { name: "Exam Schedule", path: "/admin/exam-schedule" },
      { name: "Generate Admit Card", path: "/admin/generate-admit-card" }
    ],
  },
  {
    icon: <LiaMoneyCheckSolid />,
    name: "Fees",
    subItems: [
      { name: "Fee Structure", path: "/admin/fee-structure" },
      { name: "Fee Type", path: "/admin/fee-type" },
      { name: "Generate Demand Slip", path: "/admin/generate-demand-slip" }
    ],
  },
  {
    icon: <CiSettings />,
    name: "Settings",
    subItems: [
      { name: "Profile Settings", path: "/admin/profile-settings" },
      { name: "Subscriptions", path: "/admin/subscriptions" },
      { name: "Reset Password", path: "/admin/reset-password" },
    ],
  },
  {
    icon: <MdOutlinePayment />,
    name: "Payment",
    subItems: [
      { name: "Payment History", path: "/admin/payment-history" },
    ],
  },
];

const superadminNavItems: NavItem[] = [
  {
    icon: <RxDashboard />,
    name: "Home",
    subItems: [{ name: "Dashboard", path: "/admin/home" }],
  },
  {
    icon: <CiSettings />,
    name: "School",
    subItems: [{ name: "Schools", path: "/admin/schools" }],
  },
  {
    icon: <CiSettings />,
    name: "Subscriptions",
    subItems: [
      { name: "Subscription plans", path: "/admin/Subscription-plans" },
    ],
  },
  {
    icon: <MdOutlinePayment />,
    name: "Payment",
    subItems: [
      { name: "Payment History", path: "/admin/payment-history" },
    ],
  },

];

const studentNavItems: NavItem[] = [
  {
    icon: <RxDashboard />,
    name: "Home",
    subItems: [{ name: "Dashboard", path: "/student/home" }],
  },
  {
    icon: <LiaMoneyCheckSolid />,
    name: "Payment",
    subItems: [
      { name: "Payment Summary", path: "/student/payment-summary" },
    ],
  },
  {
    icon: <LiaMoneyCheckSolid />,
    name: "Exams",
    subItems: [
      { name: "ExamsList", path: "/student/exams-list" },
    ],
  },
  {
    icon: <MdOutlinePayment />,
    name: "Settings",
    subItems: [
      { name: "Profile Settings", path: "/student/student-profile" },
      { name: "Reset Password", path: "/student/reset-password" },
    ],
  },
];

// === Sidebar Component ===

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;
    const items = getNavItemsForRole(role || '');
    items.forEach((nav, index) => {
      nav.subItems?.forEach((subItem) => {
        if (isActive(subItem.path)) {
          setOpenSubmenu({ type: "main", index });
          submenuMatched = true;
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu) {
      const key = `main-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];
      if (el) {
        setSubMenuHeight((prev) => ({ ...prev, [key]: el.scrollHeight }));
      }
    }
  }, [openSubmenu]);

  const getNavItemsForRole = (role: string): NavItem[] => {
    switch (role) {
      case "admin": return adminNavItems;
      case "superadmin": return superadminNavItems;
      case "student": return studentNavItems;
      default: return [];
    }
  };

  const itemsToUse = getNavItemsForRole(role || '');

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) =>
      prev?.index === index ? null : { type: "main", index }
    );
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} 
                cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`menu-item-icon-size ${openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className="menu-item-text">{nav.name}</span>
                  <FiChevronDown className={`ml-auto w-5 h-5 transition-transform ${openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />
                </>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
              >
                <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                  </>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => (subMenuRefs.current[`main-${index}`] = el)}
              className="overflow-hidden transition-all duration-300"
              style={{ height: openSubmenu?.index === index ? subMenuHeight[`main-${index}`] + "px" : "0px" }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 z-50 border-r border-gray-200 
      ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/admin/home">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img className="dark:hidden" src={logo1} alt="Logo" width={150} height={40} />
              <img className="hidden dark:block" src={logo2} alt="Logo" width={150} height={40} />
            </>
          ) : (
            <>
              <img className="block dark:hidden" src={logo3} alt="Logo" width={32} height={32} />
              <img className="hidden dark:block" src={logo4} alt="Logo" width={32} height={32} />
            </>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <FiChevronDown className="size-6" />}
              </h2>
              {renderMenuItems(itemsToUse)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
