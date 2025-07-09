import React, { useState, useEffect } from "react";
import {
  Music,
  Video,
  Users,
  Star,
  Menu,
  X,
  Play,
  Award,
  Globe,
  Target,
  TrendingUp,
  Shield,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Calendar,
  Clock,
  ArrowRight,
  PlayCircle,
  Rocket,
  Building,
  MessageCircle,
  Upload,
  FileVideo,
  Mic,
  Camera,
  CheckCircle,
  ArrowUp,
  Sparkles,
  Crown,
  Zap,
  Heart,
  Send,
  Film,
  LogIn,
} from "lucide-react";
import LanguageSwitcher from "./components/LanguageSwitcher";
import LoginPage from "./components/LoginPage";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import ContactMessagesManager from "./components/ContactMessagesManager";
import JoinUsManager from "./components/JoinUsManager";
import UserManager from "./components/UserManager";
import BackupManager from "./components/BackupManager";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { translations } from "./types/language";
import { addContactMessage, addJoinUsApplication } from "./utils/storage";
import { logFormSubmission } from "./utils/realTimeMonitor";

// Component principal avec authentification
const AppContent: React.FC = () => {
  const { auth } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  const [forceLogin, setForceLogin] = useState(false);
  const [adminSection, setAdminSection] = useState("dashboard");

  // Debug: Log auth state changes
  useEffect(() => {
    console.log("Auth state changed:", {
      isAuthenticated: auth.isAuthenticated,
      showAdmin,
      user: auth.user,
    });
  }, [auth.isAuthenticated, showAdmin]);

  // Force login page if requested or if trying to access admin without auth
  if ((showAdmin && !auth.isAuthenticated) || forceLogin) {
    console.log("Showing login page");
    return (
      <LoginPage
        onLoginSuccess={() => {
          console.log("Login successful, keeping admin view");
          setForceLogin(false);
          setShowAdmin(true);
        }}
      />
    );
  }

  if (showAdmin && auth.isAuthenticated) {
    console.log("Showing admin dashboard");
    const renderAdminContent = () => {
      switch (adminSection) {
        case "dashboard":
          return <AdminDashboard onSectionChange={setAdminSection} />;
        case "contacts":
          return <ContactMessagesManager />;
        case "join-us":
          return <JoinUsManager />;
        case "users":
          return <UserManager />;
        case "backup":
          return <BackupManager />;
        default:
          return <AdminDashboard onSectionChange={setAdminSection} />;
      }
    };

    return (
      <AdminLayout
        currentSection={adminSection}
        onSectionChange={setAdminSection}
      >
        {renderAdminContent()}
      </AdminLayout>
    );
  }

  return (
    <MainWebsite
      onShowAdmin={() => {
        console.log("onShowAdmin called!");
        setShowAdmin(true);
        setForceLogin(true);
      }}
    />
  );
};

