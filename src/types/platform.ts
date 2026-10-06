export type UserRole =
  | 'Visitor'
  | 'Student'
  | 'Parent'
  | 'Working Professional'
  | 'Counsellor'
  | 'Institution Admin'
  | 'Institution Staff'
  | 'Content Manager'
  | 'Sales/CRM User'
  | 'Finance/Admin'
  | 'Super Admin';

export type CohortStage =
  | 'Class 5-6'
  | 'Class 7-8'
  | 'Class 9-10'
  | 'Class 11-12'
  | 'UG'
  | 'PG'
  | 'Working Professionals';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  city: string;
  cohort?: CohortStage;
  schoolOrOrg?: string;
  boardOrIndustry?: string;
  subjectsOrSkills?: string[];
  parentName?: string;
  childIds?: string[];
  experienceYears?: number;
  currentRole?: string;
  targetRole?: string;
  salaryBand?: string;
  unlockedReportIds: string[];
  savedCareerIds: string[];
  enrolledCourseIds: string[];
  createdAt: string;
}

export interface EcosystemNodeItem {
  id: string;
  label: string;
  summary: string;
  cohortOrTarget: string;
  deliverables: string[];
  recommendedActionLabel: string;
  targetTab: 'ecosystem' | 'assessment' | 'careers' | 'counsellors' | 'skills' | 'workspace';
  targetSubView?: string;
}

export interface EcosystemPillar {
  id: string;
  title: string;
  headerBg: string;
  accentColor: string;
  description: string;
  items: EcosystemNodeItem[];
}

export interface AssessmentQuestion {
  id: string;
  cohort: CohortStage | 'ALL';
  category:
    | 'Academic Profile'
    | 'Interests'
    | 'Aptitude'
    | 'Personality & Preferences'
    | 'Communication Confidence'
    | 'Technology Interest'
    | 'Creativity'
    | 'Entrepreneurship Interest'
    | 'Financial Awareness'
    | 'Work & Learning Preferences';
  prompt: string;
  options: {
    label: string;
    score: number;
    clusterTag: string;
    strengthTag: string;
  }[];
}

export interface DimensionScore {
  dimension: string;
  score: number; // 0-100
  interpretation: string;
}

export interface StudentCareerProfile {
  id: string;
  userId: string;
  studentName: string;
  cohort: CohortStage;
  completedAt: string;
  academicSnapshot: string;
  overallReadinessIndex: number;
  dimensionScores: DimensionScore[];
  interestAreas: string[];
  strengths: string[];
  developmentAreas: string[];
  personalityIndicators: string[];
  skillIndicators: string[];
  suggestedClusters: {
    clusterName: string;
    fitLevel: 'Suggested High Fit' | 'Potential Fit' | 'Recommended for Exploration';
    rationale: string;
    sampleCareers: string[];
  }[];
  recommendedNextSteps: string[];
  ninetyDayActionPlan: {
    phase: string;
    milestone: string;
    outcome: string;
  }[];
  parentGuidanceNote: string;
  counsellorReviewNote?: string;
  disclaimer: string;
}

export interface ReportProduct {
  id: string;
  name: string;
  tierLabel: string;
  priceInr: number;
  tagline: string;
  recommendedFor: string;
  modulesIncluded: string[];
  pageCount: number;
  includesCounsellorReview: boolean;
}

export interface CareerRecord {
  id: string;
  name: string;
  category:
    | 'Technology'
    | 'AI & Data'
    | 'Engineering'
    | 'Healthcare'
    | 'Finance & Commerce'
    | 'Management'
    | 'Law & Policy'
    | 'Design & Media'
    | 'Digital Marketing'
    | 'Education'
    | 'Government & Defence'
    | 'Entrepreneurship'
    | 'Emerging Careers'
    | 'Skilled Professions';
  description: string;
  eligibility: string;
  educationPathway: string[];
  requiredSubjects: string[];
  coreSkills: string[];
  certifications: string[];
  entranceExams: string[];
  topCourses: string[];
  topColleges: string[];
  jobRoles: string[];
  industries: string[];
  entrySalaryInr: string;
  midCareerSalaryInr: string;
  seniorSalaryInr: string;
  studyDurationYears: string;
  avgEducationCostInr: string;
  competitionLevel: 'Moderate' | 'High' | 'Very High';
  futureOutlook: string;
  aiImpact: string;
  automationRisk: 'Low (Human-Centric / Strategic)' | 'Moderate (AI-Augmented)' | 'High (Routine Tasks Automated)';
  entrepreneurshipOpportunities: string;
  freelancingOpportunities: string;
}

