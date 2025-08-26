import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmailSubscriptionSchema, insertCallRequestSchema } from "@shared/schema";
import { z } from "zod";

// MCP Server configuration
const MCP_SERVER_URL = "https://superb-inspiration-production.up.railway.app";

// Helper function to create a lead in Zoho CRM via MCP
async function createZohoLead(phoneNumber: string, email?: string) {
  try {
    // Extract country code and format phone number
    // Phone numbers from the form are already in international format
    
    // For now, we'll use "User" as lastName since we don't collect names
    // You could parse this from email or ask for it in the form
    const leadData = {
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "zoho_create_lead",
        arguments: {
          firstName: "",  // Optional, leaving empty
          lastName: "Ruka Demo Request",  // Required field
          email: email || undefined,
          phone: phoneNumber,
          company: "Via Ruka Website"  // Optional, adding context
        }
      },
      id: Date.now()
    };

    const response = await fetch(`${MCP_SERVER_URL}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leadData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("MCP server error:", result);
      throw new Error(result.error?.message || "Failed to create Zoho lead");
    }

    console.log("Zoho lead created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating Zoho lead:", error);
    // Don't throw - we don't want to fail the call request if Zoho fails
    return null;
  }
}

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
      
      // Store the call request locally
      const callRequest = await storage.createCallRequest(validatedData);
      
      // Create a lead in Zoho CRM via MCP server
      // This will trigger the VAPI call automatically through the webhook
      const zohoResult = await createZohoLead(
        validatedData.phoneNumber,
        validatedData.email || undefined
      );
      
      if (zohoResult) {
        console.log("Successfully created Zoho lead and triggered VAPI call");
      } else {
        console.log("Failed to create Zoho lead, but call request was saved");
      }
      
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
