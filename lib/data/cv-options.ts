// lib/data/cv-options.ts
import { COUNTRIES } from "./countries"

export const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
  "Mpumalanga", "Northern Cape", "North West", "Western Cape",
]

export const COUNTRY_OPTIONS: string[] = [...COUNTRIES]

export const EDUCATION_LEVELS = [
  { value: "school", label: "School" },
  { value: "tertiary", label: "Tertiary / college / university" },
  { value: "other", label: "Other training or short course" },
]

export const SCHOOL_QUALIFICATION_TYPES = [
  "Matric / Grade 12 (NSC)",
  "Independent Examinations Board (IEB)",
  "Cambridge International",
  "Grade 11",
  "Grade 10",
  "Grade 9",
  "Grade 8",
  "National Certificate (Vocational) Level 2",
  "National Certificate (Vocational) Level 3",
  "National Certificate (Vocational) Level 4",
  "Other school qualification",
]

export const SCHOOL_QUALIFICATIONS = [
  "National Senior Certificate (NSC)",
  "Senior Certificate (old curriculum)",
  "Independent Examinations Board (IEB) Certificate",
  "Cambridge International AS/A Level",
  "Grade 11",
  "Grade 10",
  "Grade 9",
  "Other",
]

export const TERTIARY_QUALIFICATION_TYPES = [
  "Higher Certificate",
  "National Certificate (NQF)",
  "Diploma",
  "Advanced Diploma",
  "Bachelor's degree",
  "Bachelor's degree with Honours",
  "Postgraduate Diploma",
  "Master's degree",
  "Doctoral degree",
  "Short course / certificate",
  "Other",
]

export const INTERNATIONAL_QUALIFICATION_TYPES = [
  "High school diploma",
  "Associate degree",
  "Certificate",
  "Diploma",
  "Bachelor's degree",
  "Postgraduate Diploma",
  "Master's degree",
  "Doctorate",
  "Professional qualification",
  "Short course / certificate",
  "Other",
]

export const INSTITUTION_TYPES_SA = [
  "University",
  "University of Technology",
  "TVET College",
  "Private Higher Education Institution",
  "Other",
]

export const INSTITUTION_TYPES_INTERNATIONAL = [
  "University",
  "College",
  "Business school",
  "Technical institute",
  "Online institution",
  "Other",
]

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Volunteer", "Learnership"]

export const LICENCES = ["No licence", "Learner's licence", "Code 8 / B", "Code 10 / C1", "Code 14 / EC", "Other"]

export const MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed", "Prefer not to say"]

export const LANGUAGE_LEVELS = ["Home language", "Fluent", "Good", "Basic"]

export const LANGUAGE_SUGGESTIONS = [
  "English", "Afrikaans", "isiZulu", "isiXhosa", "Sesotho", "Setswana", "Sepedi", "Xitsonga", "siSwati", "Tshivenda", "isiNdebele", "South African Sign Language",
  "French", "Portuguese", "Spanish", "German", "Dutch", "Italian", "Mandarin Chinese", "Arabic", "Swahili", "Shona", "Ndebele (Zimbabwe)", "Other",
]

export const SKILL_SUGGESTIONS = [
  "Customer service", "Communication", "Teamwork", "Time management", "Problem solving", "Computer literacy", "Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Outlook",
  "Data entry", "Typing", "Administration", "Reception", "Filing", "Bookkeeping", "Pastel", "Sage", "QuickBooks", "Point of sale",
  "Sales", "Marketing", "Social media", "Content creation", "Graphic design", "Canva", "Adobe Photoshop", "Adobe Illustrator", "Photography", "Video editing",
  "Project management", "Planning", "Organising", "Leadership", "Supervision", "Stock control", "Warehouse", "Forklift", "Driving", "Delivery",
  "Teaching", "Tutoring", "Childcare", "First aid", "Caregiving", "Nursing", "Health and safety", "Security", "Cleaning", "Hospitality",
  "Food preparation", "Barista", "Housekeeping", "Sewing", "Welding", "Electrical", "Plumbing", "Carpentry", "Mechanical", "Construction",
  "Programming", "HTML", "CSS", "JavaScript", "Python", "SQL", "Networking", "IT support", "Cybersecurity", "Other",
]

export const JOB_TITLE_SUGGESTIONS = [
  "Administrative Assistant", "Office Administrator", "Receptionist", "Data Capturer", "Clerk", "Secretary", "Personal Assistant", "Project Coordinator", "Operations Coordinator",
  "General Worker", "Cleaner", "Messenger", "Driver", "Delivery Driver", "Forklift Operator", "Warehouse Assistant", "Stock Controller", "Store Assistant", "Retail Assistant",
  "Cashier", "Sales Assistant", "Sales Representative", "Customer Service Consultant", "Call Centre Agent", "Telesales Agent", "Marketing Assistant", "Social Media Coordinator",
  "Bookkeeper", "Accounting Clerk", "Finance Assistant", "Payroll Administrator", "Bank Teller", "Insurance Consultant", "Financial Advisor",
  "Teacher", "Teaching Assistant", "Tutor", "Educator", "Principal", "Early Childhood Practitioner",
  "Nurse", "Caregiver", "Home Carer", "Health Care Assistant", "Pharmacist Assistant", "Laboratory Assistant", "Community Health Worker",
  "Chef", "Cook", "Waiter", "Waitress", "Barista", "Bartender", "Housekeeper", "Hotel Receptionist", "Tour Guide",
  "Security Officer", "Security Supervisor", "Patroller", "Traffic Officer", "Firefighter", "Police Officer",
  "Electrician", "Plumber", "Carpenter", "Welder", "Boilermaker", "Mechanic", "Panel Beater", "Builder", "Painter", "Handyman",
  "IT Support Technician", "Computer Technician", "Network Technician", "Software Developer", "Web Developer", "Data Analyst", "Graphic Designer", "Photographer", "Videographer",
  "Hair Stylist", "Beautician", "Nail Technician", "Tailor", "Seamstress", "Baker", "Butcher", "Gardener", "Farm Worker", "Other",
]

