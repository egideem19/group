import React from 'react';
import { Calendar, Clock, ArrowLeft, Share2, Eye, Tag } from 'lucide-react';

interface NewsPageProps {
  onBack: () => void;
  t: (key: string) => string;
}

const NewsPage: React.FC<NewsPageProps> = ({ onBack, t }) => {
  const allNews = [
    {
      id: 1,
      title: {
        fr: "Lancement officiel d'ABA Creative Group",
        en: "Official launch of ABA Creative Group",
        nl: "Officiële lancering van ABA Creative Group",
        sw: "Uzinduzi rasmi wa ABA Creative Group",
        ln: "Kobanda ya ABA Creative Group na nzela ya bosembo"
      },
      excerpt: {
        fr: "Nous sommes fiers d'annoncer le lancement officiel de notre conglomérat créatif en RDC, marquant une nouvelle ère pour l'industrie créative congolaise.",
        en: "We are proud to announce the official launch of our creative conglomerate in DRC, marking a new era for the Congolese creative industry.",
        nl: "We zijn trots om de officiële lancering van ons creatieve conglomeraat in DRC aan te kondigen, wat een nieuw tijdperk markeert voor de Congolese creatieve industrie.",
        sw: "Tunajivunia kutangaza uzinduzi rasmi wa shirika letu la ubunifu nchini DRC, kuashiria enzi mpya kwa tasnia ya ubunifu wa Kikongo.",
        ln: "Tozali na esengo ya kosakola kobanda ya ebongiseli na biso ya bokeli na RDC, oyo ezali kolakisa ntango ya sika mpo na mosala ya bokeli ya Congo."
      },
      content: {
        fr: "Kinshasa, 15 janvier 2025 - ABA Creative Group annonce officiellement son lancement en République Démocratique du Congo, marquant l'entrée d'un nouveau géant dans l'industrie créative africaine. Cette initiative ambitieuse vise à révolutionner le paysage médiatique et artistique congolais en offrant une plateforme intégrée pour les talents locaux.\n\nNotre conglomérat se compose de quatre divisions spécialisées : ABA Music Record pour la production musicale, ABA Films pour l'audiovisuel, ABA Models pour le mannequinat, et ABA Artists Management pour la gestion d'artistes. Chaque division est équipée d'infrastructures modernes et d'une équipe d'experts passionnés.\n\n'Nous croyons fermement au potentiel créatif exceptionnel de la RDC', déclare notre directeur général. 'Notre mission est de donner aux talents congolais les outils et la visibilité qu'ils méritent sur la scène internationale.'\n\nABA Creative Group prévoit de lancer plusieurs projets majeurs dans les prochains mois, incluant l'ouverture de son studio d'enregistrement professionnel et le lancement de sa première campagne de découverte de talents à travers le pays.",
        en: "Kinshasa, January 15, 2025 - ABA Creative Group officially announces its launch in the Democratic Republic of Congo, marking the entry of a new giant in the African creative industry. This ambitious initiative aims to revolutionize the Congolese media and artistic landscape by offering an integrated platform for local talents.\n\nOur conglomerate consists of four specialized divisions: ABA Music Record for music production, ABA Films for audiovisual, ABA Models for modeling, and ABA Artists Management for artist management. Each division is equipped with modern infrastructure and a team of passionate experts.\n\n'We firmly believe in the exceptional creative potential of the DRC', declares our general manager. 'Our mission is to give Congolese talents the tools and visibility they deserve on the international stage.'\n\nABA Creative Group plans to launch several major projects in the coming months, including the opening of its professional recording studio and the launch of its first talent discovery campaign across the country.",
        nl: "Kinshasa, 15 januari 2025 - ABA Creative Group kondigt officieel zijn lancering aan in de Democratische Republiek Congo, wat de komst markeert van een nieuwe reus in de Afrikaanse creatieve industrie. Dit ambitieuze initiatief heeft tot doel het Congolese media- en artistieke landschap te revolutioneren door een geïntegreerd platform te bieden voor lokale talenten.\n\nOns conglomeraat bestaat uit vier gespecialiseerde divisies: ABA Music Record voor muziekproductie, ABA Films voor audiovisueel, ABA Models voor modeling, en ABA Artists Management voor artistenmanagement. Elke divisie is uitgerust met moderne infrastructuur en een team van gepassioneerde experts.\n\n'We geloven sterk in het uitzonderlijke creatieve potentieel van de DRC', verklaart onze algemeen directeur. 'Onze missie is om Congolese talenten de tools en zichtbaarheid te geven die ze verdienen op het internationale podium.'\n\nABA Creative Group is van plan om in de komende maanden verschillende grote projecten te lanceren, waaronder de opening van zijn professionele opnamestudio en de lancering van zijn eerste talentontdekkingscampagne door het hele land.",
        sw: "Kinshasa, Januari 15, 2025 - ABA Creative Group inatangaza rasmi uzinduzi wake nchini Jamhuri ya Kidemokrasia ya Kongo, kuashiria kuingia kwa jitu jipya katika tasnia ya ubunifu ya Afrika. Juhudi hii ya malengo makubwa inalenga kubadilisha mazingira ya vyombo vya habari na sanaa ya Kikongo kwa kutoa jukwaa la pamoja kwa vipaji vya ndani.\n\nShirika letu linajumuisha idara nne maalum: ABA Music Record kwa uzalishaji wa muziki, ABA Films kwa sauti na picha, ABA Models kwa uwasilishaji, na ABA Artists Management kwa usimamizi wa wasanii. Kila idara ina miundombinu ya kisasa na timu ya wataalamu wenye shauku.\n\n'Tunaamini kwa nguvu uwezo wa kipekee wa ubunifu wa DRC', anasema mkurugenzi wetu mkuu. 'Dhamira yetu ni kuwapa vipaji vya Kikongo zana na mwonekano wanaostahili kwenye jukwaa la kimataifa.'\n\nABA Creative Group inapanga kuzindua miradi kadhaa mikuu katika miezi ijayo, ikiwa ni pamoja na ufunguzi wa studio yake ya kitaaluma ya kurekodi na uzinduzi wa kampeni yake ya kwanza ya kugundua vipaji nchini kote.",
        ln: "Kinshasa, 15 janvier 2025 - ABA Creative Group ezali kosakola na nzela ya bosembo kobanda na ye na République Démocratique ya Congo, oyo ezali kolakisa kokota ya ebongiseli ya monene na mosala ya bokeli ya Afrika. Mokano oyo ya monene ezali na mokano ya kobongola biloko ya bapanzi nsango mpe ya bonkoko ya Congo na kopesa esika ya bokutani mpo na bato ya mayele ya mboka.\n\nEbongiseli na biso ezali na biteni minei ya bokeseni: ABA Music Record mpo na kosala banzembo, ABA Films mpo na bavideo, ABA Models mpo na ba mannequins, mpe ABA Artists Management mpo na kobatela ba artistes. Eteni moko na moko ezali na biloko ya sika mpe ekipi ya ba experts oyo bazali na mposa.\n\n'Tozali kondima makasi na makoki ya bokeli ya Congo', alobi directeur général na biso. 'Mokano na biso ezali ya kopesa bato ya mayele ya Congo bisaleli mpe bomoni oyo basengeli na mokili mobimba.'\n\nABA Creative Group ezali na mokano ya kobanda misala mingi ya monene na basanza oyo ekoya, na kati na yango kofungola studio na ye ya bosembo ya kokanga banzembo mpe kobanda campagne na ye ya liboso ya koluka bato ya mayele na mboka mobimba."
      },
      date: "15 Janvier 2025",
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200",
      category: {
        fr: "Annonce",
        en: "Announcement",
        nl: "Aankondiging",
        sw: "Tangazo",
        ln: "Kosakola"
      },
      readTime: "5 min",
      views: 1250,
      featured: true
    },
    {
      id: 2,
      title: {
        fr: "Ouverture de notre studio d'enregistrement professionnel",
        en: "Opening of our professional recording studio",
        nl: "Opening van onze professionele opnamestudio",
        sw: "Ufunguzi wa studio yetu ya kitaaluma ya kurekodi",
        ln: "Kofungola studio na biso ya bosembo ya kokanga banzembo"
      },
      excerpt: {
        fr: "ABA Music Record inaugure son studio d'enregistrement professionnel équipé des dernières technologies pour accompagner nos artistes.",
        en: "ABA Music Record inaugurates its professional recording studio equipped with the latest technologies to support our artists.",
        nl: "ABA Music Record opent zijn professionele opnamestudio uitgerust met de nieuwste technologieën om onze artiesten te ondersteunen.",
        sw: "ABA Music Record inafungua studio yake ya kitaalamu ya kurekodi iliyojengwa na teknolojia za hivi karibuni kusaidia wasanii wetu.",
        ln: "ABA Music Record ezali kofungola studio na ye ya bosembo ya kokanga banzembo oyo ezali na biloko ya sika mpo na kosunga ba artistes na biso."
      },
      content: {
        fr: "Un nouveau chapitre s'ouvre pour ABA Music Record avec l'inauguration de son studio d'enregistrement professionnel, situé au cœur de Kinshasa. Cette infrastructure de pointe représente un investissement majeur dans l'avenir de la musique congolaise.\n\nLe studio, d'une superficie de 200m², comprend trois salles d'enregistrement insonorisées, une régie technique équipée des derniers logiciels de production musicale, et un espace de détente pour les artistes. L'équipement inclut des microphones haut de gamme, des consoles de mixage professionnelles et des moniteurs de studio de référence.\n\n'Ce studio représente notre engagement envers l'excellence', explique le directeur technique d'ABA Music Record. 'Nous voulons offrir aux artistes congolais un environnement de création au niveau international.'\n\nLe studio sera ouvert aux artistes d'ABA Creative Group ainsi qu'aux talents externes souhaitant bénéficier de nos services de production. Des forfaits adaptés à tous les budgets seront proposés, démocratisant ainsi l'accès à un enregistrement de qualité professionnelle.",
        en: "A new chapter opens for ABA Music Record with the inauguration of its professional recording studio, located in the heart of Kinshasa. This cutting-edge infrastructure represents a major investment in the future of Congolese music.\n\nThe studio, covering 200m², includes three soundproof recording rooms, a technical control room equipped with the latest music production software, and a relaxation area for artists. The equipment includes high-end microphones, professional mixing consoles and reference studio monitors.\n\n'This studio represents our commitment to excellence', explains the technical director of ABA Music Record. 'We want to offer Congolese artists a creative environment at international level.'\n\nThe studio will be open to ABA Creative Group artists as well as external talents wishing to benefit from our production services. Packages adapted to all budgets will be offered, thus democratizing access to professional quality recording.",
        nl: "Een nieuw hoofdstuk opent voor ABA Music Record met de opening van zijn professionele opnamestudio, gelegen in het hart van Kinshasa. Deze geavanceerde infrastructuur vertegenwoordigt een grote investering in de toekomst van Congolese muziek.\n\nDe studio, met een oppervlakte van 200m², omvat drie geluiddichte opnameruimtes, een technische regiekamer uitgerust met de nieuwste muziekproductiesoftware, en een ontspanningsruimte voor artiesten. De apparatuur omvat high-end microfoons, professionele mengpanelen en referentie studiomonitoren.\n\n'Deze studio vertegenwoordigt onze toewijding aan excellentie', legt de technisch directeur van ABA Music Record uit. 'We willen Congolese artiesten een creatieve omgeving op internationaal niveau bieden.'\n\nDe studio zal open zijn voor ABA Creative Group artiesten evenals externe talenten die willen profiteren van onze productiediensten. Pakketten aangepast aan alle budgetten zullen worden aangeboden, waardoor toegang tot professionele kwaliteit opname wordt gedemocratiseerd.",
        sw: "Sura mpya inafunguliwa kwa ABA Music Record na uzinduzi wa studio yake ya kitaalamu ya kurekodi, iliyoko katika moyo wa Kinshasa. Miundombinu hii ya hali ya juu inawakilisha uongozi mkubwa katika mustakabali wa muziki wa Kikongo.\n\nStudio hiyo, inayofunika 200m², inajumuisha vyumba vitatu vya kurekodi visivyopita sauti, chumba cha udhibiti wa kiufundi kilichojengwa na programu za hivi karibuni za uzalishaji wa muziki, na eneo la kupumzika kwa wasanii. Vifaa vimejumuisha mikrofoni ya hali ya juu, meza za kuchanganya za kitaalamu na vifuatiliaji vya studio vya kurejelea.\n\n'Studio hii inawakilisha kujitolea kwetu kwa ubora', anaeleza mkurugenzi wa kiufundi wa ABA Music Record. 'Tunataka kuwapa wasanii wa Kikongo mazingira ya ubunifu kwa kiwango cha kimataifa.'\n\nStudio itakuwa wazi kwa wasanii wa ABA Creative Group pamoja na vipaji vya nje vinavyotaka kufaidika na huduma zetu za uzalishaji. Vifurushi vilivyorekebishwa kwa bajeti zote vitatolewa, hivyo kudemokratisha ufikiaji wa kurekodi kwa ubora wa kitaalamu.",
        ln: "Sanza ya sika ezali kofungwama mpo na ABA Music Record na kofungola studio na ye ya bosembo ya kokanga banzembo, oyo ezali na kati ya Kinshasa. Biloko oyo ya sika ezali kolakisa kotia mbongo ya monene na mikolo ekoya ya banzembo ya Congo.\n\nStudio oyo, oyo ezali na 200m², ezali na bashambre misato ya kokanga banzembo oyo makelele ekokotaka te, shambre ya ba techniques oyo ezali na ba logiciels ya sika ya kosala banzembo, mpe esika ya kopema mpo na ba artistes. Biloko ezali na ba microphones ya malamu, ba consoles ya kosangisa ya bosembo mpe ba moniteurs ya studio ya kotalela.\n\n'Studio oyo ezali kolakisa kondima na biso na malamu', alobi directeur technique ya ABA Music Record. 'Tolingi kopesa ba artistes ya Congo esika ya bokeli na niveau ya mokili mobimba.'\n\nStudio ekozala polele mpo na ba artistes ya ABA Creative Group mpe mpo na bato ya mayele ya libanda oyo balingi kozwa misala na biso ya kosala banzembo. Ba forfaits oyo ekokani na mbongo nyonso ekopesama, na bongo bato nyonso bakozwa nzela ya kokanga banzembo ya malamu ya bosembo."
      },
      date: "28 Janvier 2025",
      image: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1200",
      category: {
        fr: "Infrastructure",
        en: "Infrastructure",
        nl: "Infrastructuur",
        sw: "Miundombinu",
        ln: "Biloko"
      },
      readTime: "4 min",
      views: 890,
      featured: false
    },
    {
      id: 3,
      title: {
        fr: "Partenariat stratégique avec les festivals locaux",
        en: "Strategic partnership with local festivals",
        nl: "Strategisch partnerschap met lokale festivals",
        sw: "Ushirikiano wa kimkakati na tamasha za ndani",
        ln: "Boyokani ya mayele na ba festivals ya mboka"
      },
      excerpt: {
        fr: "ABA Creative Group s'associe avec plusieurs festivals congolais pour promouvoir nos talents et créer des opportunités de visibilité.",
        en: "ABA Creative Group partners with several Congolese festivals to promote our talents and create visibility opportunities.",
        nl: "ABA Creative Group werkt samen met verschillende Congolese festivals om onze talenten te promoten en zichtbaarheidskansen te creëren.",
        sw: "ABA Creative Group inashirikiana na tamasha kadhaa za Kikongo kukuza vipaji vyetu na kuunda fursa za kuonekana.",
        ln: "ABA Creative Group ezali kosala boyokani na ba festivals ebele ya Congo mpo na kotombola bato ya mayele na biso mpe kosala mabaku ya bomoni."
      },
      content: {
        fr: "ABA Creative Group franchit une nouvelle étape dans sa stratégie de développement en nouant des partenariats stratégiques avec les principaux festivals culturels de la République Démocratique du Congo. Ces collaborations visent à créer un écosystème dynamique pour la promotion des talents locaux.\n\nParmi nos partenaires figurent le Festival Amani, le Congo Fashion Week, et le Festival de Musique de Kinshasa. Ces événements majeurs offriront une plateforme privilégiée pour présenter les artistes d'ABA Creative Group au grand public.\n\n'Ces partenariats s'inscrivent dans notre vision d'un développement collaboratif de l'industrie créative congolaise', souligne notre directrice des partenariats. 'Ensemble, nous pouvons créer plus d'opportunités et toucher un public plus large.'\n\nLes premiers fruits de ces collaborations se concrétiseront dès le mois prochain avec la participation de nos artistes à trois événements majeurs. Des showcases exclusifs, des ateliers de formation et des sessions de networking sont au programme.",
        en: "ABA Creative Group takes a new step in its development strategy by forging strategic partnerships with the main cultural festivals of the Democratic Republic of Congo. These collaborations aim to create a dynamic ecosystem for promoting local talents.\n\nOur partners include the Amani Festival, Congo Fashion Week, and the Kinshasa Music Festival. These major events will offer a privileged platform to present ABA Creative Group artists to the general public.\n\n'These partnerships are part of our vision of collaborative development of the Congolese creative industry', emphasizes our partnerships director. 'Together, we can create more opportunities and reach a wider audience.'\n\nThe first fruits of these collaborations will materialize next month with the participation of our artists in three major events. Exclusive showcases, training workshops and networking sessions are on the program.",
        nl: "ABA Creative Group zet een nieuwe stap in zijn ontwikkelingsstrategie door strategische partnerschappen aan te gaan met de belangrijkste culturele festivals van de Democratische Republiek Congo. Deze samenwerkingen hebben tot doel een dynamisch ecosysteem te creëren voor het promoten van lokale talenten.\n\nOnze partners omvatten het Amani Festival, Congo Fashion Week, en het Kinshasa Music Festival. Deze grote evenementen zullen een bevoorrecht platform bieden om ABA Creative Group artiesten aan het grote publiek te presenteren.\n\n'Deze partnerschappen maken deel uit van onze visie op collaboratieve ontwikkeling van de Congolese creatieve industrie', benadrukt onze partnerschapsdirecteur. 'Samen kunnen we meer kansen creëren en een breder publiek bereiken.'\n\nDe eerste vruchten van deze samenwerkingen zullen volgende maand concreet worden met de deelname van onze artiesten aan drie grote evenementen. Exclusieve showcases, trainingsworkshops en netwerksessies staan op het programma.",
        sw: "ABA Creative Group inachukua hatua mpya katika mkakati wake wa maendeleo kwa kuunda ushirikiano wa kimkakati na tamasha kuu za kitamaduni za Jamhuri ya Kidemokrasia ya Kongo. Ushirikiano huu unalenga kuunda mazingira yenye nguvu ya kukuza vipaji vya ndani.\n\nWashirika wetu ni pamoja na Tamasha la Amani, Wiki ya Mitindo ya Kongo, na Tamasha la Muziki la Kinshasa. Matukio haya makuu yatatoa jukwaa la kipekee la kuwasilisha wasanii wa ABA Creative Group kwa umma mkuu.\n\n'Ushirikiano huu ni sehemu ya maono yetu ya maendeleo ya ushirikiano wa tasnia ya ubunifu ya Kikongo', anasisitiza mkurugenzi wetu wa ushirikiano. 'Pamoja, tunaweza kuunda fursa zaidi na kufikia hadhira kubwa zaidi.'\n\nMatunda ya kwanza ya ushirikiano huu yataonekana mwezi ujao na kushiriki kwa wasanii wetu katika matukio matatu makuu. Maonyesho ya kipekee, warsha za mafunzo na vikao vya kuunganisha ni katika mpango.",
        ln: "ABA Creative Group ezali kozwa litambe ya sika na mayele na ye ya bokoli na kosala boyokani ya mayele na ba festivals ya minene ya mimeseno ya République Démocratique ya Congo. Boyokani oyo ezali na mokano ya kosala esika ya makasi mpo na kotombola bato ya mayele ya mboka.\n\nBa partenaires na biso bazali Festival Amani, Congo Fashion Week, mpe Festival ya Banzembo ya Kinshasa. Ba événements oyo ya minene ekopesa esika ya malamu mpo na kolakisa ba artistes ya ABA Creative Group na bato nyonso.\n\n'Boyokani oyo ezali na kati ya makanisi na biso ya bokoli ya boyokani ya mosala ya bokeli ya Congo', alobi directrice na biso ya ba partenariats. 'Na boyokani, tokoki kosala mabaku mingi mpe kokutana na bato ebele.'\n\nMbuma ya liboso ya boyokani oyo ekomonana na sanza ekoya na kokota ya ba artistes na biso na ba événements misato ya minene. Ba showcases ya kaka bango, ba ateliers ya koteya mpe ba sessions ya boyokani ezali na programme."
      },
      date: "5 Février 2025",
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200",
      category: {
        fr: "Partenariat",
        en: "Partnership",
        nl: "Partnerschap",
        sw: "Ushirikiano",
        ln: "Boyokani"
      },
      readTime: "3 min",
      views: 654,
      featured: false
    },
    {
      id: 4,
      title: {
        fr: "Lancement du programme de formation pour jeunes talents",
        en: "Launch of training program for young talents",
        nl: "Lancering van trainingsprogramma voor jonge talenten",
        sw: "Uzinduzi wa mpango wa mafunzo kwa vipaji vijana",
        ln: "Kobanda programme ya koteya mpo na bato ya mayele ya bilenge"
      },
      excerpt: {
        fr: "ABA Creative Group lance son premier programme de formation gratuit destiné aux jeunes talents congolais âgés de 16 à 25 ans.",
        en: "ABA Creative Group launches its first free training program for young Congolese talents aged 16 to 25.",
        nl: "ABA Creative Group lanceert zijn eerste gratis trainingsprogramma voor jonge Congolese talenten van 16 tot 25 jaar.",
        sw: "ABA Creative Group inazindua mpango wake wa kwanza wa mafunzo ya bure kwa vipaji vijana vya Kikongo wenye umri wa miaka 16 hadi 25.",
        ln: "ABA Creative Group ezali kobanda programme na ye ya liboso ya koteya ya ofele mpo na bato ya mayele ya bilenge ya Congo ya mibu 16 tii na 25."
      },
      content: {
        fr: "Dans le cadre de sa mission de développement des talents locaux, ABA Creative Group annonce le lancement de son programme de formation 'ABA Academy'. Cette initiative gratuite vise à former la prochaine génération d'artistes, producteurs et créatifs congolais.\n\nLe programme, d'une durée de six mois, couvre quatre domaines principaux : production musicale, réalisation audiovisuelle, mannequinat et gestion artistique. Les participants bénéficieront de cours théoriques, d'ateliers pratiques et de mentorat personnalisé par nos experts.\n\n'Investir dans la jeunesse, c'est investir dans l'avenir de notre industrie', déclare la directrice de la formation. 'Nous voulons donner aux jeunes Congolais les compétences nécessaires pour exceller dans leurs domaines de prédilection.'\n\nLes inscriptions sont ouvertes dès maintenant et se clôtureront le 28 février. Un processus de sélection rigoureux permettra de retenir 40 candidats qui intégreront la première promotion d'ABA Academy en mars 2025.",
        en: "As part of its mission to develop local talents, ABA Creative Group announces the launch of its training program 'ABA Academy'. This free initiative aims to train the next generation of Congolese artists, producers and creatives.\n\nThe six-month program covers four main areas: music production, audiovisual production, modeling and artistic management. Participants will benefit from theoretical courses, practical workshops and personalized mentoring by our experts.\n\n'Investing in youth means investing in the future of our industry', declares the training director. 'We want to give young Congolese the skills necessary to excel in their areas of expertise.'\n\nRegistrations are open now and will close on February 28. A rigorous selection process will select 40 candidates who will join the first class of ABA Academy in March 2025.",
        nl: "Als onderdeel van zijn missie om lokale talenten te ontwikkelen, kondigt ABA Creative Group de lancering aan van zijn trainingsprogramma 'ABA Academy'. Dit gratis initiatief heeft tot doel de volgende generatie Congolese artiesten, producers en creatievelingen op te leiden.\n\nHet zesmaandse programma beslaat vier hoofdgebieden: muziekproductie, audiovisuele productie, modeling en artistiek management. Deelnemers zullen profiteren van theoretische cursussen, praktische workshops en gepersonaliseerde mentoring door onze experts.\n\n'Investeren in de jeugd betekent investeren in de toekomst van onze industrie', verklaart de trainingsdirecteur. 'We willen jonge Congolezen de vaardigheden geven die nodig zijn om uit te blinken in hun expertisegebieden.'\n\nInschrijvingen zijn nu open en sluiten op 28 februari. Een rigoureus selectieproces zal 40 kandidaten selecteren die zich in maart 2025 bij de eerste klas van ABA Academy zullen voegen.",
        sw: "Kama sehemu ya dhamira yake ya kukuza vipaji vya ndani, ABA Creative Group inatangaza uzinduzi wa mpango wake wa mafunzo 'ABA Academy'. Juhudi hii ya bure inalenga kufunza kizazi kijacho cha wasanii, wazalishaji na wabunifu wa Kikongo.\n\nMpango wa miezi sita unashughulikia maeneo manne makuu: uzalishaji wa muziki, uzalishaji wa sauti na picha, uwasilishaji na usimamizi wa kisanii. Washiriki watafaidika na masomo ya kinadharia, warsha za vitendo na uongozaji wa kibinafsi na wataalamu wetu.\n\n'Kuwekeza kwa vijana kunamaanisha kuwekeza katika mustakabali wa tasnia yetu', anasema mkurugenzi wa mafunzo. 'Tunataka kuwapa vijana wa Kikongo ujuzi unaohitajika kustawi katika maeneo yao ya utaalamu.'\n\nUsajili umefunguliwa sasa na utafungwa Februari 28. Mchakato mkali wa uchaguzi utachagua wagombea 40 ambao watajiunga na darasa la kwanza la ABA Academy mnamo Machi 2025.",
        ln: "Na kati ya mokano na ye ya kotombola bato ya mayele ya mboka, ABA Creative Group ezali kosakola kobanda programme na ye ya koteya 'ABA Academy'. Mokano oyo ya ofele ezali na mokano ya koteya molongo ya sima ya ba artistes, ba producteurs mpe bato ya bokeli ya Congo.\n\nProgramme ya basanza motoba ezali kotala makambo minei ya minene: kosala banzembo, kosala bavideo, ba mannequins mpe kobatela ba artistes. Bato oyo bakosangana bakozwa makambo ya mayele, ba ateliers ya kosala mpe koteya ya moto na moto na ba experts na biso.\n\n'Kotia mbongo na bilenge ezali kotia mbongo na mikolo ekoya ya mosala na biso', alobi directrice ya koteya. 'Tolingi kopesa bilenge ya Congo mayele oyo basengeli mpo na kolonga na makambo oyo balingi.'\n\nKokoma bakombo ezali polele sikawa mpe ekosila na 28 février. Nzela ya kopona ya makasi ekopona bato 40 oyo bakokota na molongo ya liboso ya ABA Academy na mars 2025."
      },
      date: "12 Février 2025",
      image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200",
      category: {
        fr: "Formation",
        en: "Training",
        nl: "Training",
        sw: "Mafunzo",
        ln: "Koteya"
      },
      readTime: "4 min",
      views: 1120,
      featured: true
    }
  ];

  const [selectedArticle, setSelectedArticle] = React.useState<number | null>(null);
  const [currentLanguage, setCurrentLanguage] = React.useState('fr');

  React.useEffect(() => {
    // Get current language from parent component
    const lang = localStorage.getItem('language') || 'fr';
    setCurrentLanguage(lang);
  }, []);

  const getTranslatedContent = (content: any, lang: string) => {
    return content[lang] || content.fr;
  };

  if (selectedArticle) {
    const article = allNews.find(news => news.id === selectedArticle);
    if (!article) return null;

    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center text-yellow-500 hover:text-yellow-600 transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" size={20} />
            Retour aux actualités
          </button>

          <article className="bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="relative h-96 overflow-hidden">
              <img 
                src={article.image} 
                alt={getTranslatedContent(article.title, currentLanguage)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold">
                  {getTranslatedContent(article.category, currentLanguage)}
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6 text-gray-500 text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {article.date}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    {article.readTime}
                  </div>
                  <div className="flex items-center">
                    <Eye size={16} className="mr-2" />
                    {article.views} vues
                  </div>
                </div>
                <button className="flex items-center text-gray-500 hover:text-yellow-500 transition-colors duration-300">
                  <Share2 size={16} className="mr-2" />
                  Partager
                </button>
              </div>

              <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                {getTranslatedContent(article.title, currentLanguage)}
              </h1>

              <div className="prose prose-lg max-w-none">
                {getTranslatedContent(article.content, currentLanguage).split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 mt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag size={16} className="text-gray-400" />
                    <span className="text-gray-600">
                      {getTranslatedContent(article.category, currentLanguage)}
                    </span>
                  </div>
                  <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-300">
                    Articles similaires
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="flex items-center text-yellow-500 hover:text-yellow-600 transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" size={20} />
          Retour à l'accueil
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            {t('newsTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('newsSubtitle')}
          </p>
        </div>

        {/* Featured Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Articles à la une</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {allNews.filter(article => article.featured).map((article) => (
              <article 
                key={article.id}
                onClick={() => setSelectedArticle(article.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={getTranslatedContent(article.title, currentLanguage)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {getTranslatedContent(article.category, currentLanguage)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {article.readTime}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar size={16} className="mr-2" />
                    {article.date}
                    <Eye size={16} className="ml-4 mr-2" />
                    {article.views}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                    {getTranslatedContent(article.title, currentLanguage)}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {getTranslatedContent(article.excerpt, currentLanguage)}
                  </p>
                  
                  <button className="text-yellow-500 font-semibold flex items-center hover:text-yellow-600 transition-colors duration-300">
                    {t('readMore')}
                    <ArrowLeft className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform duration-300" size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* All Articles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Toutes les actualités</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allNews.map((article) => (
              <article 
                key={article.id}
                onClick={() => setSelectedArticle(article.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={getTranslatedContent(article.title, currentLanguage)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {getTranslatedContent(article.category, currentLanguage)}
                    </span>
                  </div>
                  {article.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        À la une
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      {article.date}
                    </div>
                    <div className="flex items-center">
                      <Eye size={16} className="mr-1" />
                      {article.views}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300 line-clamp-2">
                    {getTranslatedContent(article.title, currentLanguage)}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {getTranslatedContent(article.excerpt, currentLanguage)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                    <button className="text-yellow-500 font-semibold flex items-center hover:text-yellow-600 transition-colors duration-300">
                      {t('readMore')}
                      <ArrowLeft className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform duration-300" size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;