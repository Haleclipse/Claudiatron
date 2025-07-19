// Replaced Tauri invoke with window.api
// import { invoke } from "@tauri-apps/api/core";
import type { HooksConfiguration } from '@/types/hooks'

// Helper function to safely access window.api
const getWindowApi = () => {
  if (!window.api) {
    throw new Error('Window API not available')
  }
  return window.api as any
}

/** Process type for tracking in ProcessRegistry */
export type ProcessType =
  | { AgentRun: { agent_id: number; agent_name: string } }
  | { ClaudeSession: { session_id: string } }

/** Information about a running process */
export interface ProcessInfo {
  run_id: number
  process_type: ProcessType
  pid: number
  started_at: string
  project_path: string
  task: string
  model: string
}

/**
 * Represents a project in the ~/.claude/projects directory
 */
export interface Project {
  /** The project ID (derived from the directory name) */
  id: string
  /** The original project path (decoded from the directory name) */
  path: string
  /** List of session IDs (JSONL file names without extension) */
  sessions: string[]
  /** Unix timestamp when the project directory was created */
  created_at: number
}

/**
 * Represents a session with its metadata
 */
export interface Session {
  /** The session ID (UUID) */
  id: string
  /** The project ID this session belongs to */
  project_id: string
  /** The project path */
  project_path: string
  /** Optional todo data associated with this session */
  todo_data?: any
  /** Unix timestamp when the session file was created */
  created_at: number
  /** First user message content (if available) */
  first_message?: string
  /** Timestamp of the first user message (if available) */
  message_timestamp?: string
}

/**
 * Represents the settings from ~/.claude/settings.json
 */
export interface ClaudeSettings {
  [key: string]: any
}

/**
 * Represents the Claude Code version status
 */
export interface ClaudeVersionStatus {
  /** Whether Claude Code is installed and working */
  is_installed: boolean
  /** The version string if available */
  version?: string
  /** The full output from the command */
  output: string
}

/**
 * Represents a CLAUDE.md file found in the project
 */
export interface ClaudeMdFile {
  /** Relative path from the project root */
  relative_path: string
  /** Absolute path to the file */
  absolute_path: string
  /** File size in bytes */
  size: number
  /** Last modified timestamp */
  modified: number
}

/**
 * Represents a file or directory entry
 */
export interface FileEntry {
  name: string
  path: string
  is_directory: boolean
  size: number
  extension?: string
}

/**
 * Represents a Claude installation found on the system
 */
export interface ClaudeInstallation {
  /** Full path to the Claude binary (or "claude-code" for sidecar) */
  path: string
  /** Version string if available */
  version?: string
  /** Source of discovery (e.g., "nvm", "system", "homebrew", "which", "bundled", "fnm") */
  source: string
  /** Type of installation */
  installation_type: 'Bundled' | 'System' | 'Custom'
  /** Resolved path if the path is a symlink */
  resolvedPath?: string
  /** Node.js version if installed via a Node version manager */
  nodeVersion?: string
}

// Agent API types
export interface Agent {
  id?: number
  name: string
  icon: string
  system_prompt: string
  default_task?: string
  model: string
  hooks?: string // JSON string of HooksConfiguration
  created_at: string
  updated_at: string
}

export interface AgentExport {
  version: number
  exported_at: string
  agent: {
    name: string
    icon: string
    system_prompt: string
    default_task?: string
    model: string
    hooks?: string
  }
}

export interface GitHubAgentFile {
  name: string
  path: string
  download_url: string
  size: number
  sha: string
}

export interface AgentRun {
  id?: number
  agent_id: number
  agent_name: string
  agent_icon: string
  task: string
  model: string
  project_path: string
  session_id: string
  status: string // 'pending', 'running', 'completed', 'failed', 'cancelled'
  pid?: number
  process_started_at?: string
  created_at: string
  completed_at?: string
}

export interface AgentRunMetrics {
  duration_ms?: number
  total_tokens?: number
  cost_usd?: number
  message_count?: number
}

export interface AgentRunWithMetrics {
  id?: number
  agent_id: number
  agent_name: string
  agent_icon: string
  task: string
  model: string
  project_path: string
  session_id: string
  status: string // 'pending', 'running', 'completed', 'failed', 'cancelled'
  pid?: number
  process_started_at?: string
  created_at: string
  completed_at?: string
  metrics?: AgentRunMetrics
  output?: string // Real-time JSONL content
}

// Usage Dashboard types
export interface UsageEntry {
  project: string
  timestamp: string
  model: string
  input_tokens: number
  output_tokens: number
  cache_write_tokens: number
  cache_read_tokens: number
  cost: number
}

export interface ModelUsage {
  model: string
  total_cost: number
  total_tokens: number
  input_tokens: number
  output_tokens: number
  cache_creation_tokens: number
  cache_read_tokens: number
  session_count: number
  request_count?: number // API 请求数
}

export interface DailyUsage {
  date: string
  total_cost: number
  total_tokens: number
  models_used: string[]
}

export interface ProjectUsage {
  project_path: string
  project_name: string
  total_cost: number
  total_tokens: number
  session_count: number
  request_count?: number // API 请求数
  last_used: string
}

export interface UsageStats {
  total_cost: number
  total_tokens: number
  total_input_tokens: number
  total_output_tokens: number
  total_cache_creation_tokens: number
  total_cache_read_tokens: number
  total_sessions: number
  total_requests: number // API 请求数（用于计算平均成本）
  by_model: ModelUsage[]
  by_date: DailyUsage[]
  by_project: ProjectUsage[]
}

/**
 * Represents a checkpoint in the session timeline
 */
export interface Checkpoint {
  id: string
  sessionId: string
  projectId: string
  messageIndex: number
  timestamp: string
  description?: string
  parentCheckpointId?: string
  metadata: CheckpointMetadata
}

/**
 * Metadata associated with a checkpoint
 */
export interface CheckpointMetadata {
  totalTokens: number
  modelUsed: string
  userPrompt: string
  fileChanges: number
  snapshotSize: number
}

/**
 * Represents a file snapshot at a checkpoint
 */
export interface FileSnapshot {
  checkpointId: string
  filePath: string
  content: string
  hash: string
  isDeleted: boolean
  permissions?: number
  size: number
}

/**
 * Represents a node in the timeline tree
 */
export interface TimelineNode {
  checkpoint: Checkpoint
  children: TimelineNode[]
  fileSnapshotIds: string[]
}

/**
 * The complete timeline for a session
 */
