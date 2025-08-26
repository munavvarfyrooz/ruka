import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmailSubscriptionSchema, insertCallRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Email subscription endpoint
  app.post("/api/email-subscription", async (req, res) => {
    try {
      const validatedData = insertEmailSubscriptionSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscription = await storage.getEmailSubscription(validatedData.email);
      if (existingSubscription) {
        return res.status(409).json({ 
          message: "Email already subscribed",
          alreadySubscribed: true 
        });
      }
      
      const subscription = await storage.createEmailSubscription(validatedData);
      res.status(201).json({ 
        message: "Successfully subscribed to updates",
        subscription: { email: subscription.email }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: error.errors[0]?.message || "Invalid email format",
          errors: error.errors 
        });
      }
      
      console.error("Email subscription error:", error);
      res.status(500).json({ message: "Failed to subscribe. Please try again." });
    }
  });

  // Call request endpoint
  app.post("/api/call-request", async (req, res) => {
    try {
      const validatedData = insertCallRequestSchema.parse(req.body);
      
      const callRequest = await storage.createCallRequest(validatedData);
      
      // In a real application, you would trigger the AI agent to make the call here
      // For now, we'll just store the request and return a success response
      
      res.status(201).json({ 
        message: "Call request received! Our AI agent will call you shortly.",
        callRequest: {
          phoneNumber: callRequest.phoneNumber,
          email: callRequest.email
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: error.errors[0]?.message || "Invalid input",
          errors: error.errors 
        });
      }
      
      console.error("Call request error:", error);
      res.status(500).json({ message: "Failed to process call request. Please try again." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
