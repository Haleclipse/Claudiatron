import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Project Management
  listProjects: () => ipcRenderer.invoke('list-projects'),
  getProjectSessions: (projectPath: string) =>
    ipcRenderer.invoke('get-project-sessions', projectPath),

  // Claude Settings
  getClaudeSettings: () => ipcRenderer.invoke('get-claude-settings'),
  saveClaudeSettings: (settings: any) => ipcRenderer.invoke('save-claude-settings', settings),

  // Version Check
  checkClaudeVersion: () => ipcRenderer.invoke('check-claude-version'),

  // Claude Code Execution
  executeClaudeCode: (projectPath: string, message: string, model?: string) =>
    ipcRenderer.invoke('execute-claude-code', { projectPath, message, model }),
  continueClaudeCode: (projectPath: string, message: string, model?: string) =>
    ipcRenderer.invoke('continue-claude-code', { projectPath, message, model }),
  cancelClaudeExecution: (runId: number) => ipcRenderer.invoke('cancel-claude-execution', runId),

  // File Operations
  readClaudeMdFile: (filePath: string) => ipcRenderer.invoke('read-claude-md-file', filePath),
  saveClaudeMdFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('save-claude-md-file', { filePath, content }),
  findClaudeMdFiles: (projectPath: string) =>
    ipcRenderer.invoke('find-claude-md-files', projectPath),

  // Agent Management
  listAgents: () => ipcRenderer.invoke('list-agents'),
  createAgent: (agentData: any) => ipcRenderer.invoke('create-agent', agentData),
  updateAgent: (id: number, agentData: any) => ipcRenderer.invoke('update-agent', id, agentData),
  deleteAgent: (id: number) => ipcRenderer.invoke('delete-agent', id),
  getAgent: (id: number) => ipcRenderer.invoke('get-agent', id),
  executeAgent: (params: any) => ipcRenderer.invoke('execute-agent', params),
  killAgentSession: (runId: number) => ipcRenderer.invoke('kill-agent-session', runId),
  listAgentRuns: (agentId?: number) => ipcRenderer.invoke('list-agent-runs', agentId),
  getAgentRun: (id: number) => ipcRenderer.invoke('get-agent-run', id),
  getAgentRunWithMetrics: (id: number) => ipcRenderer.invoke('get-agent-run-with-metrics', id),
  listRunningSessionsAgents: () => ipcRenderer.invoke('list-running-agent-sessions'),
  getSessionStatus: (runId: number) => ipcRenderer.invoke('get-session-status', runId),
  getLiveSessionOutput: (runId: number) => ipcRenderer.invoke('get-live-session-output', runId),
  getSessionOutput: (runId: number) => ipcRenderer.invoke('get-session-output', runId),
  exportAgent: (id: number) => ipcRenderer.invoke('export-agent', id),
  importAgent: (jsonData: string) => ipcRenderer.invoke('import-agent', jsonData),
  importAgentFromFile: (filePath: string) => ipcRenderer.invoke('import-agent-from-file', filePath),
  cleanupFinishedProcesses: () => ipcRenderer.invoke('cleanup-finished-processes'),

  // MCP Management
  mcpAdd: (
    name: string,
    transport: string,
    command?: string,
    args: string[] = [],
    env: Record<string, string> = {},
    url?: string,
    scope: string = 'local'
  ) => ipcRenderer.invoke('mcp-add', { name, transport, command, args, env, url, scope }),
  mcpList: () => ipcRenderer.invoke('mcp-list'),
  mcpGet: (name: string) => ipcRenderer.invoke('mcp-get', { name }),
  mcpRemove: (name: string) => {
    console.log('Preload: mcpRemove called with', name, 'type:', typeof name)
    return ipcRenderer.invoke('mcp-remove', { name })
  },
  mcpTestConnection: (name: string) => ipcRenderer.invoke('mcp-test-connection', { name }),
  mcpAddJson: (name: string, jsonConfig: string, scope: string = 'local') =>
    ipcRenderer.invoke('mcp-add-json', { name, jsonConfig, scope }),
  mcpImportFromClaudeDesktop: (scope: string = 'local', selectedServers?: string[]) =>
    ipcRenderer.invoke('mcp-import-from-claude-desktop', { scope, selectedServers }),
  mcpServe: () => ipcRenderer.invoke('mcp-serve'),
  mcpResetProjectChoices: () => ipcRenderer.invoke('mcp-reset-project-choices'),
  mcpGetServerStatus: () => ipcRenderer.invoke('mcp-get-server-status'),
  mcpReadProjectConfig: (projectPath: string) =>
    ipcRenderer.invoke('mcp-read-project-config', { projectPath }),
  mcpSaveProjectConfig: (projectPath: string, config: any) =>
    ipcRenderer.invoke('mcp-save-project-config', { projectPath, config }),

  // Storage Management
  getAppSetting: (key: string) => ipcRenderer.invoke('get-app-setting', key),
  setAppSetting: (key: string, value: string) => ipcRenderer.invoke('set-app-setting', key, value),
  getAllAppSettings: () => ipcRenderer.invoke('get-all-app-settings'),
  deleteAppSetting: (key: string) => ipcRenderer.invoke('delete-app-setting', key),
  clearAllAppSettings: () => ipcRenderer.invoke('clear-all-app-settings'),
  getDatabaseInfo: () => ipcRenderer.invoke('get-database-info'),
  exportDatabase: () => ipcRenderer.invoke('export-database'),
  importDatabase: (jsonData: string) => ipcRenderer.invoke('import-database', jsonData),
  backupDatabase: (backupPath: string) => ipcRenderer.invoke('backup-database', backupPath),
  restoreDatabase: (backupPath: string) => ipcRenderer.invoke('restore-database', backupPath),
  vacuumDatabase: () => ipcRenderer.invoke('vacuum-database'),

  // Usage Statistics
  getUsageStats: (params?: any) => ipcRenderer.invoke('get-usage-stats', params),
  getSessionUsage: (sessionId: string) => ipcRenderer.invoke('get-session-usage', sessionId),
  getDailyUsage: (date?: string) => ipcRenderer.invoke('get-daily-usage', date),
  getMonthlyUsage: (year: number, month: number) =>
    ipcRenderer.invoke('get-monthly-usage', year, month),
  getProjectUsage: (projectPath: string) => ipcRenderer.invoke('get-project-usage', projectPath),
  exportUsageData: (params: any) => ipcRenderer.invoke('export-usage-data', params),
  clearUsageData: (beforeDate?: string) => ipcRenderer.invoke('clear-usage-data', beforeDate),
  getUsageByDateRange: (startDate: string, endDate: string) =>
    ipcRenderer.invoke('get-usage-by-date-range', { startDate, endDate }),
  getSessionStats: (since?: string, until?: string, order?: string) =>
    ipcRenderer.invoke('get-session-stats', since, until, order),
  getUsageDetails: (limit?: number) => ipcRenderer.invoke('get-usage-details', { limit }),

  // System Prompt Management
  getSystemPrompt: () => ipcRenderer.invoke('get-system-prompt'),
  saveSystemPrompt: (content: string) => ipcRenderer.invoke('save-system-prompt', { content }),

  // Claude Binary Management
  getClaudeBinaryPath: () => ipcRenderer.invoke('get-claude-binary-path'),
  setClaudeBinaryPath: (path: string) => ipcRenderer.invoke('set-claude-binary-path', { path }),
  listClaudeInstallations: () => ipcRenderer.invoke('list-claude-installations'),

  // Claude Detection (New Smart Detection System)
  getDetectionStats: () => ipcRenderer.invoke('get-detection-stats'),
  redetectClaude: () => ipcRenderer.invoke('redetect-claude'),
  getLastDetectionResult: () => ipcRenderer.invoke('get-last-detection-result'),

  // Hooks Configuration
  getHooksConfig: (scope: string, projectPath?: string) =>
    ipcRenderer.invoke('get-hooks-config', { scope, projectPath }),
  updateHooksConfig: (scope: string, hooks: any, projectPath?: string) =>
    ipcRenderer.invoke('update-hooks-config', { scope, hooks, projectPath }),
  validateHookCommand: (command: string) =>
    ipcRenderer.invoke('validate-hook-command', { command }),

  // Slash Commands
  slashCommandsList: (projectPath?: string) =>
    ipcRenderer.invoke('slash-commands-list', projectPath),
  slashCommandGet: (commandId: string) => ipcRenderer.invoke('slash-commands-get', commandId),
  slashCommandSave: (
    scope: string,
    name: string,
    namespace: string | undefined,
    content: string,
    description: string | undefined,
    allowedTools: string[],
    projectPath?: string
  ) =>
    ipcRenderer.invoke(
      'slash-commands-save',
      scope,
      name,
      namespace,
      content,
      description,
      allowedTools,
      projectPath
    ),
  slashCommandDelete: (commandId: string, projectPath?: string) =>
    ipcRenderer.invoke('slash-commands-delete', commandId, projectPath),

  // Storage APIs
  storageListTables: () => ipcRenderer.invoke('storage-list-tables'),
  storageReadTable: (tableName: string, page: number, pageSize: number, searchQuery?: string) =>
    ipcRenderer.invoke('storage-read-table', { tableName, page, pageSize, searchQuery }),
  storageUpdateRow: (
    tableName: string,
    primaryKeyValues: Record<string, any>,
    updates: Record<string, any>
  ) => ipcRenderer.invoke('storage-update-row', { tableName, primaryKeyValues, updates }),
  storageDeleteRow: (tableName: string, primaryKeyValues: Record<string, any>) =>
    ipcRenderer.invoke('storage-delete-row', { tableName, primaryKeyValues }),
  storageInsertRow: (tableName: string, values: Record<string, any>) =>
    ipcRenderer.invoke('storage-insert-row', { tableName, values }),
  storageExecuteSql: (query: string) => ipcRenderer.invoke('storage-execute-sql', { query }),
  storageResetDatabase: () => ipcRenderer.invoke('storage-reset-database'),

  // File System Operations
  listDirectoryContents: (directoryPath: string) =>
    ipcRenderer.invoke('list-directory-contents', { directoryPath }),
  searchFiles: (basePath: string, query: string) =>
    ipcRenderer.invoke('search-files', { basePath, query }),

  // Session Management
  clearCheckpointManager: (sessionId: string) =>
    ipcRenderer.invoke('clear-checkpoint-manager', sessionId),
  loadSessionHistory: (sessionId: string, projectId: string) =>
    ipcRenderer.invoke('load-session-history', { sessionId, projectId }),
  loadAgentSessionHistory: (sessionId: string) =>
    ipcRenderer.invoke('load-agent-session-history', { sessionId }),
  listRunningClaudeSessions: () => ipcRenderer.invoke('list-running-claude-sessions'),
  listRunningSessions: () => ipcRenderer.invoke('list-running-sessions'),
  updateSessionId: (runId: number, sessionId: string) =>
    ipcRenderer.invoke('update-session-id', { runId, sessionId }),
  getClaudeSessionOutput: (sessionId: string) =>
    ipcRenderer.invoke('get-claude-session-output', { sessionId }),
  resumeClaudeCode: (projectPath: string, sessionId: string, prompt: string, model: string) =>
    ipcRenderer.invoke('resume-claude-code', { projectPath, sessionId, prompt, model }),
  streamSessionOutput: (runId: number) => ipcRenderer.invoke('stream-session-output', { runId }),

  // File Dialogs
  showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options: any) => ipcRenderer.invoke('show-save-dialog', options),

  // Event Listeners
  onStreamOutput: (callback: (event: any, data: any) => void) => {
    ipcRenderer.on('stream-output', callback)
  },
  onAgentOutput: (callback: (event: any, data: any) => void) => {
    const wrappedCallback = (event: any, data: any) => {
      console.log(
        '[Preload] Received agent-output event:',
        event.sender,
        event.returnValue,
        data?.length ? `data length: ${data.length}` : data
      )
      callback(event, data)
    }
    ipcRenderer.on('agent-output', wrappedCallback)
  },
  onAgentError: (callback: (event: any, data: any) => void) => {
    ipcRenderer.on('agent-error', callback)
  },
  onAgentComplete: (callback: (event: any, data: any) => void) => {
    ipcRenderer.on('agent-complete', callback)
  },
  onAgentCancelled: (callback: (event: any, data: any) => void) => {
    ipcRenderer.on('agent-cancelled', callback)
  },

  // Claude 事件监听器
  onClaudeOutput: (callback: (event: any, data: any) => void) => {
    const wrappedCallback = (event: any, data: any) => {
      console.log(
        '[Preload] Received claude-output event:',
        data?.length ? `data length: ${data.length}` : data
      )
      callback(event, data)
    }
    ipcRenderer.on('claude-output', wrappedCallback)
  },
  onClaudeError: (callback: (event: any, data: any) => void) => {
    ipcRenderer.on('claude-error', callback)
  },
  onClaudeComplete: (callback: (event: any, data: any) => void) => {
    ipcRenderer.on('claude-complete', callback)
  },

  // 动态事件监听器 - 支持特定事件名称
  addEventListener: (eventName: string, callback: (event: any, data: any) => void) => {
    console.log('[Preload] Adding event listener for:', eventName)
    ipcRenderer.on(eventName, callback)
    return () => {
      console.log('[Preload] Removing event listener for:', eventName)
      ipcRenderer.removeAllListeners(eventName)
    }
  },

  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  },

  // Window Controls (using electron-toolkit/utils pattern)
  windowControl: (action: 'min' | 'max' | 'close' | 'show' | 'showInactive') =>
    ipcRenderer.send('win:invoke', action)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
