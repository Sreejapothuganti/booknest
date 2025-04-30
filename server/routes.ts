import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Get all housings
  app.get("/api/housings", async (req, res) => {
    try {
      const housings = await storage.getHousings();
      
      // Get amenities for each housing
      const housingsWithAmenities = await Promise.all(
        housings.map(async (housing) => {
          const amenities = await storage.getAmenitiesByHousing(housing.id);
          
          // Check if housing is saved by current user
          let isSaved = false;
          if (req.isAuthenticated()) {
            isSaved = await storage.isSaved(req.user!.id, housing.id);
          }
          
          return {
            ...housing,
            amenities,
            isSaved
          };
        })
      );
      
      res.json(housingsWithAmenities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch housings" });
    }
  });

  // Get a single housing by ID
  app.get("/api/housings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const housing = await storage.getHousing(id);
      
      if (!housing) {
        return res.status(404).json({ message: "Housing not found" });
      }
      
      const amenities = await storage.getAmenitiesByHousing(id);
      
      // Check if housing is saved by current user
      let isSaved = false;
      if (req.isAuthenticated()) {
        isSaved = await storage.isSaved(req.user!.id, id);
      }
      
      res.json({
        ...housing,
        amenities,
        isSaved
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch housing" });
    }
  });

  // Get all amenities
  app.get("/api/amenities", async (req, res) => {
    try {
      const amenities = await storage.getAmenities();
      res.json(amenities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch amenities" });
    }
  });

  // Save a housing
  app.post("/api/housings/:id/save", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const housingId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Check if housing exists
      const housing = await storage.getHousing(housingId);
      if (!housing) {
        return res.status(404).json({ message: "Housing not found" });
      }
      
      // Check if already saved
      const alreadySaved = await storage.isSaved(userId, housingId);
      if (alreadySaved) {
        return res.status(400).json({ message: "Housing already saved" });
      }
      
      await storage.saveHousing(userId, housingId);
      res.status(201).json({ message: "Housing saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save housing" });
    }
  });

  // Unsave a housing
  app.delete("/api/housings/:id/save", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const housingId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      const result = await storage.unsaveHousing(userId, housingId);
      if (!result) {
        return res.status(404).json({ message: "Saved housing not found" });
      }
      
      res.status(200).json({ message: "Housing removed from saved list" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unsave housing" });
    }
  });

  // Get saved housings for the current user
  app.get("/api/saved-housings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const userId = req.user!.id;
      const savedHousings = await storage.getSavedHousingsByUser(userId);
      
      // Get amenities for each housing
      const housingsWithAmenities = await Promise.all(
        savedHousings.map(async (housing) => {
          const amenities = await storage.getAmenitiesByHousing(housing.id);
          return {
            ...housing,
            amenities,
            isSaved: true
          };
        })
      );
      
      res.json(housingsWithAmenities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved housings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
