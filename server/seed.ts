import { db } from "./db";
import { users, assessments, questions } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Create sample user
    const [user] = await db
      .insert(users)
      .values({
        username: "john_smith",
        email: "john@example.com",
        firstName: "John",
        lastName: "Smith",
        isProfilePublic: true,
      })
      .returning()
      .onConflictDoNothing();

    console.log("Created user:", user?.username);

    // Create Big Five assessment
    const [bigFiveAssessment] = await db
      .insert(assessments)
      .values({
        name: "Big Five Personality Assessment",
        description: "Comprehensive personality assessment based on the Five-Factor Model",
        totalQuestions: 20,
        category: "personality",
        isActive: true,
      })
      .returning()
      .onConflictDoNothing();

    console.log("Created assessment:", bigFiveAssessment?.name);

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
      {
        questionText: "I enjoy trying new experiences and learning new things.",
        trait: "openness",
        order: 6,
      },
      {
        questionText: "I stick to my commitments and follow through on tasks.",
        trait: "conscientiousness",
        order: 7,
      },
      {
        questionText: "I enjoy being the center of attention in social situations.",
        trait: "extraversion",
        order: 8,
      },
      {
        questionText: "I trust others and believe people are generally good.",
        trait: "agreeableness",
        order: 9,
      },
      {
        questionText: "I remain calm under pressure and rarely get upset.",
        trait: "neuroticism",
        order: 10,
      },
      {
        questionText: "I appreciate art, music, and beautiful things.",
        trait: "openness",
        order: 11,
      },
      {
        questionText: "I organize my time effectively and meet deadlines.",
        trait: "conscientiousness",
        order: 12,
      },
      {
        questionText: "I actively seek out new social connections.",
        trait: "extraversion",
        order: 13,
      },
      {
        questionText: "I go out of my way to help others when they need it.",
        trait: "agreeableness",
        order: 14,
      },
      {
        questionText: "I handle criticism well and don't take things personally.",
        trait: "neuroticism",
        order: 15,
      },
      {
        questionText: "I enjoy philosophical discussions and abstract thinking.",
        trait: "openness",
        order: 16,
      },
      {
        questionText: "I maintain high standards for myself and my work.",
        trait: "conscientiousness",
        order: 17,
      },
      {
        questionText: "I prefer working in teams rather than alone.",
        trait: "extraversion",
        order: 18,
      },
      {
        questionText: "I avoid conflicts and prefer harmony in relationships.",
        trait: "agreeableness",
        order: 19,
      },
      {
        questionText: "I bounce back quickly from setbacks and disappointments.",
        trait: "neuroticism",
        order: 20,
      },
    ];

    if (bigFiveAssessment) {
      for (const q of sampleQuestions) {
        await db
          .insert(questions)
          .values({
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
          })
          .onConflictDoNothing();
      }
    }

    // Create Emotional Intelligence assessment
    const [eiAssessment] = await db
      .insert(assessments)
      .values({
        name: "Emotional Intelligence Assessment",
        description: "Evaluate your ability to understand and manage emotions",
        totalQuestions: 15,
        category: "emotional_intelligence",
        isActive: true,
      })
      .returning()
      .onConflictDoNothing();

    console.log("Created EI assessment:", eiAssessment?.name);

    // Create a few more sample users
    const additionalUsers = [
      {
        username: "sarah_jones",
        email: "sarah@example.com",
        firstName: "Sarah",
        lastName: "Jones",
        isProfilePublic: true,
      },
      {
        username: "mike_chen",
        email: "mike@example.com",
        firstName: "Mike",
        lastName: "Chen",
        isProfilePublic: true,
      },
      {
        username: "emma_wilson",
        email: "emma@example.com",
        firstName: "Emma",
        lastName: "Wilson",
        isProfilePublic: false,
      },
    ];

    for (const userData of additionalUsers) {
      await db
        .insert(users)
        .values(userData)
        .onConflictDoNothing();
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();