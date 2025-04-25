import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Link } from 'react-router-dom';
import { useSidebar } from "../context/SidebarContext";
import { FaBox } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi"
import { HiMiniAcademicCap } from "react-icons/hi2";
import { PiExam, PiStudentFill } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { LiaMoneyCheckSolid } from "react-icons/lia";
import { CiSettings } from "react-icons/ci";
import { MdOutlineLockOpen } from "react-icons/md";  // Lock Icon import
import logo1 from '../assets/Images/logo/ThunderGits_Logos/1.png'
import logo2 from '../assets/Images/logo/ThunderGits_Logos/2.png'
import logo3 from '../assets/Images/logo/ThunderGits_Logos/3.png'
import logo4 from '../assets/Images/logo/ThunderGits_Logos/4.png'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchSubscriptionStatus } from "../redux/slices/subscriptionSlice";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <RxDashboard />,
    name: "Home",
    subItems: [{ name: "Dashboard", path: "/admin/home", pro: false }],
  },

  {
    icon: <HiMiniAcademicCap />,
    name: "Academics",
    subItems: [{ name: "Class", path: "/admin/class", pro: false },
    { name: "Subject", path: "/admin/subject", pro: false },
    { name: "Assign Subject", path: "/admin/assign-subject", pro: false },
    { name: "Upgrade Class", path: "/admin/upgrade-class", pro: false },
    { name: "Upgrade Roll No.", path: "/admin/Upgrade-RollNo", pro: false }
    ],
  },
  {
    icon: <PiStudentFill />,
    name: "Students",
    subItems: [
      { name: "Student", path: "/admin/student", pro: false },
      { name: "ID Card", path: "/admin/student-id-card", pro: false }
    ],
  },
  {
    icon: <PiExam />,
    name: "Exam",
    subItems: [
      { name: "Exam", path: "/admin/exams", pro: false },
      { name: "Exam Schedule", path: "/admin/exam-schedule", pro: false },
      { name: "Generate Admit Card", path: "/admin/generate-admit-card", pro: false }
    ],
  },
  {
    icon: <LiaMoneyCheckSolid />,
    name: "Fees",
    subItems: [
      { name: "Fee Structure", path: "/admin/fee-structure", pro: false },
      { name: "Fee Type", path: "/admin/fee-type", pro: false },
      { name: "Generate Demand Slip", path: "/admin/generate-demand-slip", pro: false }
    ],
  },
  {
    icon: <CiSettings />,
    name: "Settings",
    subItems: [
      { name: "Profile Settings", path: "/admin/profile-settings", pro: false },
      { name: "Subscriptions", path: "/admin/subscriptions", pro: false },
    ],
  },

  // Super admin sections

  {
    icon: <CiSettings />,
    name: "School",
    subItems: [
      { name: "Schools", path: "/admin/schools", pro: false },
    ],
  },

  {
    icon: <CiSettings />,
    name: "Subscriptions",
    subItems: [
      { name: "Subscription plans", path: "/admin/Subscription-plans", pro: false },
    ],
  },
 
];

const othersItems: NavItem[] = [
  {
    icon: <FaBox />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <FaBox />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <FaBox />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const dispatch = useDispatch();
  const subscription = useSelector((state: RootState) => state.subscription);
  const role = localStorage.getItem("role")
  useEffect(() => {
    if (!subscription.status) {
      dispatch(fetchSubscriptionStatus()); // Dispatch action to fetch subscription status
    }
  }, [dispatch, subscription.status]);

  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const filterNavItemsForRole = (role: string) => {
    if (role === 'superadmin') {
      return navItems.filter(item =>
        item.name === 'Home' || item.name === 'School' || item.name === 'Subscriptions'
      );
    }
    return navItems; // Return all if the role is not superadmin
  };
  const itemsToUse = filterNavItemsForRole(role || ''); 
  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <FiChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={(subscription.status === "active" || nav.name == 'Home') ? nav.path : "/admin/subscriptions"}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(subscription.status !== "active" && nav.name != 'Home' && role == 'admin') && (
                  <MdOutlineLockOpen className="ml-2 text-gray-400" />
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={(subscription.status === "active" || subItem?.name == 'Dashboard' || role != 'admin') ? subItem.path : "/admin/subscriptions"}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      {(subscription.status !== "active" && subItem?.name !== 'Dashboard' && role == 'admin') && (
                        <MdOutlineLockOpen className="ml-2 text-gray-400" />
                      )}
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
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/admin/home">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src={logo1}
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src={logo2}
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <>
              <img
                className="block dark:hidden"
                src={logo3}
                alt="Logo"
                width={32}
                height={32}
              />
              <img
                className="hidden dark:block"
                src={logo4}
                alt="Logo"
                width={32}
                height={32}
              />
            </>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <FiChevronDown className="size-6" />
                )}
              </h2>
              {renderMenuItems(itemsToUse, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