export const FIELD_OF_STUDY_SUGGESTIONS = [
  "Accounting", "Auditing", "Finance", "Economics", "Business Management", "Marketing", "Human Resource Management", "Public Administration", "Office Administration", "Supply Chain Management",
  "Law", "Political Science", "Sociology", "Psychology", "Social Work", "Education", "Early Childhood Development", "Journalism", "Communication", "Languages",
  "Computer Science", "Information Technology", "Information Systems", "Software Engineering", "Data Science", "Cybersecurity", "Networking",
  "Civil Engineering", "Electrical Engineering", "Mechanical Engineering", "Chemical Engineering", "Industrial Engineering", "Mining Engineering", "Construction Management", "Quantity Surveying", "Architecture",
  "Medicine", "Nursing", "Pharmacy", "Physiotherapy", "Occupational Therapy", "Dietetics", "Radiography", "Public Health", "Environmental Health",
  "Agriculture", "Animal Science", "Horticulture", "Food Science", "Veterinary Science", "Forestry",
  "Graphic Design", "Interior Design", "Fashion Design", "Industrial Design", "Multimedia Design", "Film and Television", "Animation", "Photography", "Music", "Performing Arts",
  "Hospitality Management", "Tourism Management", "Culinary Arts", "Sport Science", "Theology", "Other",
]

export const CERTIFICATION_SUGGESTIONS = [
  "First Aid Level 1", "First Aid Level 2", "Fire Fighting", "Health and Safety Representative", "SHEQ", "Food Safety", "HACCP",
  "Microsoft Office Specialist", "ICDL", "CompTIA A+", "CompTIA N+", "Cisco CCNA", "AWS Cloud Practitioner", "Google Digital Skills",
  "Bookkeeping Certificate", "Payroll Certificate", "Pastel Certificate", "Sage Certificate", "QuickBooks Certificate",
  "Childcare Certificate", "Home Based Care Certificate", "Nursing Auxiliary Certificate", "Pharmacist Assistant Certificate",
  "Security Grade E", "Security Grade D", "Security Grade C", "Security Grade B", "Security Grade A", "PSIRA",
  "Code 8 Driver's Licence", "Code 10 Driver's Licence", "Code 14 Driver's Licence", "Forklift Licence", "Other",
]

export const REFERENCE_RELATIONSHIPS = ["Former manager", "Former supervisor", "Colleague", "Client", "Teacher / lecturer", "Community leader", "Pastor / faith leader", "Other"]

export const INTERNATIONAL_REGION_NOTES: Record<string, string> = {
  "United States": "US employers usually expect a one-page resume with no photo, date of birth, marital status or ID number.",
  "Canada": "Canadian employers usually expect a resume with no photo, date of birth or marital status. Focus on achievements.",
  "United Kingdom": "UK CVs usually leave out photos, date of birth and marital status. Two pages is common.",
  "Australia": "Australian resumes usually leave out photos and personal details. Include work rights if relevant.",
  "New Zealand": "New Zealand CVs usually leave out photos and date of birth. A cover letter is common.",
  "Germany": "German CVs often include a professional photo and a structured chronological format. Check the employer's preference.",
  "France": "French CVs may include a photo, but it is not compulsory. Keep it to one page where possible.",
  "Netherlands": "Dutch CVs usually leave out photos and personal details. A short, direct style works well.",
  "United Arab Emirates": "UAE employers often expect a photo, nationality, visa status and notice period.",
  "Saudi Arabia": "Saudi employers often expect a photo, nationality and visa status.",
  "China": "Chinese employers often expect a photo, date of birth and personal details.",
  "Japan": "Japanese CVs use a specific format, often with a photo and date of birth.",
  "India": "Indian CVs often include a photo, date of birth and personal details. Check the employer's preference.",
  "Brazil": "Brazilian CVs may include a photo. Keep personal details limited to what the employer asks for.",
  "Nigeria": "Nigerian CVs often include a photo, date of birth and state of origin. Check the employer's preference.",
  "Kenya": "Kenyan CVs often include a photo and personal details. Check the employer's preference.",
  "Zimbabwe": "Zimbabwean CVs often include a photo and personal details. Check the employer's preference.",
  "Namibia": "Namibian CVs often include a photo and personal details. Check the employer's preference.",
  "Botswana": "Botswana CVs often include a photo and personal details. Check the employer's preference.",
  "Mozambique": "Mozambican CVs may include a photo. Portuguese-language CVs are common.",
  "Portugal": "Portuguese CVs may include a photo. Keep it concise and tailored.",
  "South Africa": "South African employers vary. Include an ID number, photo or personal details only when the employer asks for them.",
}
