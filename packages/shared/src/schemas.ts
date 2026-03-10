import { z } from "zod";
import { GitProvider, ConnectionAuthMethod, AuthStatus, IdentityMode } from "./enums";

// ───────────────────────────────────────
// Trooper Shared Zod Schemas
// ───────────────────────────────────────

export const ConnectionSchema = z.object({
  id: z.string().uuid().optional(),
  provider: z.nativeEnum(GitProvider),
  name: z.string().min(1, "Name is required"),
  providerAccountName: z.string().min(1, "Provider account name is required"),
  providerUrl: z.string().url("Must be a valid URL"),
  authMethod: z.nativeEnum(ConnectionAuthMethod),
  status: z.nativeEnum(AuthStatus).default(AuthStatus.Active),
  scopes: z.array(z.string()).default([]),
  hasToken: z.boolean().default(false),
  tokenPreview: z.string().optional(),
  isDefault: z.boolean().default(false),
  repositoryCount: z.number().int().nonnegative().optional(),
  linkedAccountCount: z.number().int().nonnegative().optional(),
  expiresAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type ConnectionDto = z.infer<typeof ConnectionSchema>;

export const CreateConnectionDtoSchema = z.object({
  provider: z.nativeEnum(GitProvider),
  name: z.string().min(1, "Name is required"),
  authMethod: z.nativeEnum(ConnectionAuthMethod).default(ConnectionAuthMethod.PAT),
  token: z.string().min(1, "Token is required"),
  providerAccountName: z.string().min(1).optional(),
  providerUrl: z.string().url("Must be a valid URL").optional(),
  isDefault: z.boolean().optional(),
  expiresAt: z.string().datetime().optional(),
});

export type CreateConnectionDto = z.infer<typeof CreateConnectionDtoSchema>;

export const UpdateConnectionDtoSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.nativeEnum(AuthStatus).optional(),
  scopes: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  token: z.string().min(1).optional(),
  providerAccountName: z.string().min(1).optional(),
  providerUrl: z.string().url("Must be a valid URL").optional(),
  isDefault: z.boolean().optional(),
});

export type UpdateConnectionDto = z.infer<typeof UpdateConnectionDtoSchema>;

// ───────────────────────────────────────
// Copilot Schemas
// ───────────────────────────────────────

export const CopilotQuerySchema = z.object({
  type: z.enum(['issue', 'pull']),
  repositoryFullName: z.string().min(1),
  refNumber: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string(),
  modelId: z.string().min(1).optional(),
  labels: z.array(z.string()).optional(),
  state: z.string().min(1),
  branch: z.string().optional(),
  changedFiles: z.array(z.string()).optional(),
  groundingStageLimit: z.number().int().min(1).max(6).optional(),
  includeGroundingTrace: z.boolean().optional(),
});

export type CopilotQueryDto = z.infer<typeof CopilotQuerySchema>;

export const CopilotAskSchema = CopilotQuerySchema.extend({
  question: z.string().min(1),
  priorSummary: z.string(),
});

export type CopilotAskDto = z.infer<typeof CopilotAskSchema>;