export interface SessionTimeline {
  sessionId: string
  rootNode?: TimelineNode
  currentCheckpointId?: string
  autoCheckpointEnabled: boolean
  checkpointStrategy: CheckpointStrategy
  totalCheckpoints: number
}

/**
 * Strategy for automatic checkpoint creation
 */
export type CheckpointStrategy = 'manual' | 'per_prompt' | 'per_tool_use' | 'smart'

/**
 * Result of a checkpoint operation
 */
export interface CheckpointResult {
  checkpoint: Checkpoint
  filesProcessed: number
  warnings: string[]
}

/**
 * Diff between two checkpoints
 */
export interface CheckpointDiff {
  fromCheckpointId: string
  toCheckpointId: string
  modifiedFiles: FileDiff[]
  addedFiles: string[]
  deletedFiles: string[]
  tokenDelta: number
}

/**
 * Diff for a single file
 */
export interface FileDiff {
  path: string
  additions: number
  deletions: number
  diffContent?: string
}

/**
 * Represents an MCP server configuration
 */
export interface MCPServer {
  /** Server name/identifier */
  name: string
  /** Transport type: "stdio" or "sse" */
  transport: string
  /** Command to execute (for stdio) */
  command?: string
  /** Command arguments (for stdio) */
  args: string[]
  /** Environment variables */
  env: Record<string, string>
  /** URL endpoint (for SSE) */
  url?: string
  /** Configuration scope: "local", "project", or "user" */
  scope: string
  /** Whether the server is currently active */
  is_active: boolean
  /** Server status */
  status: ServerStatus
}

/**
 * Server status information
 */
export interface ServerStatus {
  /** Whether the server is running */
  running: boolean
  /** Last error message if any */
  error?: string
  /** Last checked timestamp */
  last_checked?: number
}

/**
 * MCP configuration for project scope (.mcp.json)
 */
export interface MCPProjectConfig {
  mcpServers: Record<string, MCPServerConfig>
}

/**
 * Individual server configuration in .mcp.json
 */
export interface MCPServerConfig {
  command: string
  args: string[]
  env: Record<string, string>
}

/**
 * Represents a custom slash command
 */
export interface SlashCommand {
  /** Unique identifier for the command */
  id: string
  /** Command name (without prefix) */
  name: string
  /** Full command with prefix (e.g., "/project:optimize") */
  full_command: string
  /** Command scope: "project" or "user" */
  scope: string
  /** Optional namespace (e.g., "frontend" in "/project:frontend:component") */
  namespace?: string
  /** Path to the markdown file */
  file_path: string
  /** Command content (markdown body) */
  content: string
  /** Optional description from frontmatter */
  description?: string
  /** Allowed tools from frontmatter */
  allowed_tools?: string[]
  /** Whether the command has bash commands (!) */
  has_bash_commands?: boolean
  /** Whether the command has file references (@) */
  has_file_references?: boolean
  /** Whether the command uses $ARGUMENTS placeholder */
  accepts_arguments?: boolean
}

/**
 * Result of adding a server
 */
export interface AddServerResult {
  success: boolean
  message: string
  server_name?: string
}

/**
 * Import result for multiple servers
 */
export interface ImportResult {
  imported_count: number
  failed_count: number
  servers: ImportServerResult[]
}

/**
 * Result for individual server import
 */
export interface ImportServerResult {
  name: string
  success: boolean
  error?: string
}

/**
 * API client for interacting with the Rust backend
 */
