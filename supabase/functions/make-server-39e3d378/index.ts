// @ts-ignore - Deno npm imports
import { Hono } from "npm:hono";
// @ts-ignore - Deno npm imports
import { cors } from "npm:hono/cors";
// @ts-ignore - Deno npm imports
import { logger } from "npm:hono/logger";
import { processWithAI } from "./ai-agent.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-39e3d378/health", (c) => {
  return c.json({ status: "ok" });
});

// AI loan advice endpoint
app.post("/make-server-39e3d378/loan-advice", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    const { income, debt, creditHistoryYears, recentInquiries } = body;
    
    if (!income || !debt || creditHistoryYears === undefined || recentInquiries === undefined) {
      return c.json({ 
        error: "Missing required fields: income, debt, creditHistoryYears, recentInquiries" 
      }, 400);
    }

    // Check if Letta integration is enabled
    const useLetta = body.useLetta === true;
    
    console.log(`Processing loan advice request with AI (Letta: ${useLetta})`);
    
    // Process with AI
    const aiResponse = await processWithAI({
      income: Number(income),
      debt: Number(debt),
      creditHistoryYears: Number(creditHistoryYears),
      recentInquiries: Number(recentInquiries),
      employmentStatus: body.employmentStatus,
      savingsRatio: body.savingsRatio ? Number(body.savingsRatio) : undefined,
    }, useLetta);

    return c.json({ 
      success: true,
      output: aiResponse,
      usedLetta: useLetta
    });
  } catch (error: any) {
    console.log(`Error in loan-advice endpoint: ${error.message}`);
    return c.json({ 
      error: error.message || "Failed to process AI request",
      details: error.toString()
    }, 500);
  }
});

// Chat endpoint for Mr. LoanLy
app.post("/make-server-39e3d378/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { message, context } = body;
    
    if (!message) {
      return c.json({ error: "Message is required" }, 400);
    }

    const useLetta = body.useLetta === true;
    
    // Create a simplified form data from context or use defaults
    const formData = {
      income: context?.income || 5000,
      debt: context?.debt || 1400,
      creditHistoryYears: context?.creditHistoryYears || 5,
      recentInquiries: context?.recentInquiries || 2,
    };

    console.log(`Processing chat message with AI (Letta: ${useLetta})`);
    
    // Process the user message with AI context
    const aiResponse = await processWithAI(formData, useLetta);

    return c.json({ 
      success: true,
      response: aiResponse,
      usedLetta: useLetta
    });
  } catch (error: any) {
    console.log(`Error in chat endpoint: ${error.message}`);
    return c.json({ 
      error: error.message || "Failed to process chat message",
      details: error.toString()
    }, 500);
  }
});

Deno.serve(app.fetch);