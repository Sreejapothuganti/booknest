import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const housings = pgTable("housings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  sqft: integer("sqft").notNull(),
  imageUrl: text("image_url").notNull(),
  isNew: boolean("is_new").default(false),
  isPopular: boolean("is_popular").default(false),
  userId: integer("user_id"),
});

export const insertHousingSchema = createInsertSchema(housings).omit({
  id: true,
});

export const amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const housingAmenities = pgTable("housing_amenities", {
  id: serial("id").primaryKey(),
  housingId: integer("housing_id").notNull(),
  amenityId: integer("amenity_id").notNull(),
});

export const savedHousings = pgTable("saved_housings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  housingId: integer("housing_id").notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type Housing = typeof housings.$inferSelect;
export type InsertHousing = z.infer<typeof insertHousingSchema>;

export type Amenity = typeof amenities.$inferSelect;
export type HousingAmenity = typeof housingAmenities.$inferSelect;
export type SavedHousing = typeof savedHousings.$inferSelect;
