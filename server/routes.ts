import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body as ContactData;
      
      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Name, email, and message are required' 
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide a valid email address' 
        });
      }
      
      // In a real application, you would:
      // 1. Store the message in a database
      // 2. Send an email notification
      // 3. Maybe set up some spam protection
      
      // For now, we'll just simulate successful submission
      console.log('Contact form submission:', { name, email, subject, message });
      
      // Simulate a slight delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return res.status(200).json({ 
        success: true, 
        message: 'Message received successfully!' 
      });
    } catch (error) {
      console.error('Error processing contact form:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'An error occurred while processing your request' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
