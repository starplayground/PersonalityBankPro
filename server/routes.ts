import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserAssessmentSchema, insertResponseSchema } from "@shared/schema";
import { analyzePersonality, generateRecommendations, generateQuestions } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;
      
      const user = await storage.updateUser(userId, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/public", async (req, res) => {
    try {
      const users = await storage.getPublicUsers();
      res.json(users.map(user => ({ ...user, password: undefined })));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Assessment routes
  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAssessments();
      res.json(assessments);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Generate a new assessment with AI-created questions
  app.post("/api/assessments/generate", async (req, res) => {
    try {
      const { name, description, category, numQuestions = 5 } = req.body;
      if (!name || !description || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const questions = await generateQuestions(category, numQuestions);
      const assessment = await storage.createAssessment({
        name,
        description,
        totalQuestions: questions.length,
        category,
        isActive: true,
      });

      for (const [index, q] of questions.entries()) {
        await storage.createQuestion({
          assessmentId: assessment.id,
          questionText: q.questionText,
          questionType: "likert",
          options: q.options,
          trait: q.trait,
          order: index + 1,
        });
      }

      res.json({ assessmentId: assessment.id });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      res.json(assessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/assessments/:id/questions", async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const questions = await storage.getQuestionsByAssessment(assessmentId);
      res.json(questions);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User assessment routes
  app.get("/api/users/:userId/assessments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userAssessments = await storage.getUserAssessments(userId);
      
      // Get assessment details
      const assessmentsWithDetails = await Promise.all(
        userAssessments.map(async (ua) => {
          const assessment = await storage.getAssessment(ua.assessmentId);
          return { ...ua, assessment };
        })
      );

      res.json(assessmentsWithDetails);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/users/:userId/assessments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { assessmentId } = req.body;
      
      const userAssessmentData = insertUserAssessmentSchema.parse({
        userId,
        assessmentId,
        status: "in_progress",
        currentQuestion: 1
      });

      const userAssessment = await storage.createUserAssessment(userAssessmentData);
      res.json(userAssessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/user-assessments/:id", async (req, res) => {
    try {
      const userAssessmentId = parseInt(req.params.id);
      const userAssessment = await storage.getUserAssessment(userAssessmentId);
      
      if (!userAssessment) {
        return res.status(404).json({ message: "User assessment not found" });
      }

      const assessment = await storage.getAssessment(userAssessment.assessmentId);
      const questions = await storage.getQuestionsByAssessment(userAssessment.assessmentId);
      const responses = await storage.getResponsesByUserAssessment(userAssessmentId);

      res.json({
        ...userAssessment,
        assessment,
        questions,
        responses
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/user-assessments/:id", async (req, res) => {
    try {
      const userAssessmentId = parseInt(req.params.id);
      const updates = req.body;
      
      const userAssessment = await storage.updateUserAssessment(userAssessmentId, updates);
      if (!userAssessment) {
        return res.status(404).json({ message: "User assessment not found" });
      }

      res.json(userAssessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Response routes
  app.post("/api/responses", async (req, res) => {
    try {
      const responseData = insertResponseSchema.parse(req.body);
      const response = await storage.createResponse(responseData);
      
      // Update current question in user assessment
      const userAssessment = await storage.getUserAssessment(responseData.userAssessmentId);
      if (userAssessment) {
        const assessment = await storage.getAssessment(userAssessment.assessmentId);
        const newCurrentQuestion = userAssessment.currentQuestion! + 1;
        
        if (newCurrentQuestion > assessment!.totalQuestions) {
          // Assessment completed
          await storage.updateUserAssessment(responseData.userAssessmentId, {
            status: "completed",
            completedAt: new Date(),
            currentQuestion: newCurrentQuestion
          });
          
          // Generate personality profile if this is a personality assessment
          if (assessment!.category === "personality") {
            await generatePersonalityProfile(responseData.userAssessmentId);
          }
        } else {
          await storage.updateUserAssessment(responseData.userAssessmentId, {
            currentQuestion: newCurrentQuestion
          });
        }
      }

      res.json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Personality profile routes
  app.get("/api/users/:userId/personality-profile", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await storage.getLatestPersonalityProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "No personality profile found" });
      }

      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Recommendations routes
  app.get("/api/users/:userId/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recommendations = await storage.getRecommendations(userId);
      res.json(recommendations);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/recommendations/:id/read", async (req, res) => {
    try {
      const recommendationId = parseInt(req.params.id);
      await storage.markRecommendationAsRead(recommendationId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Helper function to generate personality profile
  async function generatePersonalityProfile(userAssessmentId: number) {
    try {
      const userAssessment = await storage.getUserAssessment(userAssessmentId);
      if (!userAssessment) return;

      const responses = await storage.getResponsesByUserAssessment(userAssessmentId);
      const questions = await storage.getQuestionsByAssessment(userAssessment.assessmentId);

      // Prepare data for AI analysis
      const analysisData = responses.map(response => {
        const question = questions.find(q => q.id === response.questionId);
        return {
          questionText: question?.questionText || "",
          answer: response.answer,
          trait: question?.trait || ""
        };
      });

      // Generate personality insights using OpenAI
      const insights = await analyzePersonality(analysisData);

      // Save personality profile
      await storage.createPersonalityProfile({
        userId: userAssessment.userId,
        assessmentId: userAssessment.assessmentId,
        scores: insights.scores,
        insights: insights.insights,
        strengths: insights.strengths,
        growthAreas: insights.growthAreas,
        hobbies: insights.hobbies,
        habits: insights.habits
      });

      // Generate AI recommendations
      const recommendations = await generateRecommendations(insights);
      
      // Save recommendations
      for (const rec of recommendations) {
        await storage.createRecommendation({
          userId: userAssessment.userId,
          category: rec.category,
          title: rec.title,
          description: rec.description,
          action: rec.action,
          isRead: false
        });
      }
    } catch (error) {
      console.error("Error generating personality profile:", error);
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
