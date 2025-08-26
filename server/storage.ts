import { type User, type InsertUser, type EmailSubscription, type InsertEmailSubscription, type CallRequest, type InsertCallRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createEmailSubscription(subscription: InsertEmailSubscription): Promise<EmailSubscription>;
  getEmailSubscription(email: string): Promise<EmailSubscription | undefined>;
  createCallRequest(request: InsertCallRequest): Promise<CallRequest>;
  getRecentCallRequests(): Promise<CallRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emailSubscriptions: Map<string, EmailSubscription>;
  private callRequests: Map<string, CallRequest>;

  constructor() {
    this.users = new Map();
    this.emailSubscriptions = new Map();
    this.callRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createEmailSubscription(insertSubscription: InsertEmailSubscription): Promise<EmailSubscription> {
    const id = randomUUID();
    const subscription: EmailSubscription = { 
      ...insertSubscription, 
      id,
      createdAt: new Date()
    };
    this.emailSubscriptions.set(insertSubscription.email, subscription);
    return subscription;
  }

  async getEmailSubscription(email: string): Promise<EmailSubscription | undefined> {
    return this.emailSubscriptions.get(email);
  }

  async createCallRequest(insertRequest: InsertCallRequest): Promise<CallRequest> {
    const id = randomUUID();
    const request: CallRequest = { 
      ...insertRequest, 
      id,
      createdAt: new Date()
    };
    this.callRequests.set(id, request);
    return request;
  }

  async getRecentCallRequests(): Promise<CallRequest[]> {
    return Array.from(this.callRequests.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 100); // Return last 100 requests
  }
}

export const storage = new MemStorage();