export interface CollegeRecord {
  id: string;
  name: string;
  location: string;
  state: string;
  coursesOffered: string[];
  streamCluster: string;
  eligibility: string;
  annualFeesInr: string;
  totalProgramCostNumeric: number;
  avgPlacementPackageInr: string;
  avgPlacementNumeric: number;
  admissionProcess: string;
  entranceExams: string[];
  cutoffInfo: string;
  duration: string;
  hostelAvailable: boolean;
  careerOutcomes: string;
}

export interface SkillCourseRecord {
  id: string;
  title: string;
  category:
    | 'English Speaking'
    | 'Soft Skills'
    | 'Personality Development'
    | 'Digital Marketing'
    | 'Coding'
    | 'AI'
    | 'Graphic Designing'
    | 'Entrepreneurship'
    | 'Financial Literacy'
    | 'Stock Market Education';
  overview: string;
  curriculum: string[];
  duration: string;
  trainerName: string;
  trainerCredentials: string;
  schedule: string;
  feesInr: number;
  batchSize: number;
  skillsGained: string[];
  outcomes: string;
  certification: string;
  targetAudience: string;
}

export interface CounsellorRecord {
  id: string;
  name: string;
  photoUrl: string;
  qualification: string;
  experienceYears: number;
  specialization: string;
  languages: string[];
  studentCategories: CohortStage[];
  careerDomains: string[];
  feeInr: number;
  mode: 'Online' | 'Offline & Online' | 'In-Person';
  city: string;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  counsellingApproach: string;
  introduction: string;
  verified: boolean;
  availableDays: string[];
  availableSlots: string[];
  sessionDurationMins: number;
  bufferMins: number;
}

export interface BookingRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentCohort: string;
  counsellorId: string;
  counsellorName: string;
  serviceTitle: string;
  date: string;
  slot: string;
  mode: 'Online Video' | 'In-Centre';
  feePaidInr: number;
  status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled';
  meetingLink: string;
  notes?: string;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  userId: string;
  userName: string;
  productType: 'Report' | 'Counselling' | 'Skill Course' | 'College Guidance';
  productId: string;
  productName: string;
  amountInr: number;
  gstInr: number;
  discountInr: number;
  totalPaidInr: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  couponApplied?: string;
  invoiceNumber: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  createdAt: string;
}

export type CrmStage =
  | 'New Lead'
  | 'Contacted'
  | 'Interested'
  | 'Assessment Started'
  | 'Assessment Completed'
  | 'Report Purchased'
  | 'Counselling Booked'
  | 'Counselling Completed'
  | 'Course Interested'
  | 'Course Admission'
  | 'Converted'
  | 'Lost';

export interface LeadRecord {
  id: string;
  name: string;
  mobile: string;
  email: string;
  userType: 'Student' | 'Parent' | 'Working Professional' | 'School/College';
  studentClassOrRole: string;
  city: string;
  serviceInterested: string;
  preferredContact: 'WhatsApp' | 'Phone Call' | 'Email';
  leadSource: string;
  leadOwner: string;
  leadScore: number;
  stage: CrmStage;
  notes: string;
  followUpDate: string;
  createdAt: string;
}

export interface InstitutionB2BRecord {
  id: string;
  institutionName: string;
  type: 'K-12 School' | 'Autonomous College' | 'University';
  city: string;
  principalOrDean: string;
  studentsEnrolled: number;
  assessmentsCompleted: number;
  counsellingSessionsHeld: number;
  activeProgram: string;
  workflowStage:
    | 'School Lead'
    | 'Principal Meeting'
    | 'Free Seminar'
    | 'Assessment'
    | 'Student Leads'
    | 'Counselling'
    | 'Skill Courses'
    | 'Annual Tie-up';
  annualContractValueInr: number;
}

export interface NotificationItem {
  id: string;
  recipientRole: UserRole | 'ALL';
  channel: 'WhatsApp' | 'Email' | 'SMS' | 'In-App';
  title: string;
  message: string;
  timestamp: string;
}

export interface PlatformDatabase {
  users: UserAccount[];
  profiles: StudentCareerProfile[];
  reportProducts: ReportProduct[];
  careers: CareerRecord[];
  colleges: CollegeRecord[];
  courses: SkillCourseRecord[];
  counsellors: CounsellorRecord[];
  bookings: BookingRecord[];
  orders: OrderRecord[];
  leads: LeadRecord[];
  institutions: InstitutionB2BRecord[];
  notifications: NotificationItem[];
}
