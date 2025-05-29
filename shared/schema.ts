import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isProfilePublic: boolean("is_profile_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // likert, multiple_choice, yes_no
  options: jsonb("options"), // Array of options for multiple choice
  trait: text("trait"), // personality trait this question measures
  order: integer("order").notNull(),
});

export const userAssessments = pgTable("user_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assessmentId: integer("assessment_id").notNull(),
  status: text("status").notNull().default("in_progress"), // in_progress, completed
  currentQuestion: integer("current_question").default(1),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  userAssessmentId: integer("user_assessment_id").notNull(),
  questionId: integer("question_id").notNull(),
  answer: text("answer").notNull(),
  answeredAt: timestamp("answered_at").defaultNow(),
});

export const personalityProfiles = pgTable("personality_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assessmentId: integer("assessment_id").notNull(),
  scores: jsonb("scores").notNull(), // personality trait scores
  insights: text("insights"),
  strengths: jsonb("strengths"), // array of strengths
  growthAreas: jsonb("growth_areas"), // array of growth areas
  createdAt: timestamp("created_at").defaultNow(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(), // career, relationships, habits
  title: text("title").notNull(),
  description: text("description").notNull(),
  action: text("action"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertUserAssessmentSchema = createInsertSchema(userAssessments).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  answeredAt: true,
});

export const insertPersonalityProfileSchema = createInsertSchema(personalityProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type UserAssessment = typeof userAssessments.$inferSelect;
export type InsertUserAssessment = z.infer<typeof insertUserAssessmentSchema>;
export type Response = typeof responses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type PersonalityProfile = typeof personalityProfiles.$inferSelect;
export type InsertPersonalityProfile = z.infer<typeof insertPersonalityProfileSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