// Site web principal
const MainWebsite: React.FC<{ onShowAdmin: () => void }> = ({
  onShowAdmin,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("fr");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Désactivé temporairement pour test
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  const [cursorClick, setCursorClick] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageType, setSuccessMessageType] = useState<
    "contact" | "joinus"
  >("contact");

  // Carousel images
  const heroImages = [
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3784424/pexels-photo-3784424.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ];

  // Translation function
  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.fr[key] || key;
  };

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") || "fr";
    setCurrentLanguage(savedLanguage);

    // Loading screen - très court pour test
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Failsafe: Force stop loading after 1 second max
    const failsafe = setTimeout(() => {
      console.warn("Failsafe: Force stopping loading screen");
      setIsLoading(false);
    }, 1000);

    // Also stop loading on any user interaction
    const handleUserInteraction = () => {
      setIsLoading(false);
    };

    window.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
      window.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  // Custom cursor
  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setCursorClick(true);
    const handleMouseUp = () => setCursorClick(false);

    window.addEventListener("mousemove", updateCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [role="button"]',
    );

    const handleMouseEnter = () => setCursorHover(true);
    const handleMouseLeave = () => setCursorHover(false);

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem("language", language);
  };

  // Carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "accueil",
        "divisions",
        "mission",
        "services",
        "talents",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      // Show scroll to top button
      setShowScrollTop(window.scrollY > 500);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }

      // Animation on scroll (excluding hero section)
      const animatedElements = document.querySelectorAll(
        ".animate-on-scroll:not(.hero-element)",
      );
      animatedElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("animate-fade-in-up");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Animate hero elements immediately on load
    setTimeout(() => {
      const heroElements = document.querySelectorAll(".hero-element");
      heroElements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add("animate-fade-in-up");
        }, index * 200);
      });
    }, 100);

    // Animate stats with counting effect
    setTimeout(() => {
      const statsElements = document.querySelectorAll(".stat-number");
      statsElements.forEach((element, index) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                const target = parseInt(
                  element.textContent?.replace("+", "") || "0",
                );
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                  current += increment;
                  if (current >= target) {
                    element.textContent = element.textContent?.includes("+")
                      ? `${target}+`
                      : target.toString();
                    clearInterval(timer);
                  } else {
                    element.textContent =
                      Math.floor(current).toString() +
                      (element.textContent?.includes("+") ? "+" : "");
                  }
                }, 30);
              }, index * 300);
              observer.unobserve(element);
            }
          });
        });
        observer.observe(element);
      });
    }, 500);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToHome = () => {
    scrollToSection("accueil");
  };

  // Handlers pour les formulaires
  const handleContactFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const contactData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    addContactMessage(contactData);
    logFormSubmission("contact", contactData);
    setSuccessMessageType("contact");
    setShowSuccessMessage(true);
    event.currentTarget.reset();

    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const handleJoinUsFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const joinUsData = {
      name: formData.get("nom") as string,
      email: formData.get("email") as string,
      phone: formData.get("telephone") as string,
      domain: formData.get("domaine") as string,
      presentation: formData.get("presentation") as string,
      portfolio: (formData.get("portfolio") as string) || undefined,
    };

    addJoinUsApplication(joinUsData);
    logFormSubmission("join_us", joinUsData);
    setSuccessMessageType("joinus");
    setShowSuccessMessage(true);
    event.currentTarget.reset();

    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const divisions = [
    {
      icon: Music,
      title: "ABA Music Record",
      description: {
        fr: "Production et distribution musicale de talents congolais",
        en: "Music production and distribution of Congolese talents",
        nl: "Muziekproductie en distributie van Congolese talenten",
        sw: "Uzalishaji na usambazaji wa muziki wa vipaji vya Kikongo",
        ln: "Kosala mpe kokabola banzembo ya bato ya mayele ya Congo",
      },
      features: {
        fr: [
          "Studio d'enregistrement professionnel",
          "Distribution digitale",
          "Promotion artistique",
        ],
        en: [
          "Professional recording studio",
          "Digital distribution",
          "Artistic promotion",
        ],
        nl: [
          "Professionele opnamestudio",
          "Digitale distributie",
          "Artistieke promotie",
        ],
        sw: [
          "Studio ya kitaalamu ya kurekodi",
          "Usambazaji wa kidijitali",
          "Ukuzaji wa kisanii",
        ],
        ln: [
          "Studio ya bosembo ya kokanga banzembo",
          "Kokabola na ba digitales",
          "Kotombola ba artistes",
        ],
      },
      gradient: "from-yellow-400 to-orange-500",
      hoverColor: "hover:shadow-yellow-400/25",
    },
    {
      icon: Film,
      title: "ABA Films",
      description: {
        fr: "Films, séries et production audiovisuelle complète",
        en: "Films, series and complete audiovisual production",
        nl: "Films, series en complete audiovisuele productie",
        sw: "Filamu, mfululizo na uzalishaji kamili wa sauti na picha",
        ln: "Ba films, ba séries mpe kosala bavideo mobimba",
      },
      features: {
        fr: [
          "Films et séries",
          "Documentaires",
          "Clips musicaux",
          "Publicités",
        ],
        en: [
          "Films and series",
          "Documentaries",
          "Music videos",
          "Advertisements",
        ],
        nl: [
          "Films en series",
          "Documentaires",
          "Muziekvideo's",
          "Advertenties",
        ],
        sw: [
          "Filamu na mfululizo",
          "Nyaraka za video",
          "Video za muziki",
          "Matangazo",
        ],
        ln: [
          "Ba films na ba séries",
          "Ba documentaires",
          "Ba clips ya banzembo",
          "Ba publicités",
        ],
      },
      gradient: "from-purple-500 to-pink-500",
      hoverColor: "hover:shadow-purple-400/25",
    },
    {
      icon: Users,
      title: "ABA Models",
      description: {
        fr: "Agence de mannequins et casting professionnel",
        en: "Modeling agency and professional casting",
        nl: "Modellenbureau en professionele casting",
        sw: "Wakala wa wawasilishaji na uteuzi wa kitaalamu",
        ln: "Agence ya ba mannequins mpe casting ya bosembo",
      },
      features: {
        fr: [
          "Casting professionnel",
          "Formation mannequins",
          "Événements mode",
        ],
        en: ["Professional casting", "Model training", "Fashion events"],
        nl: ["Professionele casting", "Modeltraining", "Mode-evenementen"],
        sw: [
          "Uteuzi wa kitaalamu",
          "Mafunzo ya wawasilishaji",
          "Matukio ya mitindo",
        ],
        ln: [
          "Casting ya bosembo",
          "Koteya ba mannequins",
          "Ba événements ya bilamba",
        ],
      },
      gradient: "from-blue-500 to-cyan-500",
      hoverColor: "hover:shadow-blue-400/25",
    },
    {
      icon: Star,
      title: "ABA Artists Management",
      description: {
        fr: "Gestion complète de carrière d'artistes",
        en: "Complete artist career management",
        nl: "Volledig artistiek carrièrebeheer",
        sw: "Usimamizi kamili wa kazi za wasanii",
        ln: "Kobatela mobimba ya mosala ya ba artistes",
      },
      features: {
        fr: [
          "Développement de carrière",
          "Négociation de contrats",
          "Relations publiques",
        ],
        en: ["Career development", "Contract negotiation", "Public relations"],
        nl: [
          "Carrièreontwikkeling",
          "Contractonderhandeling",
          "Public relations",
        ],
        sw: [
          "Maendeleo ya kazi",
          "Mazungumzo ya mikataba",
          "Mahusiano ya umma",
        ],
        ln: ["Kotombola mosala", "Kosolola ba contrats", "Boyokani na bato"],
      },
      gradient: "from-green-500 to-emerald-500",
      hoverColor: "hover:shadow-green-400/25",
    },
  ];

  const stats = [
    { number: "4", label: t("specializedDivisions"), icon: Target },
    { number: "10+", label: t("ongoingProjects"), icon: TrendingUp },
    { number: "15+", label: t("developingTalents"), icon: Star },
    { number: "2025", label: t("launchYear"), icon: Rocket },
  ];

  const services = [
    {
      icon: Music,
      title: "Production Musicale Complète",
      description:
        "De la composition à la distribution, nous accompagnons vos projets musicaux avec notre studio professionnel équipé des dernières technologies. Enregistrement, mixage, mastering et production de clips vidéo.",
      features: [
        "Studio d'enregistrement 24h/24",
        "Équipe de producteurs expérimentés",
        "Distribution sur toutes les plateformes",
        "Promotion radio et digitale",
      ],
      color: "yellow",
    },
    {
      icon: Film,
      title: "Réalisation Audiovisuelle",
      description:
        "Création de contenus visuels impactants pour tous supports : films, séries, documentaires, publicités et contenus digitaux. Notre équipe créative transforme vos idées en œuvres mémorables.",
      features: [
        "Équipement cinéma professionnel",
        "Équipe technique experte",
        "Post-production complète",
        "Distribution multi-plateformes",
      ],
      color: "purple",
    },
    {
      icon: Users,
      title: "Casting & Management",
      description:
        "Découverte et développement de talents dans tous les domaines artistiques. Formation professionnelle, coaching personnalisé et gestion de carrière pour maximiser votre potentiel.",
      features: [
        "Casting professionnel",
        "Formation artistique",
        "Coaching personnalisé",
        "Gestion de carrière",
      ],
      color: "blue",
    },
    {
      icon: Crown,
      title: "Stratégie de Marque Artistique",
      description:
        "Développement d'identité visuelle et stratégie de communication pour artistes et créateurs. Positionnement sur le marché, relations presse et campagnes marketing innovantes.",
      features: [
        "Identité visuelle",
        "Stratégie communication",
        "Relations presse",
        "Marketing digital",
      ],
      color: "green",
    },
    {
      icon: Globe,
      title: "Distribution Internationale",
      description:
        "Accès aux marchés internationaux grâce à notre réseau de partenaires. Distribution physique et digitale, négociation de contrats et développement commercial à l'étranger.",
      features: [
        "Réseau international",
        "Distribution globale",
        "Négociation contrats",
        "Développement commercial",
      ],
      color: "indigo",
    },
    {
      icon: Sparkles,
      title: "Événementiel & Spectacles",
      description:
        "Organisation d'événements artistiques et culturels de grande envergure. Concerts, festivals, galas et événements corporatifs avec une approche créative et professionnelle.",
      features: [
        "Organisation événements",
        "Production spectacles",
        "Logistique complète",
        "Promotion événementielle",
      ],
      color: "pink",
    },
  ];

  return (
    <div className="main-website min-h-screen bg-white font-montserrat">
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-screen" onClick={() => setIsLoading(false)}>
          <img
            src="/Logo_ABA-removebg-preview.png"
            alt="ABA Creative Group"
            className="loading-logo"
          />
          <div className="loading-text">ABA Creative Group</div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <p className="text-gray-400 mt-4 text-center">
            Chargement de l'expérience créative...
          </p>

          {/* Boutons immédiatement visibles */}
          <div className="mt-6 space-y-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLoading(false);
              }}
              className="block px-8 py-4 bg-yellow-400 text-black rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg"
            >
              ⚡ Entrer sur le site
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLoading(false);
                setTimeout(() => onShowAdmin(), 100);
              }}
              className="block px-8 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-all duration-300 shadow-lg"
            >
              🔐 Administration
            </button>

            <p className="text-gray-500 text-sm mt-4">
              Cliquez n'importe où ou sur un bouton pour continuer
            </p>
          </div>
        </div>
      )}

      {/* Custom Cursor */}
      <div
        className={`custom-cursor ${cursorHover ? "hover" : ""} ${cursorClick ? "click" : ""}`}
        style={{
          left: `${cursorPosition.x - 10}px`,
          top: `${cursorPosition.y - 10}px`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28">
            <div className="flex items-center">
              <img
                onClick={scrollToHome}
                src="/Logo_ABA-removebg-preview.png"
                alt="ABA Creative Group"
                className="h-28 w-auto transition-transform duration-300 hover:scale-105 cursor-pointer"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "accueil", label: t("home") },
                { id: "divisions", label: t("divisions") },
                { id: "mission", label: t("mission") },
                { id: "services", label: t("services") },
                { id: "talents", label: "Rejoignez-nous" },
                { id: "contact", label: t("contact") },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-all duration-300 relative ${
                    activeSection === item.id
                      ? "text-yellow-500"
                      : "text-gray-700 hover:text-yellow-500"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-500 animate-pulse"></div>
                  )}
                </button>
              ))}

              <LanguageSwitcher
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <LanguageSwitcher
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-yellow-500 transition-colors duration-300"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[
                { id: "accueil", label: t("home") },
                { id: "divisions", label: t("divisions") },
                { id: "mission", label: t("mission") },
                { id: "services", label: t("services") },
                { id: "talents", label: "Rejoignez-nous" },
                { id: "contact", label: t("contact") },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-yellow-500 hover:bg-gray-50 rounded-md transition-all duration-300"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-yellow-400 text-black p-3 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-110 z-50 animate-bounce-slow"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Hero Section */}
      <section
        id="accueil"
        className="pt-28 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden"
      >
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-30" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80"></div>
        <div className="absolute inset-0 bg-yellow-400/5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center hero-element">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight hero-element">
              ABA
              <span className="text-yellow-400 block animate-pulse">
                Creative Group
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed hero-element">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center hero-element">
              <button
                onClick={() => scrollToSection("divisions")}
                className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center group"
              >
                {t("discoverDivisions")}
                <ChevronRight
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  size={20}
                />
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300 flex items-center group"
              >
                <MessageCircle
                  className="mr-2 group-hover:scale-110 transition-transform duration-300"
                  size={20}
                />
                {t("contactUs")}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center hero-element group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex justify-center mb-3">
                    <stat.icon
                      className="text-yellow-400 group-hover:animate-pulse"
                      size={32}
                    />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors duration-300 stat-number">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divisions Section */}
      <section id="divisions" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              {t("divisionsTitle")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("divisionsSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {divisions.map((division, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl ${division.hoverColor} transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-gray-100 animate-on-scroll group cursor-pointer`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`bg-gradient-to-r ${division.gradient} p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <division.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                    {division.title}
                  </h3>
                </div>

                <p className="text-gray-600 mb-6 text-lg group-hover:text-gray-700 transition-colors duration-300">
                  {division.description[currentLanguage] ||
                    division.description.fr}
                </p>

                <ul className="space-y-3">
                  {(
                    division.features[currentLanguage] || division.features.fr
                  ).map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-gray-700 group-hover:text-gray-800 transition-colors duration-300"
                    >
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-yellow-500 font-semibold flex items-center hover:text-yellow-600">
                    En savoir plus
                    <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-4xl md:text-5xl font-black mb-8">
                {t("missionTitle")}
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {t("missionDescription")}
              </p>

              <div className="space-y-6">
                <div className="flex items-start group hover:transform hover:translate-x-2 transition-all duration-300">
                  <Target
                    className="text-yellow-400 mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                      Vision Internationale
                    </h4>
                    <p className="text-gray-400">
                      Positionner la culture congolaise sur la scène mondiale
                    </p>
                  </div>
                </div>

                <div className="flex items-start group hover:transform hover:translate-x-2 transition-all duration-300">
                  <Award
                    className="text-yellow-400 mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                      Excellence Professionnelle
                    </h4>
                    <p className="text-gray-400">
                      Standards internationaux dans tous nos projets
                    </p>
                  </div>
                </div>

                <div className="flex items-start group hover:transform hover:translate-x-2 transition-all duration-300">
                  <TrendingUp
                    className="text-yellow-400 mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold text-lg mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                      Développement Local
                    </h4>
                    <p className="text-gray-400">
                      Créer des emplois et valoriser les talents locaux
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-on-scroll">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-black transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">
                  Pourquoi ABA Creative Group ?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center group">
                    <Shield
                      className="mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      size={20}
                    />
                    <span className="font-medium">
                      Approche intégrée et multidisciplinaire
                    </span>
                  </li>
                  <li className="flex items-center group">
                    <Globe
                      className="mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      size={20}
                    />
                    <span className="font-medium">
                      Réseau international en développement
                    </span>
                  </li>
                  <li className="flex items-center group">
                    <Building
                      className="mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      size={20}
                    />
                    <span className="font-medium">
                      Infrastructure moderne et équipée
                    </span>
                  </li>
                  <li className="flex items-center group">
                    <Users
                      className="mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      size={20}
                    />
                    <span className="font-medium">
                      Équipe d'experts passionnés
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              {t("servicesTitle")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des services complets et professionnels pour transformer vos rêves
              artistiques en succès concrets
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-on-scroll group border border-gray-100"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <service.icon className="text-black" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <CheckCircle className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Talent Submission Section */}
      <section
        id="talents"
        className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-yellow-400/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-400 p-4 rounded-full animate-pulse">
                <Sparkles className="text-black" size={48} />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 gradient-text">
              Rejoignez la Révolution Créative
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Vous avez un talent exceptionnel ? Une passion qui vous consume ?
              <span className="text-yellow-400 font-bold">
                {" "}
                ABA Creative Group{" "}
              </span>
              recherche les prochaines stars qui feront rayonner la culture
              congolaise dans le monde entier.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Crown className="text-yellow-400 mr-3" size={28} />
                  Nous Recherchons
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Mic, label: "Chanteurs" },
                    { icon: Camera, label: "Acteurs" },
                    { icon: Users, label: "Mannequins" },
                    { icon: Music, label: "Musiciens" },
                    { icon: Video, label: "Réalisateurs" },
                    { icon: Star, label: "Créateurs" },
                  ].map((talent, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <talent.icon
                        className="text-yellow-400 mr-3 group-hover:scale-110 transition-transform duration-300"
                        size={20}
                      />
                      <span className="font-medium">{talent.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-6 text-black">
                <h4 className="text-xl font-bold mb-4 flex items-center">
                  <Zap className="mr-3" size={24} />
                  Pourquoi Nous Choisir ?
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Heart className="mr-3 text-red-500" size={16} />
                    <span className="font-medium">
                      Accompagnement personnalisé
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Globe className="mr-3 text-blue-500" size={16} />
                    <span className="font-medium">
                      Visibilité internationale
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Award className="mr-3 text-purple-500" size={16} />
                    <span className="font-medium">
                      Standards professionnels
                    </span>
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="mr-3 text-green-500" size={16} />
                    <span className="font-medium">
                      Développement de carrière
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="animate-on-scroll">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Soumettez Votre Talent
                </h3>

                <form className="space-y-6" onSubmit={handleJoinUsFormSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="nom"
                      placeholder="Votre nom complet"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Votre email"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
                    />
                  </div>

                  <input
                    type="tel"
                    name="telephone"
                    placeholder="Votre numéro de téléphone"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
                  />

                  <select
                    name="domaine"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300 [&>option]:text-black [&>option]:bg-white"
                  >
                    <option value="" className="text-gray-500">
                      Sélectionnez votre domaine
                    </option>
                    <option value="chanteur" className="text-black">
                      Chanteur
                    </option>
                    <option value="acteur" className="text-black">
                      Acteur
                    </option>
                    <option value="mannequin" className="text-black">
                      Mannequin
                    </option>
                    <option value="musicien" className="text-black">
                      Musicien
                    </option>
                    <option value="realisateur" className="text-black">
                      Réalisateur
                    </option>
                    <option value="createur" className="text-black">
                      Créateur de contenu
                    </option>
                  </select>

                  <textarea
                    rows={4}
                    name="presentation"
                    placeholder="Présentez-vous et décrivez votre talent (expérience, réalisations, objectifs...)"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 resize-none transition-all duration-300"
                  ></textarea>

                  <input
                    type="url"
                    name="portfolio"
                    placeholder="Lien vers votre portfolio/vidéo (YouTube, Instagram, etc.)"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
                  />

                  <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                    <h5 className="font-semibold text-yellow-400 mb-2 flex items-center">
                      <CheckCircle className="mr-2" size={16} />
                      Conditions de Soumission
                    </h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Être âgé de 16 ans minimum</li>
                      <li>
                        • Fournir un portfolio ou une démonstration de votre
                        talent
                      </li>
                      <li>• Avoir une passion authentique pour votre art</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black py-4 rounded-lg font-bold text-lg hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group"
                  >
                    <Send
                      className="mr-3 group-hover:translate-x-1 transition-transform duration-300"
                      size={20}
                    />
                    Soumettre Mon Talent
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 animate-on-scroll">
            <p className="text-gray-400 text-lg">
              <span className="text-yellow-400 font-bold">
                ABA Creative Group
              </span>{" "}
              - Votre tremplin vers le succès international
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t("contactTitle")}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t("contactSubtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="animate-on-scroll">
              <h3 className="text-2xl font-bold mb-8">
                Informations de Contact
              </h3>

              <div className="space-y-6">
                <div className="flex items-center group hover:transform hover:translate-x-2 transition-all duration-300">
                  <MapPin
                    className="text-yellow-400 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold">{t("address")}</h4>
                    <p className="text-gray-300">
                      Kinshasa, République Démocratique du Congo
                    </p>
                  </div>
                </div>

                <div className="flex items-center group hover:transform hover:translate-x-2 transition-all duration-300">
                  <Phone
                    className="text-yellow-400 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold">{t("phone")}</h4>
                    <p className="text-gray-300">+243 898 465 438</p>
                  </div>
                </div>

                <div className="flex items-center group hover:transform hover:translate-x-2 transition-all duration-300">
                  <Mail
                    className="text-yellow-400 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    size={24}
                  />
                  <div>
                    <h4 className="font-semibold">{t("email")}</h4>
                    <p className="text-gray-300">
                      contact@abacreativegroup.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll hover:bg-white/10 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6">{t("sendMessage")}</h3>

              <form className="space-y-6" onSubmit={handleContactFormSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder={t("name")}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={t("email")}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
                  />
                </div>

                <input
                  type="text"
                  name="subject"
                  placeholder={t("subject")}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
                />

                <textarea
                  rows={5}
                  name="message"
                  placeholder={t("message")}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/20 resize-none transition-all duration-300"
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  {t("sendButton")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-slide-down">
          <div className="flex items-center">
            <CheckCircle className="mr-2" size={20} />
            <div>
              <p className="font-semibold">
                {successMessageType === "contact"
                  ? t("thankYouMessage")
                  : "Candidature reçue !"}
              </p>
              <p className="text-sm opacity-90">
                {successMessageType === "contact"
                  ? t("messageReceived")
                  : t("applicationReceived")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6 relative">
              <div className="bg-white rounded-lg p-4">
                <img
                  src="/Logo_ABA-removebg-preview.png"
                  alt="ABA Creative Group"
                  className="h-16 w-auto hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Bouton de connexion discret */}
              <button
                onClick={() => {
                  console.log("Admin button clicked!");
                  onShowAdmin();
                }}
                className="absolute bottom-0 right-0 text-gray-600 hover:text-yellow-400 transition-colors duration-300 opacity-30 hover:opacity-100"
                title="Administration"
              >
                <LogIn size={16} />
              </button>

              {/* Debug info et bouton de test - sera retiré */}
              <div className="absolute top-0 left-0 text-xs text-gray-500 bg-black/20 p-2 rounded space-y-2">
                <div>Debug: Admin button ready</div>
                <button
                  onClick={() => {
                    console.log("TEST: Direct admin access");
                    onShowAdmin();
                  }}
                  className="block px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                >
                  TEST ADMIN
                </button>
              </div>
            </div>

            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              {t("footerDescription")}
            </p>

            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500 mb-2">{t("copyright")}</p>
              <p className="text-gray-600 text-sm">
                {t("developedBy")}{" "}
                <a
                  href="https://hibs-cd.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-medium"
                >
                  Himaya Business Sarl
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
