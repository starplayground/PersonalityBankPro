import {
  users, assessments, questions, userAssessments, responses, personalityProfiles, recommendations,
  type User, type InsertUser, type Assessment, type InsertAssessment,
  type Question, type InsertQuestion, type UserAssessment, type InsertUserAssessment,
  type Response, type InsertResponse, type PersonalityProfile, type InsertPersonalityProfile,
  type Recommendation, type InsertRecommendation
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getPublicUsers(): Promise<User[]>;

  // Assessments
  getAssessments(): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;

  // Questions
  getQuestionsByAssessment(assessmentId: number): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // User Assessments
  getUserAssessments(userId: number): Promise<UserAssessment[]>;
  getUserAssessment(id: number): Promise<UserAssessment | undefined>;
  createUserAssessment(userAssessment: InsertUserAssessment): Promise<UserAssessment>;
  updateUserAssessment(id: number, updates: Partial<UserAssessment>): Promise<UserAssessment | undefined>;

  // Responses
  getResponsesByUserAssessment(userAssessmentId: number): Promise<Response[]>;
  createResponse(response: InsertResponse): Promise<Response>;

  // Personality Profiles
  getPersonalityProfile(userId: number, assessmentId: number): Promise<PersonalityProfile | undefined>;
  createPersonalityProfile(profile: InsertPersonalityProfile): Promise<PersonalityProfile>;
  getLatestPersonalityProfile(userId: number): Promise<PersonalityProfile | undefined>;

  // Recommendations
  getRecommendations(userId: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  markRecommendationAsRead(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private assessments: Map<number, Assessment> = new Map();
  private questions: Map<number, Question> = new Map();
  private userAssessments: Map<number, UserAssessment> = new Map();
  private responses: Map<number, Response> = new Map();
  private personalityProfiles: Map<number, PersonalityProfile> = new Map();
  private recommendations: Map<number, Recommendation> = new Map();
  
  private currentUserId = 1;
  private currentAssessmentId = 1;
  private currentQuestionId = 1;
  private currentUserAssessmentId = 1;
  private currentResponseId = 1;
  private currentProfileId = 1;
  private currentRecommendationId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample user
    const user: User = {
      id: this.currentUserId++,
      username: "john_smith",
      email: "john@example.com",
      firstName: "John",
      lastName: "Smith",
      isProfilePublic: true,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);

    // Create Big Five assessment
    const bigFiveAssessment: Assessment = {
      id: this.currentAssessmentId++,
      name: "Big Five Personality Assessment",
      description: "Comprehensive personality assessment based on the Five-Factor Model",
      totalQuestions: 20,
      category: "personality",
      isActive: true,
    };
    this.assessments.set(bigFiveAssessment.id, bigFiveAssessment);

    // Create sample questions for Big Five
    const sampleQuestions = [
      {
        questionText: "I often come up with creative solutions to problems and enjoy exploring new ideas.",
        trait: "openness",
        order: 1,
      },
      {
        questionText: "I am always prepared and pay attention to details.",
        trait: "conscientiousness",
        order: 2,
      },
      {
        questionText: "I feel comfortable around people and enjoy social gatherings.",
        trait: "extraversion",
        order: 3,
      },
      {
        questionText: "I am sympathetic and feel others' emotions easily.",
        trait: "agreeableness",
        order: 4,
      },
      {
        questionText: "I often feel stressed and worry about things.",
        trait: "neuroticism",
        order: 5,
      },
    ];

    sampleQuestions.forEach((q) => {
      const question: Question = {
        id: this.currentQuestionId++,
        assessmentId: bigFiveAssessment.id,
        questionText: q.questionText,
        questionType: "likert",
        options: [
          "Strongly Disagree",
          "Disagree", 
          "Neither Agree nor Disagree",
          "Agree",
          "Strongly Agree"
        ],
        trait: q.trait,
        order: q.order,
      };
      this.questions.set(question.id, question);
    });

    // Create Emotional Intelligence assessment
    const eiAssessment: Assessment = {
      id: this.currentAssessmentId++,
      name: "Emotional Intelligence Assessment",
      description: "Evaluate your ability to understand and manage emotions",
      totalQuestions: 25,
      category: "emotional_intelligence",
      isActive: true,
    };
    this.assessments.set(eiAssessment.id, eiAssessment);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getPublicUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.isProfilePublic);
  }

  // Assessments
  async getAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(a => a.isActive);
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const assessment: Assessment = {
      ...insertAssessment,
      id: this.currentAssessmentId++,
    };
    this.assessments.set(assessment.id, assessment);
    return assessment;
  }

  // Questions
  async getQuestionsByAssessment(assessmentId: number): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(q => q.assessmentId === assessmentId)
      .sort((a, b) => a.order - b.order);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const question: Question = {
      ...insertQuestion,
      id: this.currentQuestionId++,
    };
    this.questions.set(question.id, question);
    return question;
  }

  // User Assessments
  async getUserAssessments(userId: number): Promise<UserAssessment[]> {
    return Array.from(this.userAssessments.values())
      .filter(ua => ua.userId === userId);
  }

  async getUserAssessment(id: number): Promise<UserAssessment | undefined> {
    return this.userAssessments.get(id);
  }

  async createUserAssessment(insertUserAssessment: InsertUserAssessment): Promise<UserAssessment> {
    const userAssessment: UserAssessment = {
      ...insertUserAssessment,
      id: this.currentUserAssessmentId++,
      startedAt: new Date(),
      completedAt: null,
    };
    this.userAssessments.set(userAssessment.id, userAssessment);
    return userAssessment;
  }

  async updateUserAssessment(id: number, updates: Partial<UserAssessment>): Promise<UserAssessment | undefined> {
    const userAssessment = this.userAssessments.get(id);
    if (!userAssessment) return undefined;
    
    const updatedUserAssessment = { ...userAssessment, ...updates };
    this.userAssessments.set(id, updatedUserAssessment);
    return updatedUserAssessment;
  }

  // Responses
  async getResponsesByUserAssessment(userAssessmentId: number): Promise<Response[]> {
    return Array.from(this.responses.values())
      .filter(r => r.userAssessmentId === userAssessmentId);
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const response: Response = {
      ...insertResponse,
      id: this.currentResponseId++,
      answeredAt: new Date(),
    };
    this.responses.set(response.id, response);
    return response;
  }

  // Personality Profiles
  async getPersonalityProfile(userId: number, assessmentId: number): Promise<PersonalityProfile | undefined> {
    return Array.from(this.personalityProfiles.values())
      .find(p => p.userId === userId && p.assessmentId === assessmentId);
  }

  async createPersonalityProfile(insertProfile: InsertPersonalityProfile): Promise<PersonalityProfile> {
    const profile: PersonalityProfile = {
      ...insertProfile,
      id: this.currentProfileId++,
      createdAt: new Date(),
    };
    this.personalityProfiles.set(profile.id, profile);
    return profile;
  }

  async getLatestPersonalityProfile(userId: number): Promise<PersonalityProfile | undefined> {
    const profiles = Array.from(this.personalityProfiles.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    return profiles[0];
  }

  // Recommendations
  async getRecommendations(userId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const recommendation: Recommendation = {
      ...insertRecommendation,
      id: this.currentRecommendationId++,
      createdAt: new Date(),
    };
    this.recommendations.set(recommendation.id, recommendation);
    return recommendation;
  }

  async markRecommendationAsRead(id: number): Promise<void> {
    const recommendation = this.recommendations.get(id);
    if (recommendation) {
      recommendation.isRead = true;
      this.recommendations.set(id, recommendation);
    }
  }
}

export const storage = new MemStorage();
