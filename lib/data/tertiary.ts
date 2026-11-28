// lib/data/tertiary.ts
export type TertiaryType = "University" | "University of Technology" | "TVET College" | "Private Higher Education Institution"

export type TertiaryInstitution = {
  id: string
  name: string
  type: TertiaryType
  provinces: string[]
  programmes: string[]
}

const ALL_PROVINCES = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"]

/**
 * National TVET programme list. Colleges differ in what they offer, so the
 * form labels this as a guide and always allows "Other (type below)".
 */
export const TVET_CORE = [
  "Business Management (NATED)",
  "Financial Management (NATED)",
  "Human Resource Management (NATED)",
  "Marketing Management (NATED)",
  "Management Assistant (NATED)",
  "Public Management (NATED)",
  "Tourism (NATED)",
  "Hospitality and Catering (NATED)",
  "Civil Engineering (NATED)",
  "Electrical Engineering (NATED)",
  "Mechanical Engineering (NATED)",
  "Business Administration (NCV)",
  "Finance, Economics and Accounting (NCV)",
  "Office Administration (NCV)",
  "Information Technology and Computer Science (NCV)",
  "Engineering and Related Design (NCV)",
  "Civil Engineering and Building Construction (NCV)",
  "Electrical Infrastructure Construction (NCV)",
  "Hospitality (NCV)",
  "Tourism (NCV)",
  "Safety in Society (NCV)",
  "Transport and Logistics (NCV)",
  "Agriculture (NCV)",
  "Art and Design (NCV)",
  "Education and Development (NCV)",
]

