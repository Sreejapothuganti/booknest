import { users, housings, amenities, housingAmenities, savedHousings } from "@shared/schema";
import type { User, InsertUser, Housing, InsertHousing, Amenity, HousingAmenity, SavedHousing } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Housings
  getHousings(): Promise<Housing[]>;
  getHousing(id: number): Promise<Housing | undefined>;
  createHousing(housing: InsertHousing): Promise<Housing>;
  updateHousing(id: number, housing: Partial<InsertHousing>): Promise<Housing | undefined>;
  deleteHousing(id: number): Promise<boolean>;
  getSavedHousingsByUser(userId: number): Promise<Housing[]>;
  
  // Amenities
  getAmenities(): Promise<Amenity[]>;
  getAmenitiesByHousing(housingId: number): Promise<Amenity[]>;
  addAmenityToHousing(housingId: number, amenityId: number): Promise<void>;
  
  // Saved housings
  saveHousing(userId: number, housingId: number): Promise<SavedHousing>;
  unsaveHousing(userId: number, housingId: number): Promise<boolean>;
  isSaved(userId: number, housingId: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private housings: Map<number, Housing>;
  private amenities: Map<number, Amenity>;
  private housingAmenities: Map<number, HousingAmenity>;
  private savedHousings: Map<number, SavedHousing>;
  
  currentUserId: number;
  currentHousingId: number;
  currentAmenityId: number;
  currentHousingAmenityId: number;
  currentSavedHousingId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.housings = new Map();
    this.amenities = new Map();
    this.housingAmenities = new Map();
    this.savedHousings = new Map();
    
    this.currentUserId = 1;
    this.currentHousingId = 1;
    this.currentAmenityId = 1;
    this.currentHousingAmenityId = 1;
    this.currentSavedHousingId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Seed some amenities
    this.seedAmenities();
    // Seed some housings
    this.seedHousings();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getHousings(): Promise<Housing[]> {
    return Array.from(this.housings.values());
  }

  async getHousing(id: number): Promise<Housing | undefined> {
    return this.housings.get(id);
  }

  async createHousing(insertHousing: InsertHousing): Promise<Housing> {
    const id = this.currentHousingId++;
    const housing: Housing = { ...insertHousing, id };
    this.housings.set(id, housing);
    return housing;
  }

  async updateHousing(id: number, housing: Partial<InsertHousing>): Promise<Housing | undefined> {
    const existingHousing = this.housings.get(id);
    if (!existingHousing) return undefined;
    
    const updatedHousing = { ...existingHousing, ...housing };
    this.housings.set(id, updatedHousing);
    return updatedHousing;
  }

  async deleteHousing(id: number): Promise<boolean> {
    return this.housings.delete(id);
  }

  async getAmenities(): Promise<Amenity[]> {
    return Array.from(this.amenities.values());
  }

  async getAmenitiesByHousing(housingId: number): Promise<Amenity[]> {
    const amenityIds = Array.from(this.housingAmenities.values())
      .filter(ha => ha.housingId === housingId)
      .map(ha => ha.amenityId);
    
    return Array.from(this.amenities.values())
      .filter(amenity => amenityIds.includes(amenity.id));
  }

  async addAmenityToHousing(housingId: number, amenityId: number): Promise<void> {
    const id = this.currentHousingAmenityId++;
    const housingAmenity: HousingAmenity = { id, housingId, amenityId };
    this.housingAmenities.set(id, housingAmenity);
  }

  async saveHousing(userId: number, housingId: number): Promise<SavedHousing> {
    const id = this.currentSavedHousingId++;
    const savedHousing: SavedHousing = { id, userId, housingId };
    this.savedHousings.set(id, savedHousing);
    return savedHousing;
  }

  async unsaveHousing(userId: number, housingId: number): Promise<boolean> {
    const savedHousingId = Array.from(this.savedHousings.values())
      .find(sh => sh.userId === userId && sh.housingId === housingId)?.id;
    
    if (!savedHousingId) return false;
    return this.savedHousings.delete(savedHousingId);
  }

  async isSaved(userId: number, housingId: number): Promise<boolean> {
    return Array.from(this.savedHousings.values())
      .some(sh => sh.userId === userId && sh.housingId === housingId);
  }

  async getSavedHousingsByUser(userId: number): Promise<Housing[]> {
    const savedHousingIds = Array.from(this.savedHousings.values())
      .filter(sh => sh.userId === userId)
      .map(sh => sh.housingId);
    
    return Array.from(this.housings.values())
      .filter(housing => savedHousingIds.includes(housing.id));
  }

  private seedAmenities() {
    const amenityNames = [
      "Built-in Bookshelves", "Reading Nook", "Study Room", 
      "Library Room", "Quiet Area", "Near Library", 
      "Book Club Nearby", "Window Nook"
    ];
    
    amenityNames.forEach(name => {
      const id = this.currentAmenityId++;
      this.amenities.set(id, { id, name });
    });
  }

  private seedHousings() {
    const sampleHousings = [
      {
        title: "Cozy Reading Studio",
        location: "Capitol Hill, Seattle",
        price: 1350,
        bedrooms: 1,
        bathrooms: 1,
        sqft: 650,
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
        isNew: true,
        isPopular: false,
        userId: null
      },
      {
        title: "Literary Loft Apartment",
        location: "Ballard, Seattle",
        price: 1775,
        bedrooms: 2,
        bathrooms: 1,
        sqft: 850,
        imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
        isNew: false,
        isPopular: false,
        userId: null
      },
      {
        title: "Bookish Bungalow",
        location: "Fremont, Seattle",
        price: 2150,
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1050,
        imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        isNew: false,
        isPopular: true,
        userId: null
      }
    ];

    sampleHousings.forEach((housing, index) => {
      const id = this.currentHousingId++;
      this.housings.set(id, { ...housing, id });
      
      // Add some amenities to each housing
      if (index === 0) {
        this.addAmenityToHousing(id, 1); // Built-in Bookshelves
        this.addAmenityToHousing(id, 2); // Reading Nook
        this.addAmenityToHousing(id, 6); // Near Library
      } else if (index === 1) {
        this.addAmenityToHousing(id, 4); // Library Room
        this.addAmenityToHousing(id, 5); // Quiet Area
        this.addAmenityToHousing(id, 7); // Book Club Nearby
      } else if (index === 2) {
        this.addAmenityToHousing(id, 3); // Study Room
        this.addAmenityToHousing(id, 1); // Built-in Bookshelves
        this.addAmenityToHousing(id, 8); // Window Nook
      }
    });
  }
}

export const storage = new MemStorage();