export const api = {
  /**
   * Lists all projects in the ~/.claude/projects directory
   * @returns Promise resolving to an array of projects
   */
  async listProjects(): Promise<Project[]> {
    try {
      const api = getWindowApi()
      return await api.listProjects()
    } catch (error) {
      console.error('Failed to list projects:', error)
      throw error
    }
  },

  /**
   * Retrieves sessions for a specific project
   * @param projectId - The ID of the project to retrieve sessions for
   * @returns Promise resolving to an array of sessions
   */
  async getProjectSessions(projectId: string): Promise<Session[]> {
    try {
      const api = getWindowApi()
      return await api.getProjectSessions(projectId)
    } catch (error) {
      console.error('Failed to get project sessions:', error)
      throw error
    }
  },

  /**
   * Fetch list of agents from GitHub repository
   * @returns Promise resolving to list of available agents on GitHub
   */
  async fetchGitHubAgents(): Promise<GitHubAgentFile[]> {
    try {
      // TODO: Add fetchGitHubAgents to preload API
      throw new Error('fetchGitHubAgents not implemented in Electron version yet')
    } catch (error) {
      console.error('Failed to fetch GitHub agents:', error)
      throw error
    }
  },

  /**
   * Fetch and preview a specific agent from GitHub
   * @param downloadUrl - The download URL for the agent file
   * @returns Promise resolving to the agent export data
   */
  async fetchGitHubAgentContent(_downloadUrl: string): Promise<AgentExport> {
    try {
      // TODO: Add fetchGitHubAgentContent to preload API
      throw new Error('fetchGitHubAgentContent not implemented in Electron version yet')
    } catch (error) {
      console.error('Failed to fetch GitHub agent content:', error)
      throw error
    }
  },

  /**
   * Import an agent directly from GitHub
   * @param downloadUrl - The download URL for the agent file
   * @returns Promise resolving to the imported agent
   */
  async importAgentFromGitHub(_downloadUrl: string): Promise<Agent> {
    try {
      // TODO: Add importAgentFromGitHub to preload API
      throw new Error('importAgentFromGitHub not implemented in Electron version yet')
    } catch (error) {
      console.error('Failed to import agent from GitHub:', error)
      throw error
    }
  },

  /**
   * Reads the Claude settings file
   * @returns Promise resolving to the settings object
   */
  async getClaudeSettings(): Promise<ClaudeSettings> {
    try {
      const api = getWindowApi()
      return await api.getClaudeSettings()
    } catch (error) {
      console.error('Failed to get Claude settings:', error)
      throw error
    }
  },

  /**
   * Opens a new Claude Code session
   * @param path - Optional path to open the session in
   * @returns Promise resolving when the session is opened
   */
  async openNewSession(_path?: string): Promise<string> {
    try {
      // TODO: Add openNewSession to preload API
      throw new Error('openNewSession not implemented in Electron version yet')
    } catch (error) {
      console.error('Failed to open new session:', error)
      throw error
    }
  },

  /**
   * Reads the CLAUDE.md system prompt file
   * @returns Promise resolving to the system prompt content
   */
  async getSystemPrompt(): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.getSystemPrompt()
    } catch (error) {
      console.error('Failed to get system prompt:', error)
      throw error
    }
  },

  /**
   * Checks if Claude Code is installed and gets its version
   * @returns Promise resolving to the version status
   */
  async checkClaudeVersion(): Promise<ClaudeVersionStatus> {
    try {
      const api = getWindowApi()
      return await api.checkClaudeVersion()
    } catch (error) {
      console.error('Failed to check Claude version:', error)
      throw error
    }
  },

  /**
   * Saves the CLAUDE.md system prompt file
   * @param content - The new content for the system prompt
   * @returns Promise resolving when the file is saved
   */
  async saveSystemPrompt(content: string): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.saveSystemPrompt(content)
    } catch (error) {
      console.error('Failed to save system prompt:', error)
      throw error
    }
  },

  /**
   * Saves the Claude settings file
   * @param settings - The settings object to save
   * @returns Promise resolving when the settings are saved
   */
  async saveClaudeSettings(settings: ClaudeSettings): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.saveClaudeSettings(settings)
    } catch (error) {
      console.error('Failed to save Claude settings:', error)
      throw error
    }
  },

  /**
   * Finds all CLAUDE.md files in a project directory
   * @param projectPath - The absolute path to the project
   * @returns Promise resolving to an array of CLAUDE.md files
   */
  async findClaudeMdFiles(projectPath: string): Promise<ClaudeMdFile[]> {
    try {
      const api = getWindowApi()
      return await api.findClaudeMdFiles(projectPath)
    } catch (error) {
      console.error('Failed to find CLAUDE.md files:', error)
      throw error
    }
  },

  /**
   * Reads a specific CLAUDE.md file
   * @param filePath - The absolute path to the file
   * @returns Promise resolving to the file content
   */
  async readClaudeMdFile(filePath: string): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.readClaudeMdFile(filePath)
    } catch (error) {
      console.error('Failed to read CLAUDE.md file:', error)
      throw error
    }
  },

  /**
   * Saves a specific CLAUDE.md file
   * @param filePath - The absolute path to the file
   * @param content - The new content for the file
   * @returns Promise resolving when the file is saved
   */
  async saveClaudeMdFile(filePath: string, content: string): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.saveClaudeMdFile(filePath, content)
    } catch (error) {
      console.error('Failed to save CLAUDE.md file:', error)
      throw error
    }
  },

  // Agent API methods

  /**
   * Lists all CC agents
   * @returns Promise resolving to an array of agents
   */
  async listAgents(): Promise<Agent[]> {
    try {
      const api = getWindowApi()
      return await api.listAgents()
    } catch (error) {
      console.error('Failed to list agents:', error)
      throw error
    }
  },

  /**
   * Creates a new agent
   * @param name - The agent name
   * @param icon - The icon identifier
   * @param system_prompt - The system prompt for the agent
   * @param default_task - Optional default task
   * @param model - Optional model (defaults to 'sonnet')
   * @param hooks - Optional hooks configuration as JSON string
   * @returns Promise resolving to the created agent
   */
  async createAgent(
    name: string,
    icon: string,
    system_prompt: string,
    default_task?: string,
    model?: string,
    hooks?: string
  ): Promise<Agent> {
    try {
      const api = getWindowApi()
      return await api.createAgent({
        name,
        icon,
        systemPrompt: system_prompt,
        defaultTask: default_task,
        model,
        hooks
      })
    } catch (error) {
      console.error('Failed to create agent:', error)
      throw error
    }
  },

  /**
   * Updates an existing agent
   * @param id - The agent ID
   * @param name - The updated name
   * @param icon - The updated icon
   * @param system_prompt - The updated system prompt
   * @param default_task - Optional default task
   * @param model - Optional model
   * @param hooks - Optional hooks configuration as JSON string
   * @returns Promise resolving to the updated agent
   */
  async updateAgent(
    id: number,
    name: string,
    icon: string,
    system_prompt: string,
    default_task?: string,
    model?: string,
    hooks?: string
  ): Promise<Agent> {
    try {
      const api = getWindowApi()
      return await api.updateAgent(id, {
        name,
        icon,
        systemPrompt: system_prompt,
        defaultTask: default_task,
        model,
        hooks
      })
    } catch (error) {
      console.error('Failed to update agent:', error)
      throw error
    }
  },

  /**
   * Deletes an agent
   * @param id - The agent ID to delete
   * @returns Promise resolving when the agent is deleted
   */
  async deleteAgent(id: number): Promise<void> {
    try {
      const api = getWindowApi()
      return await api.deleteAgent(id)
    } catch (error) {
      console.error('Failed to delete agent:', error)
      throw error
    }
  },

  /**
   * Gets a single agent by ID
   * @param id - The agent ID
   * @returns Promise resolving to the agent
   */
  async getAgent(id: number): Promise<Agent> {
    try {
      const api = getWindowApi()
      return await api.getAgent(id)
    } catch (error) {
      console.error('Failed to get agent:', error)
      throw error
    }
  },

  /**
   * Exports a single agent to JSON format
   * @param id - The agent ID to export
   * @returns Promise resolving to the JSON string
   */
  async exportAgent(id: number): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.exportAgent(id)
    } catch (error) {
      console.error('Failed to export agent:', error)
      throw error
    }
  },

  /**
   * Imports an agent from JSON data
   * @param jsonData - The JSON string containing the agent export
   * @returns Promise resolving to the imported agent
   */
  async importAgent(jsonData: string): Promise<Agent> {
    try {
      const api = getWindowApi()
      return await api.importAgent(jsonData)
    } catch (error) {
      console.error('Failed to import agent:', error)
      throw error
    }
  },

  /**
   * Imports an agent from a file
   * @param filePath - The path to the JSON file
   * @returns Promise resolving to the imported agent
   */
  async importAgentFromFile(filePath: string): Promise<Agent> {
    try {
      const api = getWindowApi()
      return await api.importAgentFromFile(filePath)
    } catch (error) {
      console.error('Failed to import agent from file:', error)
      throw error
    }
  },

  /**
   * Executes an agent
   * @param agentId - The agent ID to execute
   * @param projectPath - The project path to run the agent in
   * @param task - The task description
   * @param model - Optional model override
   * @returns Promise resolving to the run ID when execution starts
   */
  async executeAgent(
    agentId: number,
    projectPath: string,
    task: string,
    model?: string
  ): Promise<number> {
    try {
      const api = getWindowApi()
      const result = await api.executeAgent({ agentId, projectPath, task, model })

      // 适配后端返回的对象格式到前端期望的 number 类型
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success && result.runId !== undefined) {
          return result.runId
        } else {
          throw new Error(result.message || 'Failed to execute agent')
        }
      }

      // 如果返回的是 number 类型（向后兼容）
      if (typeof result === 'number') {
        return result
      }

      throw new Error('Unexpected response format from executeAgent')
    } catch (error) {
      console.error('Failed to execute agent:', error)
      throw new Error(
        `Failed to execute agent: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Lists agent runs with metrics
   * @param agentId - Optional agent ID to filter runs
   * @returns Promise resolving to an array of agent runs with metrics
   */
  async listAgentRuns(agentId?: number): Promise<AgentRunWithMetrics[]> {
    try {
      const api = getWindowApi()
      return await api.listAgentRuns(agentId)
    } catch (error) {
      console.error('Failed to list agent runs:', error)
      // Return empty array instead of throwing to prevent UI crashes
      return []
    }
  },

  /**
   * Gets a single agent run by ID with metrics
   * @param id - The run ID
   * @returns Promise resolving to the agent run with metrics
   */
  async getAgentRun(id: number): Promise<AgentRunWithMetrics> {
    try {
      const api = getWindowApi()
      return await api.getAgentRun(id)
    } catch (error) {
      console.error('Failed to get agent run:', error)
      throw new Error(
        `Failed to get agent run: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Gets a single agent run by ID with real-time metrics from JSONL
   * @param id - The run ID
   * @returns Promise resolving to the agent run with metrics
   */
  async getAgentRunWithRealTimeMetrics(id: number): Promise<AgentRunWithMetrics> {
    try {
      const api = getWindowApi()
      return await api.getAgentRunWithMetrics(id)
    } catch (error) {
      console.error('Failed to get agent run with real-time metrics:', error)
      throw new Error(
        `Failed to get agent run with real-time metrics: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Lists all currently running agent sessions
   * @returns Promise resolving to list of running agent sessions
   */
  async listRunningAgentSessions(): Promise<AgentRun[]> {
    try {
      const api = getWindowApi()
      return await api.listRunningSessionsAgents()
    } catch (error) {
      console.error('Failed to list running agent sessions:', error)
      throw new Error(
        `Failed to list running agent sessions: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Kills a running agent session
   * @param runId - The run ID to kill
   * @returns Promise resolving to whether the session was successfully killed
   */
  async killAgentSession(runId: number): Promise<boolean> {
    try {
      const api = getWindowApi()
      const result = await api.killAgentSession(runId)

      // 适配后端返回的对象格式到前端期望的 boolean 类型
      if (result && typeof result === 'object' && 'success' in result) {
        return result.success
      }

      // 如果返回的是 boolean 类型（向后兼容）
      if (typeof result === 'boolean') {
        return result
      }

      // 默认返回 false
      return false
    } catch (error) {
      console.error('Failed to kill agent session:', error)
      return false
    }
  },

  /**
   * Gets the status of a specific agent session
   * @param runId - The run ID to check
   * @returns Promise resolving to the session status or null if not found
   */
  async getSessionStatus(runId: number): Promise<string | null> {
    try {
      const api = getWindowApi()
      return await api.getSessionStatus(runId)
    } catch (error) {
      console.error('Failed to get session status:', error)
      throw new Error(
        `Failed to get session status: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Cleanup finished processes and update their status
   * @returns Promise resolving to list of run IDs that were cleaned up
   */
  async cleanupFinishedProcesses(): Promise<number[]> {
    try {
      const api = getWindowApi()
      return await api.cleanupFinishedProcesses()
    } catch (error) {
      console.error('Failed to cleanup finished processes:', error)
      throw new Error(
        `Failed to cleanup finished processes: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Get real-time output for a running session (with live output fallback)
   * @param runId - The run ID to get output for
   * @returns Promise resolving to the current session output (JSONL format)
   */
  async getSessionOutput(runId: number): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.getSessionOutput(runId)
    } catch (error) {
      console.error('Failed to get session output:', error)
      throw new Error(
        `Failed to get session output: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Get live output directly from process stdout buffer
   * @param runId - The run ID to get live output for
   * @returns Promise resolving to the current live output
   */
  async getLiveSessionOutput(runId: number): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.getLiveSessionOutput(runId)
    } catch (error) {
      console.error('Failed to get live session output:', error)
      throw new Error(
        `Failed to get live session output: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Start streaming real-time output for a running session
   * @param runId - The run ID to stream output for
   * @returns Promise that resolves when streaming starts
   */
  async streamSessionOutput(runId: number): Promise<void> {
    try {
      const api = getWindowApi()
      return await api.streamSessionOutput(runId)
    } catch (error) {
      console.error('Failed to start streaming session output:', error)
      throw new Error(
        `Failed to start streaming session output: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Loads the JSONL history for a specific session
   */
  async loadSessionHistory(sessionId: string, projectId: string): Promise<any[]> {
    const api = getWindowApi()
    return api.loadSessionHistory(sessionId, projectId)
  },

  /**
   * Loads the JSONL history for a specific agent session
   * Similar to loadSessionHistory but searches across all project directories
   * @param sessionId - The session ID (UUID)
   * @returns Promise resolving to array of session messages
   */
  async loadAgentSessionHistory(sessionId: string): Promise<any[]> {
    try {
      const api = getWindowApi()
      return await api.loadAgentSessionHistory(sessionId)
    } catch (error) {
      console.error('Failed to load agent session history:', error)
      throw error
    }
  },

  /**
   * Executes a new interactive Claude Code session with streaming output
   */
  async executeClaudeCode(
    projectPath: string,
    prompt: string,
    model: string
  ): Promise<{ success: boolean; runId?: number; message: string }> {
    const api = getWindowApi()
    return api.executeClaudeCode(projectPath, prompt, model)
  },

  /**
   * Continues an existing Claude Code conversation with streaming output
   */
  async continueClaudeCode(projectPath: string, prompt: string, model: string): Promise<void> {
    const api = getWindowApi()
    return api.continueClaudeCode(projectPath, prompt, model)
  },

  /**
   * Resumes an existing Claude Code session by ID with streaming output
   */
  async resumeClaudeCode(
    projectPath: string,
    sessionId: string,
    prompt: string,
    model: string
  ): Promise<{ success: boolean; runId?: number; message: string }> {
    const api = getWindowApi()
    return api.resumeClaudeCode(projectPath, sessionId, prompt, model)
  },

  /**
   * Cancels the currently running Claude Code execution
   * @param sessionId - Optional session ID to cancel a specific session
   */
  async cancelClaudeExecution(sessionId?: string): Promise<void> {
    const api = getWindowApi()
    return api.cancelClaudeExecution(sessionId)
  },

  /**
   * Updates the session ID for a running process
   * @param runId - The run ID of the process
   * @param sessionId - The session ID to set
   */
  async updateSessionId(runId: number, sessionId: string): Promise<{ success: boolean }> {
    const api = getWindowApi()
    return api.updateSessionId(runId, sessionId)
  },

  /**
   * Lists all currently running Claude sessions
   * @returns Promise resolving to list of running Claude sessions
   */
  async listRunningClaudeSessions(): Promise<any[]> {
    const api = getWindowApi()
    return api.listRunningClaudeSessions()
  },

  /**
   * Gets live output from a Claude session
   * @param sessionId - The session ID to get output for
   * @returns Promise resolving to the current live output
   */
  async getClaudeSessionOutput(sessionId: string): Promise<string> {
    const api = getWindowApi()
    return api.getClaudeSessionOutput(sessionId)
  },

  /**
   * Lists files and directories in a given path
   */
  async listDirectoryContents(directoryPath: string): Promise<FileEntry[]> {
    const api = getWindowApi()
    return api.listDirectoryContents(directoryPath)
  },

  /**
   * Searches for files and directories matching a pattern
   */
  async searchFiles(basePath: string, query: string): Promise<FileEntry[]> {
    const api = getWindowApi()
    return api.searchFiles(basePath, query)
  },

  /**
   * Gets overall usage statistics
   * @returns Promise resolving to usage statistics
   */
  async getUsageStats(params?: {
    startDate?: string
    endDate?: string
    projectPath?: string
  }): Promise<UsageStats> {
    try {
      const api = getWindowApi()
      return await api.getUsageStats(params)
    } catch (error) {
      console.error('Failed to get usage stats:', error)
      throw error
    }
  },

  /**
   * Gets usage statistics filtered by date range
   * @param startDate - Start date (ISO format)
   * @param endDate - End date (ISO format)
   * @returns Promise resolving to usage statistics
   */
  async getUsageByDateRange(startDate: string, endDate: string): Promise<UsageStats> {
    try {
      const api = getWindowApi()
      return await api.getUsageByDateRange(startDate, endDate)
    } catch (error) {
      console.error('Failed to get usage by date range:', error)
      throw error
    }
  },

  /**
   * Gets usage statistics grouped by session
   * @param since - Optional start date (YYYYMMDD)
   * @param until - Optional end date (YYYYMMDD)
   * @param order - Optional sort order ('asc' or 'desc')
   * @returns Promise resolving to an array of session usage data
   */
  async getSessionStats(
    since?: string,
    until?: string,
    order?: 'asc' | 'desc'
  ): Promise<ProjectUsage[]> {
    try {
      const api = getWindowApi()
      return await api.getSessionStats(since, until, order)
    } catch (error) {
      console.error('Failed to get session stats:', error)
      throw error
    }
  },

  /**
   * Gets detailed usage entries with optional filtering
   * @param limit - Optional limit for number of entries
   * @returns Promise resolving to array of usage entries
   */
  async getUsageDetails(limit?: number): Promise<UsageEntry[]> {
    try {
      const api = getWindowApi()
      return await api.getUsageDetails(limit)
    } catch (error) {
      console.error('Failed to get usage details:', error)
      throw error
    }
  },

  /**
   * Creates a checkpoint for the current session state
   */
  async createCheckpoint(
    sessionId: string,
    projectId: string,
    projectPath: string,
    messageIndex?: number,
    description?: string
  ): Promise<CheckpointResult> {
    // TODO: Implement checkpoint creation in Electron main process
    const api = getWindowApi()
    return api.createCheckpoint(sessionId, projectId, projectPath, messageIndex, description)
  },

  /**
   * Restores a session to a specific checkpoint
   */
  async restoreCheckpoint(
    checkpointId: string,
    sessionId: string,
    projectId: string,
    projectPath: string
  ): Promise<CheckpointResult> {
    // TODO: Implement checkpoint restoration in Electron main process
    const api = getWindowApi()
    return api.restoreCheckpoint(checkpointId, sessionId, projectId, projectPath)
  },

  /**
   * Lists all checkpoints for a session
   */
  async listCheckpoints(
    sessionId: string,
    projectId: string,
    projectPath: string
  ): Promise<Checkpoint[]> {
    // TODO: Implement checkpoint listing in Electron main process
    const api = getWindowApi()
    return api.listCheckpoints(sessionId, projectId, projectPath)
  },

  /**
   * Forks a new timeline branch from a checkpoint
   */
  async forkFromCheckpoint(
    checkpointId: string,
    sessionId: string,
    projectId: string,
    projectPath: string,
    newSessionId: string,
    description?: string
  ): Promise<CheckpointResult> {
    // TODO: Implement checkpoint forking in Electron main process
    const api = getWindowApi()
    return api.forkFromCheckpoint(
      checkpointId,
      sessionId,
      projectId,
      projectPath,
      newSessionId,
      description
    )
  },

  /**
   * Gets the timeline for a session
   */
  async getSessionTimeline(
    sessionId: string,
    projectId: string,
    projectPath: string
  ): Promise<SessionTimeline> {
    // TODO: Implement session timeline in Electron main process
    const api = getWindowApi()
    return api.getSessionTimeline(sessionId, projectId, projectPath)
  },

  /**
   * Updates checkpoint settings for a session
   */
  async updateCheckpointSettings(
    sessionId: string,
    projectId: string,
    projectPath: string,
    autoCheckpointEnabled: boolean,
    checkpointStrategy: CheckpointStrategy
  ): Promise<void> {
    // TODO: Implement checkpoint settings update in Electron main process
    const api = getWindowApi()
    return api.updateCheckpointSettings(
      sessionId,
      projectId,
      projectPath,
      autoCheckpointEnabled,
      checkpointStrategy
    )
  },

  /**
   * Gets diff between two checkpoints
   */
  async getCheckpointDiff(
    fromCheckpointId: string,
    toCheckpointId: string,
    sessionId: string,
    projectId: string
  ): Promise<CheckpointDiff> {
    try {
      // TODO: Implement checkpoint diff in Electron main process
      const api = getWindowApi()
      return await api.getCheckpointDiff(fromCheckpointId, toCheckpointId, sessionId, projectId)
    } catch (error) {
      console.error('Failed to get checkpoint diff:', error)
      throw error
    }
  },

  /**
   * Tracks a message for checkpointing
   */
  async trackCheckpointMessage(
    sessionId: string,
    projectId: string,
    projectPath: string,
    message: string
  ): Promise<void> {
    try {
      // TODO: Implement checkpoint message tracking in Electron main process
      const api = getWindowApi()
      await api.trackCheckpointMessage(sessionId, projectId, projectPath, message)
    } catch (error) {
      console.error('Failed to track checkpoint message:', error)
      throw error
    }
  },

  /**
   * Checks if auto-checkpoint should be triggered
   */
  async checkAutoCheckpoint(
    sessionId: string,
    projectId: string,
    projectPath: string,
    message: string
  ): Promise<boolean> {
    try {
      // TODO: Implement auto checkpoint check in Electron main process
      const api = getWindowApi()
      return await api.checkAutoCheckpoint(sessionId, projectId, projectPath, message)
    } catch (error) {
      console.error('Failed to check auto checkpoint:', error)
      throw error
    }
  },

  /**
   * Triggers cleanup of old checkpoints
   */
  async cleanupOldCheckpoints(
    sessionId: string,
    projectId: string,
    projectPath: string,
    keepCount: number
  ): Promise<number> {
    try {
      // TODO: Implement checkpoint cleanup in Electron main process
      const api = getWindowApi()
      return await api.cleanupOldCheckpoints(sessionId, projectId, projectPath, keepCount)
    } catch (error) {
      console.error('Failed to cleanup old checkpoints:', error)
      throw error
    }
  },

  /**
   * Gets checkpoint settings for a session
   */
  async getCheckpointSettings(
    sessionId: string,
    projectId: string,
    projectPath: string
  ): Promise<{
    auto_checkpoint_enabled: boolean
    checkpoint_strategy: CheckpointStrategy
    total_checkpoints: number
    current_checkpoint_id?: string
  }> {
    try {
      // TODO: Implement checkpoint settings in Electron main process
      const api = getWindowApi()
      return await api.getCheckpointSettings(sessionId, projectId, projectPath)
    } catch (error) {
      console.error('Failed to get checkpoint settings:', error)
      throw error
    }
  },

  /**
   * Clears checkpoint manager for a session (cleanup on session end)
   */
  async clearCheckpointManager(sessionId: string): Promise<void> {
    try {
      const api = getWindowApi()
      await api.clearCheckpointManager(sessionId)
    } catch (error) {
      console.error('Failed to clear checkpoint manager:', error)
      throw error
    }
  },

  /**
   * Tracks a batch of messages for a session for checkpointing
   */
  trackSessionMessages: (
    sessionId: string,
    projectId: string,
    projectPath: string,
    messages: string[]
  ): Promise<void> =>
    (() => {
      // TODO: Implement session message tracking in Electron main process
      const api = getWindowApi()
      return api.trackSessionMessages(sessionId, projectId, projectPath, messages)
    })(),

  /**
   * Adds a new MCP server
   */
  async mcpAdd(
    name: string,
    transport: string,
    command?: string,
    args: string[] = [],
    env: Record<string, string> = {},
    url?: string,
    scope: string = 'local'
  ): Promise<AddServerResult> {
    try {
      const api = getWindowApi()
      return await api.mcpAdd(name, transport, command, args, env, url, scope)
    } catch (error) {
      console.error('Failed to add MCP server:', error)
      throw error
    }
  },

  /**
   * Lists all configured MCP servers
   */
  async mcpList(): Promise<MCPServer[]> {
    try {
      console.log('API: Calling mcp_list...')
      const api = getWindowApi()
      const result = await api.mcpList()
      console.log('API: mcp_list returned:', result)

      // Handle both direct array and wrapped response formats
      if (Array.isArray(result)) {
        return result
      } else if (
        result &&
        typeof result === 'object' &&
        'data' in result &&
        Array.isArray(result.data)
      ) {
        return result.data
      } else {
        console.warn('API: Unexpected mcp_list response format:', result)
        return []
      }
    } catch (error) {
      console.error('API: Failed to list MCP servers:', error)
      throw error
    }
  },

  /**
   * Gets details for a specific MCP server
   */
  async mcpGet(name: string): Promise<MCPServer> {
    try {
      const api = getWindowApi()
      return await api.mcpGet(name)
    } catch (error) {
      console.error('Failed to get MCP server:', error)
      throw error
    }
  },

  /**
   * Removes an MCP server
   */
  async mcpRemove(name: string): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.mcpRemove(name)
    } catch (error) {
      console.error('Failed to remove MCP server:', error)
      throw error
    }
  },

  /**
   * Adds an MCP server from JSON configuration
   */
  async mcpAddJson(
    name: string,
    jsonConfig: string,
    scope: string = 'local'
  ): Promise<AddServerResult> {
    try {
      const api = getWindowApi()
      return await api.mcpAddJson(name, jsonConfig, scope)
    } catch (error) {
      console.error('Failed to add MCP server from JSON:', error)
      throw error
    }
  },

  /**
   * Imports MCP servers from Claude Desktop
   */
  async mcpImportFromClaudeDesktop(
    scope: string = 'local',
    selectedServers?: string[]
  ): Promise<ImportResult> {
    try {
      const api = getWindowApi()
      return await api.mcpImportFromClaudeDesktop(scope, selectedServers)
    } catch (error) {
      console.error('Failed to import from Claude Desktop:', error)
      throw error
    }
  },

  /**
   * Starts Claude Code as an MCP server
   */
  async mcpServe(): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.mcpServe()
    } catch (error) {
      console.error('Failed to start MCP server:', error)
      throw error
    }
  },

  /**
   * Tests connection to an MCP server
   */
  async mcpTestConnection(name: string): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.mcpTestConnection(name)
    } catch (error) {
      console.error('Failed to test MCP connection:', error)
      throw error
    }
  },

  /**
   * Resets project-scoped server approval choices
   */
  async mcpResetProjectChoices(): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.mcpResetProjectChoices()
    } catch (error) {
      console.error('Failed to reset project choices:', error)
      throw error
    }
  },

  /**
   * Gets the status of MCP servers
   */
  async mcpGetServerStatus(): Promise<Record<string, ServerStatus>> {
    try {
      const api = getWindowApi()
      return await api.mcpGetServerStatus()
    } catch (error) {
      console.error('Failed to get server status:', error)
      throw error
    }
  },

  /**
   * Reads .mcp.json from the current project
   */
  async mcpReadProjectConfig(projectPath: string): Promise<MCPProjectConfig> {
    try {
      const api = getWindowApi()
      return await api.mcpReadProjectConfig(projectPath)
    } catch (error) {
      console.error('Failed to read project MCP config:', error)
      throw error
    }
  },

  /**
   * Saves .mcp.json to the current project
   */
  async mcpSaveProjectConfig(projectPath: string, config: MCPProjectConfig): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.mcpSaveProjectConfig(projectPath, config)
    } catch (error) {
      console.error('Failed to save project MCP config:', error)
      throw error
    }
  },

  /**
   * Get the stored Claude binary path from settings
   * @returns Promise resolving to the path if set, null otherwise
   */
  async getClaudeBinaryPath(): Promise<string | null> {
    try {
      const api = getWindowApi()
      return await api.getClaudeBinaryPath()
    } catch (error) {
      console.error('Failed to get Claude binary path:', error)
      throw error
    }
  },

  /**
   * Set the Claude binary path in settings
   * @param path - The absolute path to the Claude binary
   * @returns Promise resolving when the path is saved
   */
  async setClaudeBinaryPath(path: string): Promise<void> {
    try {
      const api = getWindowApi()
      return await api.setClaudeBinaryPath(path)
    } catch (error) {
      console.error('Failed to set Claude binary path:', error)
      throw error
    }
  },

  /**
   * List all available Claude installations on the system
   * @returns Promise resolving to an array of Claude installations
   */
  async listClaudeInstallations(): Promise<ClaudeInstallation[]> {
    try {
      const api = getWindowApi()
      return await api.listClaudeInstallations()
    } catch (error) {
      console.error('Failed to list Claude installations:', error)
      throw error
    }
  },

  // Storage API methods

  /**
   * Lists all tables in the SQLite database
   * @returns Promise resolving to an array of table information
   */
  async storageListTables(): Promise<any[]> {
    try {
      const api = getWindowApi()
      return await api.storageListTables()
    } catch (error) {
      console.error('Failed to list tables:', error)
      throw error
    }
  },

  /**
   * Reads table data with pagination
   * @param tableName - Name of the table to read
   * @param page - Page number (1-indexed)
   * @param pageSize - Number of rows per page
   * @param searchQuery - Optional search query
   * @returns Promise resolving to table data with pagination info
   */
  async storageReadTable(
    tableName: string,
    page: number,
    pageSize: number,
    searchQuery?: string
  ): Promise<any> {
    try {
      const api = getWindowApi()
      return await api.storageReadTable(tableName, page, pageSize, searchQuery)
    } catch (error) {
      console.error('Failed to read table:', error)
      throw error
    }
  },

  /**
   * Updates a row in a table
   * @param tableName - Name of the table
   * @param primaryKeyValues - Map of primary key column names to values
   * @param updates - Map of column names to new values
   * @returns Promise resolving when the row is updated
   */
  async storageUpdateRow(
    tableName: string,
    primaryKeyValues: Record<string, any>,
    updates: Record<string, any>
  ): Promise<void> {
    try {
      const api = getWindowApi()
      return await api.storageUpdateRow(tableName, primaryKeyValues, updates)
    } catch (error) {
      console.error('Failed to update row:', error)
      throw error
    }
  },

  /**
   * Deletes a row from a table
   * @param tableName - Name of the table
   * @param primaryKeyValues - Map of primary key column names to values
   * @returns Promise resolving when the row is deleted
   */
  async storageDeleteRow(tableName: string, primaryKeyValues: Record<string, any>): Promise<void> {
    try {
      const api = getWindowApi()
      return await api.storageDeleteRow(tableName, primaryKeyValues)
    } catch (error) {
      console.error('Failed to delete row:', error)
      throw error
    }
  },

  /**
   * Inserts a new row into a table
   * @param tableName - Name of the table
   * @param values - Map of column names to values
   * @returns Promise resolving to the last insert row ID
   */
  async storageInsertRow(tableName: string, values: Record<string, any>): Promise<number> {
    try {
      const api = getWindowApi()
      return await api.storageInsertRow(tableName, values)
    } catch (error) {
      console.error('Failed to insert row:', error)
      throw error
    }
  },

  /**
   * Executes a raw SQL query
   * @param query - SQL query string
   * @returns Promise resolving to query result
   */
  async storageExecuteSql(query: string): Promise<any> {
    try {
      const api = getWindowApi()
      return await api.storageExecuteSql(query)
    } catch (error) {
      console.error('Failed to execute SQL:', error)
      throw error
    }
  },

  /**
   * Resets the entire database
   * @returns Promise resolving when the database is reset
   */
  async storageResetDatabase(): Promise<void> {
    try {
      const api = getWindowApi()
      return await api.storageResetDatabase()
    } catch (error) {
      console.error('Failed to reset database:', error)
      throw error
    }
  },

  /**
   * Get hooks configuration for a specific scope
   * @param scope - The configuration scope: 'user', 'project', or 'local'
   * @param projectPath - Project path (required for project and local scopes)
   * @returns Promise resolving to the hooks configuration
   */
  async getHooksConfig(
    scope: 'user' | 'project' | 'local',
    projectPath?: string
  ): Promise<HooksConfiguration> {
    try {
      const api = getWindowApi()
      return await api.getHooksConfig(scope, projectPath)
    } catch (error) {
      console.error('Failed to get hooks config:', error)
      throw error
    }
  },

  /**
   * Update hooks configuration for a specific scope
   * @param scope - The configuration scope: 'user', 'project', or 'local'
   * @param hooks - The hooks configuration to save
   * @param projectPath - Project path (required for project and local scopes)
   * @returns Promise resolving to success message
   */
  async updateHooksConfig(
    scope: 'user' | 'project' | 'local',
    hooks: HooksConfiguration,
    projectPath?: string
  ): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.updateHooksConfig(scope, hooks, projectPath)
    } catch (error) {
      console.error('Failed to update hooks config:', error)
      throw error
    }
  },

  /**
   * Validate a hook command syntax
   * @param command - The shell command to validate
   * @returns Promise resolving to validation result
   */
  async validateHookCommand(command: string): Promise<{ valid: boolean; message: string }> {
    try {
      const api = getWindowApi()
      return await api.validateHookCommand(command)
    } catch (error) {
      console.error('Failed to validate hook command:', error)
      throw error
    }
  },

  /**
   * Get merged hooks configuration (respecting priority)
   * @param projectPath - The project path
   * @returns Promise resolving to merged hooks configuration
   */
  async getMergedHooksConfig(projectPath: string): Promise<HooksConfiguration> {
    try {
      const [userHooks, projectHooks, localHooks] = await Promise.all([
        this.getHooksConfig('user'),
        this.getHooksConfig('project', projectPath),
        this.getHooksConfig('local', projectPath)
      ])

      // Import HooksManager for merging
      const { HooksManager } = await import('@/lib/hooksManager')
      return HooksManager.mergeConfigs(userHooks, projectHooks, localHooks)
    } catch (error) {
      console.error('Failed to get merged hooks config:', error)
      throw error
    }
  },

  // Slash Commands API methods

  /**
   * Lists all available slash commands
   * @param projectPath - Optional project path to include project-specific commands
   * @returns Promise resolving to array of slash commands
   */
  async slashCommandsList(projectPath?: string): Promise<SlashCommand[]> {
    try {
      const api = getWindowApi()
      return await api.slashCommandsList(projectPath)
    } catch (error) {
      console.error('Failed to list slash commands:', error)
      throw error
    }
  },

  /**
   * Gets a single slash command by ID
   * @param commandId - Unique identifier of the command
   * @returns Promise resolving to the slash command
   */
  async slashCommandGet(commandId: string): Promise<SlashCommand> {
    try {
      const api = getWindowApi()
      return await api.slashCommandGet(commandId)
    } catch (error) {
      console.error('Failed to get slash command:', error)
      throw error
    }
  },

  /**
   * Creates or updates a slash command
   * @param scope - Command scope: "project" or "user"
   * @param name - Command name (without prefix)
   * @param namespace - Optional namespace for organization
   * @param content - Markdown content of the command
   * @param description - Optional description
   * @param allowedTools - List of allowed tools for this command
   * @param projectPath - Required for project scope commands
   * @returns Promise resolving to the saved command
   */
  async slashCommandSave(
    scope: string,
    name: string,
    namespace: string | undefined,
    content: string,
    description: string | undefined,
    allowedTools: string[],
    projectPath?: string
  ): Promise<SlashCommand> {
    try {
      const api = getWindowApi()
      return await api.slashCommandSave(
        scope,
        name,
        namespace,
        content,
        description,
        allowedTools,
        projectPath
      )
    } catch (error) {
      console.error('Failed to save slash command:', error)
      throw error
    }
  },

  /**
   * Deletes a slash command
   * @param commandId - Unique identifier of the command to delete
   * @param projectPath - Optional project path for deleting project commands
   * @returns Promise resolving to deletion message
   */
  async slashCommandDelete(commandId: string, projectPath?: string): Promise<string> {
    try {
      const api = getWindowApi()
      return await api.slashCommandDelete(commandId, projectPath)
    } catch (error) {
      console.error('Failed to delete slash command:', error)
      throw error
    }
  }
}

// Export additional functions from window.api
export const open = async (options?: any) => {
  const windowApi = getWindowApi()
  return windowApi.showOpenDialog(options)
}

export const save = async (options?: any) => {
  const windowApi = getWindowApi()
  return windowApi.showSaveDialog(options)
}

export const invoke = async (command: string, args?: any) => {
  console.log(`Invoke: ${command}`, args)
  // This is a placeholder for Tauri-style invoke calls
  // In Electron, we use specific IPC handlers instead
  return {}
}

export const listen = <T>(
  event: string,
  callback: (event: { payload: T }) => void
): (() => void) => {
  const windowApi = getWindowApi()

  // 解析事件名和runId
  const [_eventType, runId] = event.split(':')

  // 包装回调函数，将数据格式从 Electron 格式转换为原版 Tauri 格式
  const wrappedCallback = (_electronEvent: any, data: T) => {
    // 包装数据为原版 event.payload 格式
    callback({ payload: data })
  }

  if (runId) {
    // 监听特定runId的事件
    const handler = (_electronEvent: any, data: T) => {
      callback({ payload: data })
    }

    // 使用动态事件监听器来监听特定的事件名称
    if (windowApi && windowApi.addEventListener) {
      console.log('[API] Setting up dynamic listener for event:', event)
      return windowApi.addEventListener(event, handler)
    }
  }

  // 回退到通用事件监听（原有逻辑）
  if (event.startsWith('stream-output') && windowApi.onStreamOutput) {
    windowApi.onStreamOutput(wrappedCallback)
    return () => windowApi.removeAllListeners('stream-output')
  }
  if (event.startsWith('agent-output') && windowApi.onAgentOutput) {
    windowApi.onAgentOutput(wrappedCallback)
    return () => windowApi.removeAllListeners('agent-output')
  }
  if (event.startsWith('agent-error') && windowApi.onAgentError) {
    windowApi.onAgentError(wrappedCallback)
    return () => windowApi.removeAllListeners('agent-error')
  }
  if (event.startsWith('agent-complete') && windowApi.onAgentComplete) {
    windowApi.onAgentComplete(wrappedCallback)
    return () => windowApi.removeAllListeners('agent-complete')
  }
  if (event.startsWith('agent-cancelled') && windowApi.onAgentCancelled) {
    windowApi.onAgentCancelled(wrappedCallback)
    return () => windowApi.removeAllListeners('agent-cancelled')
  }

  // Claude 事件处理
  if (event.startsWith('claude-output') && windowApi.onClaudeOutput) {
    console.log('[API] Setting up claude-output listener')
    windowApi.onClaudeOutput(wrappedCallback)
    return () => windowApi.removeAllListeners('claude-output')
  }
  if (event.startsWith('claude-error') && windowApi.onClaudeError) {
    console.log('[API] Setting up claude-error listener')
    windowApi.onClaudeError(wrappedCallback)
    return () => windowApi.removeAllListeners('claude-error')
  }
  if (event.startsWith('claude-complete') && windowApi.onClaudeComplete) {
    console.log('[API] Setting up claude-complete listener')
    windowApi.onClaudeComplete(wrappedCallback)
    return () => windowApi.removeAllListeners('claude-complete')
  }

  console.log(`Listen for event: ${event} - event system not fully implemented`)
  return () => {} // Return a no-op unlisten function
}

export type UnlistenFn = () => void

export const openUrl = async (url: string) => {
  window.open(url, '_blank')
}

export const convertFileSrc = (filePath: string) => {
  return `file://${filePath}`
}

export const getCurrentWebviewWindow = () => {
  return {
    setResizable: () => {},
    setAlwaysOnTop: () => {},
    show: () => {},
    hide: () => {}
  }
}