export const TERTIARY_INSTITUTIONS: TertiaryInstitution[] = [
  // ------------------------------------------------------------ UNIVERSITIES
  {
    id: "cput",
    name: "Cape Peninsula University of Technology",
    type: "University of Technology",
    provinces: ["Western Cape"],
    programmes: [
      "BEng Tech Civil Engineering", "BEng Tech Electrical Engineering", "BEng Tech Mechanical Engineering",
      "BSc Computer Science", "BCom", "Diploma in Nursing", "BEd", "Diploma in Hospitality Management",
      "Bachelor of Design in Communication Design", "BSc Construction Management",
    ],
  },
  {
    id: "cut",
    name: "Central University of Technology, Free State",
    type: "University of Technology",
    provinces: ["Free State"],
    programmes: [
      "BEng Tech Civil Engineering", "BEng Tech Electrical Engineering", "BEng Tech Mechanical Engineering",
      "BSc Information Technology", "BCom", "BEd", "Diploma in Nursing", "Bachelor of Design",
      "Diploma in Agriculture",
    ],
  },
  {
    id: "dut",
    name: "Durban University of Technology",
    type: "University of Technology",
    provinces: ["KwaZulu-Natal"],
    programmes: [
      "BEng Tech Civil Engineering", "BEng Tech Electrical Engineering", "BEng Tech Mechanical Engineering",
      "BSc Information Technology", "BCom", "BEd", "Diploma in Nursing", "Bachelor of Design",
      "BSc Environmental Health", "Diploma in Hospitality Management",
    ],
  },
  {
    id: "mut",
    name: "Mangosuthu University of Technology",
    type: "University of Technology",
    provinces: ["KwaZulu-Natal"],
    programmes: [
      "Diploma in Civil Engineering", "Diploma in Electrical Engineering", "Diploma in Mechanical Engineering",
      "Diploma in Chemical Engineering", "Diploma in Information Technology", "Diploma in Accounting",
      "Diploma in Environmental Health",
    ],
  },
  {
    id: "mandela",
    name: "Nelson Mandela University",
    type: "University",
    provinces: ["Eastern Cape"],
    programmes: [
      "BCom", "BSc", "BEng", "LLB", "MBChB", "BEd", "BPharm", "BA", "BSc Information Technology",
      "Diploma in Nursing", "BSocSci",
    ],
  },
  {
    id: "nwu",
    name: "North-West University",
    type: "University",
    provinces: ["North West", "Gauteng"],
    programmes: [
      "BCom", "BSc", "BEng", "LLB", "BEd", "BA", "BSc Information Technology", "BPharm", "BTh",
      "Diploma in Nursing", "BSocSci",
    ],
  },
  {
    id: "rhodes",
    name: "Rhodes University",
    type: "University",
    provinces: ["Eastern Cape"],
    programmes: [
      "BA", "BSc", "BCom", "LLB", "BEd", "BSc Information Technology", "BPharm", "BSocSci",
      "Bachelor of Journalism", "Bachelor of Social Work",
    ],
  },
  {
    id: "smu",
    name: "Sefako Makgatho Health Sciences University",
    type: "University",
    provinces: ["Gauteng"],
    programmes: [
      "MBChB", "BDS", "BPharm", "BSc Dietetics", "BSc Physiotherapy", "BSc Occupational Therapy",
      "BSc Nursing", "BSc Medical Sciences",
    ],
  },
  {
    id: "spu",
    name: "Sol Plaatje University",
    type: "University",
    provinces: ["Northern Cape"],
    programmes: [
      "BA", "BSc", "BCom", "BEd", "BSc Information Technology", "Diploma in Heritage Studies",
      "Bachelor of Education (Foundation Phase)",
    ],
  },
  {
    id: "sun",
    name: "Stellenbosch University",
    type: "University",
    provinces: ["Western Cape"],
    programmes: [
      "BA", "BSc", "BCom", "BEng", "LLB", "MBChB", "BEd", "BSc Information Technology", "BPharm",
      "BTh", "Bachelor of Social Work",
    ],
  },
  {
    id: "tut",
    name: "Tshwane University of Technology",
    type: "University of Technology",
    provinces: ["Gauteng"],
    programmes: [
      "BEng Tech Civil Engineering", "BEng Tech Electrical Engineering", "BEng Tech Mechanical Engineering",
      "BSc Information Technology", "BCom", "BEd", "Diploma in Nursing", "Bachelor of Design",
      "BSc Hospitality Management",
    ],
  },
  {
    id: "uct",
    name: "University of Cape Town",
    type: "University",
    provinces: ["Western Cape"],
    programmes: [
      "BA", "BSc", "BCom", "BEng", "LLB", "MBChB", "BEd", "BSc Information Technology", "BPharm",
      "BSocSci", "Bachelor of Architectural Studies",
    ],
  },
  {
    id: "ufh",
    name: "University of Fort Hare",
    type: "University",
    provinces: ["Eastern Cape"],
    programmes: [
      "BA", "BSc", "BCom", "LLB", "BEd", "BSc Information Technology", "BSc Agriculture", "BSocSci",
      "Diploma in Nursing", "Bachelor of Social Work",
    ],
  },
  {
    id: "uj",
    name: "University of Johannesburg",
    type: "University",
    provinces: ["Gauteng"],
    programmes: [
      "BA", "BSc", "BCom", "BEng", "LLB", "BEd", "BSc Information Technology", "BPharm", "Bachelor of Design",
      "Diploma in Nursing", "BSocSci",
    ],
  },
  {
    id: "ukzn",
    name: "University of KwaZulu-Natal",
    type: "University",
    provinces: ["KwaZulu-Natal"],
    programmes: [
      "BA", "BSc", "BCom", "BEng", "LLB", "MBChB", "BEd", "BSc Information Technology", "BPharm",
      "Bachelor of Architectural Studies", "BSocSci",
    ],
  },
  {
    id: "ul",
    name: "University of Limpopo",
    type: "University",
    provinces: ["Limpopo"],
    programmes: [
      "BA", "BSc", "BCom", "LLB", "BEd", "BSc Information Technology", "BPharm", "BSc Agriculture",
      "Diploma in Nursing", "Bachelor of Social Work",
    ],
  },
  {
    id: "ump",
    name: "University of Mpumalanga",
    type: "University",
    provinces: ["Mpumalanga"],
    programmes: [
      "BA", "BSc", "BCom", "BEd", "BSc Information Technology", "BSc Agriculture",
      "Diploma in Hospitality Management", "Bachelor of Social Work",
    ],
  },
  {
    id: "up",
    name: "University of Pretoria",
    type: "University",
    provinces: ["Gauteng"],
    programmes: [
      "BA", "BSc", "BCom", "BEng", "LLB", "MBChB", "BEd", "BSc Information Technology", "BPharm",
      "Bachelor of Architectural Studies", "BSc Agriculture", "Bachelor of Veterinary Science",
    ],
  },
  {
    id: "unisa",
    name: "University of South Africa (UNISA)",
    type: "University",
    provinces: ALL_PROVINCES,
    programmes: [
      "BA", "BSc", "BCom", "LLB", "BEd", "BSc Information Technology", "BPharm", "BSocSci",
      "Diploma in Nursing", "BTh", "Bachelor of Social Work",
    ],
  },
  {
    id: "ufs",
    name: "University of the Free State",
    type: "University",
    provinces: ["Free State"],
    programmes: [
      "BA", "BSc", "BCom", "BEng", "LLB", "MBChB", "BEd", "BSc Information Technology", "BPharm",
      "BSc Agriculture", "Diploma in Nursing",
    ],
  },
  {
    id: "uwc",
    name: "University of the Western Cape",
    type: "University",
    provinces: ["Western Cape"],
    programmes: [
      "BA", "BSc", "BCom", "LLB", "BEd", "BSc Information Technology", "BPharm", "BSocSci",
      "Diploma in Nursing", "BSc Environmental Health", "Bachelor of Social Work",
    ],
  },
  {
    id: "wits",
    name: "University of the Witwatersrand",
    type: "University",
    provinces: ["Gauteng"],
    programmes: [
      "BA", "BSc", "BCom", "BEng", "LLB", "MBChB", "BEd", "BSc Information Technology", "BPharm",
      "Bachelor of Architectural Studies", "BSocSci",
    ],
  },
  {
    id: "vut",
    name: "Vaal University of Technology",
    type: "University of Technology",
    provinces: ["Gauteng"],
    programmes: [
      "BEng Tech Civil Engineering", "BEng Tech Electrical Engineering", "BEng Tech Mechanical Engineering",
      "BSc Information Technology", "BCom", "Diploma in Nursing", "Bachelor of Design",
      "Diploma in Hospitality Management",
    ],
  },
  {
    id: "unizulu",
    name: "University of Zululand",
    type: "University",
    provinces: ["KwaZulu-Natal"],
    programmes: [
      "BA", "BSc", "BCom", "BEd", "BSc Information Technology", "BSc Agriculture", "Diploma in Nursing",
      "BSocSci", "Bachelor of Social Work",
    ],
  },
  {
    id: "wsu",
    name: "Walter Sisulu University",
    type: "University",
    provinces: ["Eastern Cape"],
    programmes: [
      "BA", "BSc", "BCom", "LLB", "BEd", "BSc Information Technology", "Diploma in Nursing",
      "BSc Environmental Health", "Diploma in Hospitality Management",
    ],
  },
  {
    id: "univen",
    name: "University of Venda",
    type: "University",
    provinces: ["Limpopo"],
    programmes: [
      "BA", "BSc", "BCom", "LLB", "BEd", "BSc Information Technology", "BSc Agriculture",
      "Diploma in Nursing", "BSocSci", "Bachelor of Social Work",
    ],
  },

  // ----------------------------------------------------------- TVET COLLEGES
  { id: "boland", name: "Boland TVET College", type: "TVET College", provinces: ["Western Cape"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "buffalo-city", name: "Buffalo City TVET College", type: "TVET College", provinces: ["Eastern Cape"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "capricorn", name: "Capricorn TVET College", type: "TVET College", provinces: ["Limpopo"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "central-johannesburg", name: "Central Johannesburg TVET College", type: "TVET College", provinces: ["Gauteng"], programmes: [...TVET_CORE, "Jewellery Design", "Boilermaking"] },
  { id: "coastal-kzn", name: "Coastal KZN TVET College", type: "TVET College", provinces: ["KwaZulu-Natal"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "cape-town", name: "College of Cape Town for TVET", type: "TVET College", provinces: ["Western Cape"], programmes: [...TVET_CORE, "Boilermaking", "Welding", "Motor Mechanics"] },
  { id: "eastcape-midlands", name: "Eastcape Midlands TVET College", type: "TVET College", provinces: ["Eastern Cape"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "ehlanzeni", name: "Ehlanzeni TVET College", type: "TVET College", provinces: ["Mpumalanga"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "ekurhuleni-east", name: "Ekurhuleni East TVET College", type: "TVET College", provinces: ["Gauteng"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "ekurhuleni-west", name: "Ekurhuleni West TVET College", type: "TVET College", provinces: ["Gauteng"], programmes: [...TVET_CORE, "Boilermaking", "Motor Mechanics"] },
  { id: "elangeni", name: "Elangeni TVET College", type: "TVET College", provinces: ["KwaZulu-Natal"], programmes: [...TVET_CORE, "Welding", "Hospitality"] },
  { id: "esayidi", name: "Esayidi TVET College", type: "TVET College", provinces: ["KwaZulu-Natal"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "false-bay", name: "False Bay TVET College", type: "TVET College", provinces: ["Western Cape"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "flavius-mareka", name: "Flavius Mareka TVET College", type: "TVET College", provinces: ["Free State"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "gert-sibande", name: "Gert Sibande TVET College", type: "TVET College", provinces: ["Mpumalanga"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "goldfields", name: "Goldfields TVET College", type: "TVET College", provinces: ["Free State"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "ikhala", name: "Ikhala TVET College", type: "TVET College", provinces: ["Eastern Cape"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "ingwe", name: "Ingwe TVET College", type: "TVET College", provinces: ["Eastern Cape"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "king-hintsa", name: "King Hintsa TVET College", type: "TVET College", provinces: ["Eastern Cape"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "king-sabata", name: "King Sabata Dalindyebo TVET College", type: "TVET College", provinces: ["Eastern Cape"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "lephalale", name: "Lephalale TVET College", type: "TVET College", provinces: ["Limpopo"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "letaba", name: "Letaba TVET College", type: "TVET College", provinces: ["Limpopo"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "lovedale", name: "Lovedale TVET College", type: "TVET College", provinces: ["Eastern Cape"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "majuba", name: "Majuba TVET College", type: "TVET College", provinces: ["KwaZulu-Natal"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "maluti", name: "Maluti TVET College", type: "TVET College", provinces: ["Free State"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "mnambithi", name: "Mnambithi TVET College", type: "TVET College", provinces: ["KwaZulu-Natal"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "mopani-south", name: "Mopani South TVET College", type: "TVET College", provinces: ["Limpopo"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "motheo", name: "Motheo TVET College", type: "TVET College", provinces: ["Free State"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "mthashana", name: "Mthashana TVET College", type: "TVET College", provinces: ["KwaZulu-Natal"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "nkangala", name: "Nkangala TVET College", type: "TVET College", provinces: ["Mpumalanga"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "northern-cape-rural", name: "Northern Cape Rural TVET College", type: "TVET College", provinces: ["Northern Cape"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "northern-cape-urban", name: "Northern Cape Urban TVET College", type: "TVET College", provinces: ["Northern Cape"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "northlink", name: "Northlink TVET College", type: "TVET College", provinces: ["Western Cape"], programmes: [...TVET_CORE, "Boilermaking", "Welding", "Motor Mechanics"] },
  { id: "orbit", name: "Orbit TVET College", type: "TVET College", provinces: ["North West"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "port-elizabeth", name: "Port Elizabeth TVET College", type: "TVET College", provinces: ["Eastern Cape"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "sedibeng", name: "Sedibeng TVET College", type: "TVET College", provinces: ["Gauteng"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "sekhukhune", name: "Sekhukhune TVET College", type: "TVET College", provinces: ["Limpopo"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "south-cape", name: "South Cape TVET College", type: "TVET College", provinces: ["Western Cape"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "south-west-gauteng", name: "South West Gauteng TVET College", type: "TVET College", provinces: ["Gauteng"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "taletso", name: "Taletso TVET College", type: "TVET College", provinces: ["North West"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "thekwini", name: "Thekwini TVET College", type: "TVET College", provinces: ["KwaZulu-Natal"], programmes: [...TVET_CORE, "Welding", "Motor Mechanics"] },
  { id: "tshwane-north", name: "Tshwane North TVET College", type: "TVET College", provinces: ["Gauteng"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "tshwane-south", name: "Tshwane South TVET College", type: "TVET College", provinces: ["Gauteng"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "umfolozi", name: "Umfolozi TVET College", type: "TVET College", provinces: ["KwaZulu-Natal"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "umgungundlovu", name: "Umgungundlovu TVET College", type: "TVET College", provinces: ["KwaZulu-Natal"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "vhembe", name: "Vhembe TVET College", type: "TVET College", provinces: ["Limpopo"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "vuselela", name: "Vuselela TVET College", type: "TVET College", provinces: ["North West"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },
  { id: "waterberg", name: "Waterberg TVET College", type: "TVET College", provinces: ["Limpopo"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "west-coast", name: "West Coast TVET College", type: "TVET College", provinces: ["Western Cape"], programmes: [...TVET_CORE, "Agriculture", "Welding"] },
  { id: "western-college", name: "Western College for TVET", type: "TVET College", provinces: ["Gauteng"], programmes: [...TVET_CORE, "Boilermaking", "Welding"] },

  // -------------------------------------------------- PRIVATE HEIs (SELECTED)
  { id: "iie", name: "The Independent Institute of Education (IIE)", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape", "Eastern Cape"], programmes: ["Bachelor of Commerce", "Bachelor of Business Administration", "Bachelor of Arts", "Bachelor of Education", "Bachelor of Information Technology", "Diploma in Business", "Higher Certificate"] },
  { id: "varsity-college", name: "Varsity College", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape", "Eastern Cape"], programmes: ["Bachelor of Commerce", "Bachelor of Arts", "Bachelor of Education", "Bachelor of Information Technology", "Diploma in Business", "Higher Certificate"] },
  { id: "vega", name: "Vega School", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape"], programmes: ["BA Design", "BA Brand Communication", "BA Game Design", "BA Creative Brand Management", "Higher Certificate in Design"] },
  { id: "damelin", name: "Damelin", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape", "Eastern Cape"], programmes: ["Business Management", "Marketing", "Human Resource Management", "Information Technology", "Graphic Design", "Hospitality"] },
  { id: "rosebank", name: "Rosebank College", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape", "Eastern Cape"], programmes: ["Business Management", "Accounting", "Information Technology", "Education", "Social Work", "Digital Marketing"] },
  { id: "stadio", name: "Stadio", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape"], programmes: ["BCom", "BEd", "BA", "BSc Information Technology", "Diploma in Education", "Higher Certificate"] },
  { id: "mancosa", name: "MANCOSA", type: "Private Higher Education Institution", provinces: ["KwaZulu-Natal", "Gauteng", "Western Cape"], programmes: ["BCom", "Bachelor of Business Administration", "MBA", "Postgraduate Diploma", "Higher Certificate"] },
  { id: "regenesys", name: "Regenesys Business School", type: "Private Higher Education Institution", provinces: ["Gauteng"], programmes: ["Bachelor of Business Administration", "BCom", "MBA", "Postgraduate Diploma"] },
  { id: "akademia", name: "Akademia", type: "Private Higher Education Institution", provinces: ["Gauteng"], programmes: ["BCom", "BA", "BEd", "BSc Information Technology"] },
  { id: "boston", name: "Boston City Campus", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape", "Eastern Cape", "Free State"], programmes: ["BCom", "BSc Information Technology", "Diploma in Business", "Diploma in IT", "Higher Certificate"] },
  { id: "richfield", name: "Richfield Graduate Institute of Technology", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape"], programmes: ["BCom", "BSc Information Technology", "Diploma in IT", "Higher Certificate"] },
  { id: "afda", name: "AFDA", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape"], programmes: ["BA Film", "BA Performing Arts", "BA Live Performance"] },
  { id: "inscape", name: "Inscape Education Group", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape"], programmes: ["BA Design", "BA Interior Design", "BA Fashion Design", "Diploma in Design"] },
  { id: "open-window", name: "Open Window", type: "Private Higher Education Institution", provinces: ["Gauteng"], programmes: ["BA Visual Communication", "BA Film", "BA Design"] },
  { id: "city-varsity", name: "City Varsity", type: "Private Higher Education Institution", provinces: ["Gauteng", "Western Cape"], programmes: ["BA Film", "BA Animation", "BA Design", "Diploma"] },
  { id: "sae", name: "SAE Institute", type: "Private Higher Education Institution", provinces: ["Gauteng", "Western Cape"], programmes: ["BA Film", "BA Audio", "BA Animation", "Diploma"] },
  { id: "animation-school", name: "The Animation School", type: "Private Higher Education Institution", provinces: ["Gauteng", "Western Cape"], programmes: ["Diploma in Animation", "BA Animation"] },
  { id: "friends-of-design", name: "Friends of Design", type: "Private Higher Education Institution", provinces: ["Western Cape"], programmes: ["Diploma in Graphic Design", "Diploma in Web Design"] },
  { id: "prestige", name: "Prestige Academy", type: "Private Higher Education Institution", provinces: ["Gauteng", "Western Cape"], programmes: ["BCom", "Diploma in Business", "Diploma in IT"] },
  { id: "oval", name: "Oval International", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal"], programmes: ["BCom", "BSc Information Technology", "Diploma"] },
  { id: "embury", name: "Embury Institute for Higher Education", type: "Private Higher Education Institution", provinces: ["KwaZulu-Natal", "Gauteng"], programmes: ["BEd", "Diploma in Education"] },
  { id: "cornerstone", name: "Cornerstone Institute", type: "Private Higher Education Institution", provinces: ["Western Cape"], programmes: ["BA", "BCom", "BEd", "BSocSci"] },
  { id: "helderberg", name: "Helderberg College", type: "Private Higher Education Institution", provinces: ["Western Cape"], programmes: ["BA", "BCom", "BEd", "BTh"] },
  { id: "cti", name: "CTI Education Group", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape"], programmes: ["BCom", "BSc Information Technology", "Diploma"] },
  { id: "pearson", name: "Pearson Institute of Higher Education", type: "Private Higher Education Institution", provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape"], programmes: ["BCom", "BSc Information Technology", "Diploma"] },
  { id: "regent", name: "Regent Business School", type: "Private Higher Education Institution", provinces: ["KwaZulu-Natal", "Gauteng"], programmes: ["BCom", "Bachelor of Business Administration", "MBA", "Postgraduate Diploma"] },
  { id: "milpark", name: "Milpark Education", type: "Private Higher Education Institution", provinces: ["Gauteng", "Western Cape"], programmes: ["BCom", "Bachelor of Business Administration", "MBA", "Postgraduate Diploma"] },
  { id: "henley", name: "Henley Business School Africa", type: "Private Higher Education Institution", provinces: ["Gauteng"], programmes: ["MBA", "Postgraduate Diploma", "Bachelor of Business Administration"] },
  { id: "davinci", name: "DaVinci Institute", type: "Private Higher Education Institution", provinces: ["Gauteng"], programmes: ["BA Design", "Diploma in Design"] },
  { id: "greenside", name: "Greenside Design Center", type: "Private Higher Education Institution", provinces: ["Gauteng"], programmes: ["BA Design", "Diploma in Design"] },
]

export function institutionsFor(province: string, types: TertiaryType[]): TertiaryInstitution[] {
  return TERTIARY_INSTITUTIONS.filter((institution) =>
    types.includes(institution.type) &&
    (!province || institution.provinces.includes(province) || institution.provinces.length === ALL_PROVINCES.length)
  ).sort((a, b) => a.name.localeCompare(b.name))
}

export function programmesFor(institutionName: string): string[] {
  return TERTIARY_INSTITUTIONS.find((institution) => institution.name === institutionName)?.programmes ?? []
}
