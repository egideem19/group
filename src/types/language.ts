export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const languages: Language[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  { code: 'ln', name: 'Lingala', flag: '🇨🇩' }
];

export const translations: Translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    divisions: 'Divisions',
    mission: 'Mission',
    services: 'Services',
    news: 'Actualités',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'ABA Creative Group',
    heroSubtitle: 'Le conglomérat de référence en médias et divertissement en RDC. Nous découvrons, encadrons et promouvons les talents congolais à l\'échelle internationale.',
    discoverDivisions: 'Découvrir nos divisions',
    watchPresentation: 'Voir notre présentation',
    contactUs: 'Contactez-nous',
    
    // Stats
    specializedDivisions: 'Divisions Spécialisées',
    ongoingProjects: 'Projets en Cours',
    developingTalents: 'Talents en Développement',
    launchYear: 'Année de Lancement',
    
    // Divisions
    divisionsTitle: 'Nos Divisions',
    divisionsSubtitle: 'Quatre divisions spécialisées pour couvrir tous les aspects de l\'industrie créative congolaise',
    
    // Mission
    missionTitle: 'Notre Mission',
    missionDescription: 'Découvrir, encadrer et promouvoir les talents congolais tout en créant une structure professionnelle de référence à l\'échelle internationale.',
    
    // Services
    servicesTitle: 'Nos Services',
    servicesSubtitle: 'Une gamme complète de services pour accompagner votre succès dans l\'industrie créative',
    
    // News
    newsTitle: 'Nos Actualités',
    newsSubtitle: 'Suivez les dernières nouvelles et développements d\'ABA Creative Group',
    readMore: 'Lire la suite',
    
    // Contact
    contactTitle: 'Contactez Nous',
    contactSubtitle: 'Prêt à rejoindre la révolution créative congolaise ? Parlons de votre projet !',
    address: 'Adresse',
    phone: 'Téléphone',
    email: 'Email',
    sendMessage: 'Envoyez-nous un message',
    name: 'Nom',
    subject: 'Sujet',
    message: 'Votre message',
    sendButton: 'Envoyer le message',
    
    // Footer
    footerDescription: 'Valorisant la culture congolaise et créant des opportunités dans le secteur créatif depuis 2025.',
    copyright: '© 2025 ABA Creative Group. Tous droits réservés. | République Démocratique du Congo',
    developedBy: 'Ce site a été conçu et développé avec amour par'
  },
  en: {
    // Navigation
    home: 'Home',
    divisions: 'Divisions',
    mission: 'Mission',
    services: 'Services',
    news: 'News',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'ABA Creative Group',
    heroSubtitle: 'The leading media and entertainment conglomerate in DRC. We discover, mentor and promote Congolese talents internationally.',
    discoverDivisions: 'Discover our divisions',
    watchPresentation: 'Watch our presentation',
    contactUs: 'Contact us',
    
    // Stats
    specializedDivisions: 'Specialized Divisions',
    ongoingProjects: 'Ongoing Projects',
    developingTalents: 'Developing Talents',
    launchYear: 'Launch Year',
    
    // Divisions
    divisionsTitle: 'Our Divisions',
    divisionsSubtitle: 'Four specialized divisions to cover all aspects of the Congolese creative industry',
    
    // Mission
    missionTitle: 'Our Mission',
    missionDescription: 'Discover, mentor and promote Congolese talents while creating a professional structure of reference on an international scale.',
    
    // Services
    servicesTitle: 'Our Services',
    servicesSubtitle: 'A complete range of services to support your success in the creative industry',
    
    // News
    newsTitle: 'Our News',
    newsSubtitle: 'Follow the latest news and developments from ABA Creative Group',
    readMore: 'Read more',
    
    // Contact
    contactTitle: 'Contact Us',
    contactSubtitle: 'Ready to join the Congolese creative revolution? Let\'s talk about your project!',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    sendMessage: 'Send us a message',
    name: 'Name',
    subject: 'Subject',
    message: 'Your message',
    sendButton: 'Send message',
    
    // Footer
    footerDescription: 'Promoting Congolese culture and creating opportunities in the creative sector since 2025.',
    copyright: '© 2025 ABA Creative Group. All rights reserved. | Democratic Republic of Congo',
    developedBy: 'This site was designed and developed with love by'
  },
  nl: {
    // Navigation
    home: 'Home',
    divisions: 'Divisies',
    mission: 'Missie',
    services: 'Diensten',
    news: 'Nieuws',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'ABA Creative Group',
    heroSubtitle: 'Het toonaangevende media- en entertainmentconglomeraat in DRC. Wij ontdekken, begeleiden en promoten Congolese talenten internationaal.',
    discoverDivisions: 'Ontdek onze divisies',
    watchPresentation: 'Bekijk onze presentatie',
    contactUs: 'Neem contact op',
    
    // Stats
    specializedDivisions: 'Gespecialiseerde Divisies',
    ongoingProjects: 'Lopende Projecten',
    developingTalents: 'Ontwikkelende Talenten',
    launchYear: 'Lancering Jaar',
    
    // Divisions
    divisionsTitle: 'Onze Divisies',
    divisionsSubtitle: 'Vier gespecialiseerde divisies om alle aspecten van de Congolese creatieve industrie te dekken',
    
    // Mission
    missionTitle: 'Onze Missie',
    missionDescription: 'Congolese talenten ontdekken, begeleiden en promoten terwijl we een professionele referentiestructuur op internationale schaal creëren.',
    
    // Services
    servicesTitle: 'Onze Diensten',
    servicesSubtitle: 'Een compleet scala aan diensten om uw succes in de creatieve industrie te ondersteunen',
    
    // News
    newsTitle: 'Ons Nieuws',
    newsSubtitle: 'Volg het laatste nieuws en ontwikkelingen van ABA Creative Group',
    readMore: 'Lees meer',
    
    // Contact
    contactTitle: 'Neem Contact Op',
    contactSubtitle: 'Klaar om deel te nemen aan de Congolese creatieve revolutie? Laten we praten over uw project!',
    address: 'Adres',
    phone: 'Telefoon',
    email: 'E-mail',
    sendMessage: 'Stuur ons een bericht',
    name: 'Naam',
    subject: 'Onderwerp',
    message: 'Uw bericht',
    sendButton: 'Bericht verzenden',
    
    // Footer
    footerDescription: 'Congolese cultuur promoten en kansen creëren in de creatieve sector sinds 2025.',
    copyright: '© 2025 ABA Creative Group. Alle rechten voorbehouden. | Democratische Republiek Congo',
    developedBy: 'Deze site is met liefde ontworpen en ontwikkeld door'
  },
  sw: {
    // Navigation
    home: 'Nyumbani',
    divisions: 'Idara',
    mission: 'Dhamira',
    services: 'Huduma',
    news: 'Habari',
    contact: 'Mawasiliano',
    
    // Hero Section
    heroTitle: 'ABA Creative Group',
    heroSubtitle: 'Shirika kuu la vyombo vya habari na burudani nchini DRC. Tunagundua, kuongoza na kukuza vipaji vya Kikongo kimataifa.',
    discoverDivisions: 'Gundua idara zetu',
    watchPresentation: 'Tazama uwasilishaji wetu',
    contactUs: 'Wasiliana nasi',
    
    // Stats
    specializedDivisions: 'Idara Maalum',
    ongoingProjects: 'Miradi Inayoendelea',
    developingTalents: 'Vipaji Vinavyokua',
    launchYear: 'Mwaka wa Uzinduzi',
    
    // Divisions
    divisionsTitle: 'Idara Zetu',
    divisionsSubtitle: 'Idara nne maalum za kufunika vipengele vyote vya tasnia ya ubunifu wa Kikongo',
    
    // Mission
    missionTitle: 'Dhamira Yetu',
    missionDescription: 'Kugundua, kuongoza na kukuza vipaji vya Kikongo huku tukiunda muundo wa kitaaluma wa kurejelea kwa kiwango cha kimataifa.',
    
    // Services
    servicesTitle: 'Huduma Zetu',
    servicesSubtitle: 'Huduma kamili za kusaidia mafanikio yako katika tasnia ya ubunifu',
    
    // News
    newsTitle: 'Habari Zetu',
    newsSubtitle: 'Fuata habari za hivi karibuni na maendeleo ya ABA Creative Group',
    readMore: 'Soma zaidi',
    
    // Contact
    contactTitle: 'Wasiliana Nasi',
    contactSubtitle: 'Uko tayari kujiunga na mapinduzi ya ubunifu wa Kikongo? Hebu tuzungumze kuhusu mradi wako!',
    address: 'Anwani',
    phone: 'Simu',
    email: 'Barua pepe',
    sendMessage: 'Tutumie ujumbe',
    name: 'Jina',
    subject: 'Mada',
    message: 'Ujumbe wako',
    sendButton: 'Tuma ujumbe',
    
    // Footer
    footerDescription: 'Kukuza utamaduni wa Kikongo na kuunda fursa katika sekta ya ubunifu tangu 2025.',
    copyright: '© 2025 ABA Creative Group. Haki zote zimehifadhiwa. | Jamhuri ya Kidemokrasia ya Kongo',
    developedBy: 'Tovuti hii ilibuniwa na kutengenezwa kwa upendo na'
  },
  ln: {
    // Navigation
    home: 'Ndako',
    divisions: 'Biteni',
    mission: 'Mokano',
    services: 'Misala',
    news: 'Nsango',
    contact: 'Boyokani',
    
    // Hero Section
    heroTitle: 'ABA Creative Group',
    heroSubtitle: 'Ebongiseli ya liboso ya bapanzi nsango na esengo na RDC. Tozali koluka, koteya mpe kotombola bato ya mayele ya Congo na mokili mobimba.',
    discoverDivisions: 'Yeba biteni na biso',
    watchPresentation: 'Tala kolakisa na biso',
    contactUs: 'Boyokana na biso',
    
    // Stats
    specializedDivisions: 'Biteni ya Bokeseni',
    ongoingProjects: 'Misala Ezali Kokende',
    developingTalents: 'Bato ya Mayele Bazali Kokola',
    launchYear: 'Mobu ya Kobanda',
    
    // Divisions
    divisionsTitle: 'Biteni na Biso',
    divisionsSubtitle: 'Biteni minei ya bokeseni mpo na kozipa makambo nyonso ya mosala ya bokeli ya Congo',
    
    // Mission
    missionTitle: 'Mokano na Biso',
    missionDescription: 'Koluka, koteya mpe kotombola bato ya mayele ya Congo ntango tozali kosala ebongiseli ya mosala ya malamu na mokili mobimba.',
    
    // Services
    servicesTitle: 'Misala na Biso',
    servicesSubtitle: 'Misala nyonso mpo na kosunga bolongi na yo na mosala ya bokeli',
    
    // News
    newsTitle: 'Nsango na Biso',
    newsSubtitle: 'Landa nsango ya sika mpe bokoli ya ABA Creative Group',
    readMore: 'Tanga mingi',
    
    // Contact
    contactTitle: 'Boyokana na Biso',
    contactSubtitle: 'Ozali pene ya kokota na mbongwana ya bokeli ya Congo? Tolobana na ntina ya mosala na yo!',
    address: 'Esika',
    phone: 'Telefone',
    email: 'Email',
    sendMessage: 'Tinda nsango epai na biso',
    name: 'Nkombo',
    subject: 'Likambo',
    message: 'Nsango na yo',
    sendButton: 'Tinda nsango',
    
    // Footer
    footerDescription: 'Kotombola mimeseno ya Congo mpe kosala mabaku na mosala ya bokeli banda 2025.',
    copyright: '© 2025 ABA Creative Group. Makoki nyonso ebombami. | République Démocratique ya Congo',
    developedBy: 'Site oyo esalamaki mpe etongamaki na bolingo na'
  }
};