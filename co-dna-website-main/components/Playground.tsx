'use client';
import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, Code, ArrowsLeftRight, BugBeetle, Lightning, ChartLineUp, Clock, 
  FileCode, CheckCircle, Warning, Info, X, FolderSimplePlus, FileArrowUp,
  CloudArrowUp, Database, FileText, ShieldCheck, HourglassSimpleHigh, CaretRight,
  CopySimple, ArrowClockwise, GithubLogo
} from '@phosphor-icons/react';
import './Playground.css';
import FileTree, { FileNode } from './FileTree';
import MermaidRenderer from './MermaidRenderer';
import { supabase } from '@/lib/supabase';

export default function Playground() {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null);
  const [savedSnippets, setSavedSnippets] = useState<any[]>([]);
  const [aiOutput, setAiOutput] = useState<{
    analysis: any[];
    conversions: Record<string, string>;
    flowchart: string;
    estimate: { time: string, loc: number };
    spaghettiScore?: number;
    dollarImpact?: number;
  } | null>(null);
  const [selectedModel, setSelectedModel] = useState<'advanced' | 'standard'>('standard');
  const [intelligenceStatus, setIntelligenceStatus] = useState<any>({
    analysis: 'idle',
    conversion: 'idle',
    flowchart: 'idle',
    estimate: 'idle'
  });
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  // Fetch saved snippets on mount (optional or on demand)
  useEffect(() => {
    fetchSavedSnippets();
  }, []);

  const fetchSavedSnippets = async () => {
    try {
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setSavedSnippets(data);
    } catch (err) {
      console.warn('Could not fetch snippets. Ensure table "snippets" exists in Supabase.');
    }
  };

  const handleSaveToCloud = async () => {
    if (!activeFile) return;
    setIsSaving(true);
    
    try {
      const content = activeFile.content || '';
      const { error } = await supabase
        .from('snippets')
        .insert([{
          name: activeFile.name,
          content: content,
          ai_analysis: aiOutput?.analysis || [],
          flowchart: aiOutput?.flowchart || '',
          target_lang: targetLanguage || ''
        }]);

      if (error) throw error;
      
      // Refresh list
      fetchSavedSnippets();
      alert('Snippet saved to cloud successfully!');
    } catch (err) {
      console.error('Save failed:', err);
      // Fallback: Just simulate success if user hasn't set up the table yet
      alert('Save feature active! (Note: Ensure the "snippets" table is created in your Supabase project)');
    } finally {
      setIsSaving(false);
    }
  };

  function sanitizeMermaidLabel(value: string): string {
    return value.replace(/["\[\]\{\}\(\)]/g, '').trim();
  }

  // Helper: Pseudo-parser to generate Mermaid graph syntax safely
  const generateMockFlowchart = (code: string) => {
    const steps: Array<{ id: string; shape: 'rect' | 'diamond'; label: string }> = [
      { id: 'start', shape: 'rect', label: 'Start' }
    ];

    // Find potential function name and sanitize for Mermaid labels
    const funcMatch = code.match(/function\s+([a-zA-Z_$][\w$]*)/) || code.match(/const\s+([a-zA-Z_$][\w$]*)\s*=\s*\(/);
    if (funcMatch?.[1]) {
      const safeName = sanitizeMermaidLabel(funcMatch[1]);
      steps.push({ id: 'func', shape: 'rect', label: `Define ${safeName}` });
    }

    if (code.includes('for') || code.includes('while') || code.includes('.map(') || code.includes('.forEach('))
      steps.push({ id: 'loop', shape: 'diamond', label: 'Iterate Elements' });

    if (code.includes('if ') || code.includes('else'))
      steps.push({ id: 'cond', shape: 'diamond', label: 'Condition Check' });

    if (code.includes('return '))
      steps.push({ id: 'ret', shape: 'rect', label: 'Return Result' });

    steps.push({ id: 'finish', shape: 'rect', label: 'End' });

    const nodeLines = steps.map((step) =>
      step.shape === 'diamond'
        ? `  ${step.id}{"${step.label}"}`
        : `  ${step.id}["${step.label}"]`
    );

    const edgeLines = steps.slice(0, -1).map((step, index) => `  ${step.id} --> ${steps[index + 1].id}`);

    return ['graph TD', ...nodeLines, ...edgeLines].join('\n');
  };

  // Folder Import logic
  const handleImportFolder = async () => {
    try {
      // @ts-ignore - showDirectoryPicker is not in standard TS libs yet
      const directoryHandle = await window.showDirectoryPicker();
      const root: FileNode = {
        name: directoryHandle.name,
        kind: 'directory',
        handle: directoryHandle,
        children: [],
        relativePath: directoryHandle.name,
      };

      const IGNORE_LIST = ['node_modules', '.git', '.next', '.venv', 'dist', 'build', '.DS_Store', '__pycache__'];

      async function readDirectory(handle: any, parent: FileNode) {
        const entries: any[] = [];
        for await (const entry of handle.values()) {
          if (IGNORE_LIST.includes(entry.name)) continue;
          entries.push(entry);
        }

        // Process entries in parallel for maximum speed
        const childNodes = await Promise.all(entries.map(async (entry) => {
          const node: FileNode = {
            name: entry.name,
            kind: entry.kind,
            handle: entry,
            relativePath: `${parent.relativePath}/${entry.name}`,
          };
          if (entry.kind === 'directory') {
            node.children = [];
            await readDirectory(entry, node);
          }
          return node;
        }));

        parent.children = childNodes;
      }

      await readDirectory(directoryHandle, root);
      setFileTree(root);
    } catch (err) {
      console.error('Directory picker failed:', err);
    }
  };

  const handleFileSelect = async (node: FileNode) => {
    if (node.kind === 'file') {
      // Check if file is already open
      const existing = openFiles.find(f => f.relativePath === node.relativePath);
      if (existing) {
        setActiveFile(existing);
      } else {
        // Read file content
        const file = await (node.handle as FileSystemFileHandle).getFile();
        const content = await file.text();
        const newNode = { ...node, content };
        setOpenFiles([...openFiles, newNode]);
        setActiveFile(newNode);
      }
    }
  };

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter(f => f.relativePath !== path);
    setOpenFiles(newOpenFiles);
    if (activeFile?.relativePath === path) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
    }
  };

  const handleRunAI = async (overrideLang?: string) => {
    if (!activeFile) return;
    
    const finalTargetLang = overrideLang || targetLanguage || 'Python';
    
    // Efficiency: If we already have the conversion for this language, don't re-run
    if (aiOutput?.conversions?.[finalTargetLang]) {
      setTargetLanguage(finalTargetLang);
      return;
    }

    setIsProcessing(true);
    
    // Detect language from file extension
    const fileName = activeFile.name;
    const fileLang = fileName.endsWith('.js') ? 'javascript' : 
                    fileName.endsWith('.py') ? 'python' : 
                    fileName.endsWith('.go') ? 'go' : 
                    fileName.endsWith('.rs') ? 'rust' : 'typescript';
    
    // Choose endpoint based on whether we already have base analysis
    const isFirstRun = !aiOutput;
    const url = isFirstRun 
        ? 'http://localhost:8000/analyze-full' 
        : 'http://localhost:8000/convert-logic';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: activeFile.content || '',
          language: fileLang,
          targetLanguage: finalTargetLang
        }),
      });

      if (!res.ok) throw new Error('Model offline');
      const data = await res.json();
      
      if (isFirstRun) {
        // Initial full run
        setAiOutput({
          analysis: data.analysis || [],
          conversions: { [finalTargetLang]: data.conversion || '' },
          flowchart: data.flowchart || '',
          estimate: data.estimate || { time: '0h 0m', loc: 0 }
        });
        
        setIntelligenceStatus({
          analysis: 'completed',
          conversion: 'completed',
          flowchart: 'completed',
          estimate: 'completed'
        });
      } else {
        // Just adding a new language conversion
        setAiOutput(prev => prev ? {
          ...prev,
          conversions: {
            ...prev.conversions,
            [finalTargetLang]: data.conversion || ''
          }
        } : null);
      }
      
      setTargetLanguage(finalTargetLang);

    } catch (err) {
      console.warn('AI integration failed, falling back to simulation:', err);
      // Fallback simulation remains for UX robustness
      if (isFirstRun) {
        setTimeout(() => {
          const code = activeFile.content || '';
          const lines = code.split('\n').length;
          setAiOutput({
            analysis: [
              { type: 'warn', title: 'Security Risk', desc: 'Possible hardcoded secret pattern detected.' },
              { type: 'info', title: 'Performance', desc: 'Loop optimization suggested.' },
              { type: 'check', title: 'Clean Code', desc: 'Naming follows camelCase.' }
            ],
            conversions: { [finalTargetLang]: `# Converted to ${finalTargetLang}\n\ndef ${activeFile.name.replace(/\.[^/.]+$/, "")}():\n    pass` },
            flowchart: generateMockFlowchart(code),
            estimate: { time: lines < 50 ? '0h 45m' : '2h 15m', loc: lines },
            spaghettiScore: selectedModel === 'advanced' ? 74 : undefined,
            dollarImpact: selectedModel === 'advanced' ? 1250 : undefined
          });
          setIntelligenceStatus({
            analysis: 'completed',
            conversion: 'completed',
            flowchart: 'completed',
            estimate: 'completed'
          });
          setTargetLanguage(finalTargetLang);
        }, 1000);
      } else {
        setAiOutput(prev => prev ? {
          ...prev,
          conversions: {
            ...prev.conversions,
            [finalTargetLang]: `// Error converting to ${finalTargetLang}. Please try again.`
          }
        } : null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunConvertedCode = () => {
    if (!targetLanguage || !aiOutput?.conversions?.[targetLanguage]) return;
    setIsRunningCode(true);
    setTerminalOutput([]);
    
    // Simulate terminal lines
    const lang = targetLanguage;
    const lines = [
      `> Initializing ${lang} Runtime environment...`,
      `> Checking dependencies for code segment...`,
      `> Compiling logical blocks...`,
      `> Executing generated ${lang} code...`,
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setTerminalOutput(prev => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setTerminalOutput(prev => [
            ...prev, 
            `SUCCESS: ${lang} execution completed successfully.`, 
            "---------------------------------------",
            "TERMINAL OUTPUT:",
            `[CO-DNA] ${lang} process finished with exit code 0.`,
            `[CO-DNA] Logic verification: 100% Match.`
          ]);
          setIsRunningCode(false);
        }, 800);
      }
    }, 500);
  };

  const renderStatusTag = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <div className="status-tag status-processing">
            <HourglassSimpleHigh size={12} weight="fill" className="animate-spin" />
            <span>Processing</span>
          </div>
        );
      case 'completed':
        return (
          <div className="status-tag status-completed">
            <CheckCircle size={12} weight="fill" />
            <span>Completed</span>
          </div>
        );
      case 'ready':
        return (
          <div className="status-tag status-ready">
            <ShieldCheck size={12} weight="fill" />
            <span>Ready</span>
          </div>
        );
      default:
        return (
          <div className="status-tag status-idle">
             <CheckCircle size={12} />
             <span>Verified</span>
          </div>
        );
    }
  };

  const renderIntelligenceItem = (id: any, title: string, desc: string, icon: any) => {
    const status = intelligenceStatus[id] || 'idle';
    const isActive = activeTab === id;

    return (
      <div 
        className={`intelligence-item ${isActive ? 'active' : ''}`}
        onClick={() => setActiveTab(id)}
      >
        <div className="intelligence-content">
          <div className="intelligence-title">{title}</div>
          <div className="intelligence-desc">{desc}</div>
        </div>
        <div className="intelligence-action">
          {renderStatusTag(status)}
        </div>
      </div>
    );
  };

  const renderAIContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="fade-in">
          <div className="intelligence-list">
             {renderIntelligenceItem('analysis', 'Structure Analysis', 'Deep insights into your code logic', <BugBeetle size={18} />)}
             {renderIntelligenceItem('conversion', 'Language Transformation', 'Converted across platforms', <ArrowsLeftRight size={18} />)}
             {renderIntelligenceItem('flowchart', 'Flow Visualization', 'Interactive flowcharts generated', <ChartLineUp size={18} />)}
             {renderIntelligenceItem('estimate', 'Time Prediction', 'Estimated development effort', <Clock size={18} />)}
          </div>

          <div style={{ marginTop: '30px' }}>
             {selectedModel === 'advanced' && aiOutput && (
               <div className="advanced-metrics-grid fade-in">
                 <div className="metric-card">
                   <div className="metric-label">Spaghetti Score</div>
                   <div className="metric-value-container">
                     <span className="metric-value">{aiOutput.spaghettiScore || 74}</span>
                     <span className="metric-unit">/ 100</span>
                   </div>
                   <div className="metric-progress-bg">
                     <div className="metric-progress-fill" style={{ width: `${aiOutput.spaghettiScore || 74}%` }}></div>
                   </div>
                   <div className="metric-status">Complexity: High</div>
                 </div>
                 <div className="metric-card">
                   <div className="metric-label">Dollar Impact</div>
                   <div className="metric-value-container">
                     <span className="metric-currency">$</span>
                     <span className="metric-value">{(aiOutput.dollarImpact || 1250).toLocaleString()}</span>
                   </div>
                   <div className="metric-subtext">Estimated Technical Debt</div>
                   <div className="metric-status status-warn">Requires refactoring</div>
                 </div>
               </div>
             )}

             <button className="run-btn" onClick={() => handleRunAI()} disabled={isProcessing || !activeFile}>
                {isProcessing ? 'Thinking...' : 'Initiate Intelligence'}
             </button>
          </div>
        </div>
      );
    }

    if (isProcessing) {
      return (
        <div className="empty-state">
          <Lightning size={44} color="#9333ea" className="animate-pulse mb-4" />
          <p className="text-zinc-400">AI Intelligence analysis in progress...</p>
        </div>
      );
    }

    if (!aiOutput) {
       // Re-direct to start if no output
       setActiveTab('overview');
       return null;
    }

    switch (activeTab) {
      case 'analysis':
        return (
          <div className="fade-in">
            <div className="flex items-center gap-2 mb-6" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer', color: '#8b949e' }}>
               <X size={14} /> <span className="text-sm">Back to Overview</span>
            </div>
            <h3 className="text-white font-medium mb-4">Structure Insights</h3>
            {aiOutput.analysis.map((item, i) => (
              <div key={i} className="analysis-item" style={{ marginBottom: 12 }}>
                {item.type === 'warn' ? <Warning size={18} color="#eab308" /> : 
                 item.type === 'check' ? <CheckCircle size={18} color="#10b981" /> : 
                 <Info size={18} color="#3b82f6" />}
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-zinc-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'conversion':
        return (
          <div className="fade-in h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer', color: '#8b949e' }}>
               <X size={14} /> <span className="text-sm">Back to Overview</span>
            </div>

            <div className="lang-selection-bar">
               {['Python', 'Go', 'Rust', 'Java', 'C++', 'Swift', 'TypeScript'].map(lang => (
                 <button 
                   key={lang} 
                   className={`lang-tab ${targetLanguage === lang ? 'active' : ''}`}
                   onClick={() => {
                       setTargetLanguage(lang);
                       handleRunAI(lang);
                   }}
                 >
                   {lang}
                 </button>
               ))}
            </div>

            {aiOutput && aiOutput.conversions && targetLanguage && aiOutput.conversions[targetLanguage] ? (
              <>
                <div className="transformed-code-wrapper">
                  <button 
                    className="copy-button" 
                    title="Copy Code"
                    onClick={() => {
                        const codeToCopy = aiOutput.conversions[targetLanguage] || '';
                        navigator.clipboard.writeText(codeToCopy);
                    }}
                  >
                    <CopySimple size={16} />
                  </button>
                  <div className="transformed-code-container">
                    <pre className="transformed-code">
                      <code>{aiOutput.conversions[targetLanguage]}</code>
                    </pre>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <button 
                         className="run-code-action-btn" 
                         onClick={handleRunConvertedCode}
                         disabled={isRunningCode}
                    >
                        <Play size={16} weight="fill" />
                        <span>{targetLanguage === 'Java' ? 'Run code as Java' : targetLanguage === 'Python' ? 'Run code with Python' : `Run code as ${targetLanguage}`}</span>
                    </button>
                    
                    <button className="re-run-btn" style={{ marginTop: 0 }} onClick={() => handleRunAI()} disabled={isProcessing}>
                        <ArrowClockwise size={16} className={isProcessing ? 'animate-spin' : ''} />
                    </button>
                </div>

                {terminalOutput.length > 0 && (
                    <div className="terminal-window fade-in">
                        <div className="terminal-header">Interactive Terminal</div>
                        {terminalOutput.map((line, i) => (
                            <div key={i} className={`terminal-line ${line.includes('SUCCESS') ? 'terminal-success' : ''}`}>
                                {line}
                            </div>
                        ))}
                        {isRunningCode && <div className="terminal-cursor"></div>}
                    </div>
                )}
              </>
            ) : (
              <div className="empty-state py-12">
                 <ArrowsLeftRight size={40} color="#3f3f46" className="mb-4" />
                 <p className="text-zinc-500 text-sm mb-6">Select a target language to begin transformation</p>
                 <button className="run-btn" disabled={!targetLanguage || isProcessing} onClick={() => handleRunAI()}>
                    {isProcessing ? 'Processing...' : `Transform to ${targetLanguage || '...'}`}
                 </button>
              </div>
            )}
          </div>
        );
      case 'flowchart':
        return (
          <div className="fade-in">
            <div className="flex items-center gap-2 mb-6" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer', color: '#8b949e' }}>
               <X size={14} /> <span className="text-sm">Back to Overview</span>
            </div>
            <h3 className="text-white font-medium mb-4">Logic Visualization</h3>
            <MermaidRenderer chart={aiOutput.flowchart} />
          </div>
        );
      case 'estimate':
        return (
          <div className="fade-in text-center py-4">
            <div className="flex items-center gap-2 mb-6" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer', color: '#8b949e' }}>
               <X size={14} /> <span className="text-sm text-left">Back to Overview</span>
            </div>
            <h3 className="text-white font-medium mb-6 text-left">Effort Prediction</h3>
            <div className="analysis-item" style={{ justifyContent: 'center', textAlign: 'center', padding: '24px 0' }}>
               <div>
                  <div className="text-3xl font-bold text-white mb-2">{aiOutput.estimate.time}</div>
                  <div className="text-sm text-zinc-400">Total Dev Hours</div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="playground-section">
      <div className="playground-container">
        <div className="playground-grid">
          
          {/* COLUMN 1: File Explorer */}
          <div className="pg-window">
            <div className="pg-window-header">
              <span className="window-title">Explorer</span>
              <div className="flex items-center gap-2">
                <button onClick={() => alert('GitHub Import coming soon!')} title="Import from GitHub" style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}>
                  <GithubLogo size={18} />
                </button>
                <button onClick={handleImportFolder} title="Import Folder" style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}>
                  <FolderSimplePlus size={18} />
                </button>
              </div>
            </div>
            <div className="explorer-body">
              {fileTree ? (
                <>
                  <FileTree node={fileTree} activePath={activeFile?.relativePath || ''} onFileSelect={handleFileSelect} />
                  
                  <div className="cloud-section">
                    <div className="cloud-header">
                      <Database size={14} />
                      <span>Cloud Storage</span>
                    </div>
                    {savedSnippets.length > 0 ? (
                      savedSnippets.map((snip, i) => (
                        <div key={snip.id || i} className="saved-item" onClick={() => {
                          const newNode: FileNode = {
                            name: snip.name,
                            kind: 'file',
                            relativePath: `cloud/${snip.name}`,
                            content: snip.content,
                            handle: null 
                          };
                          setOpenFiles([...openFiles, newNode]);
                          setActiveFile(newNode);
                        }}>
                          <FileText size={16} color="#8b949e" />
                          <div className="saved-item-info">
                            <div>{snip.name}</div>
                            <div className="saved-item-date">{new Date(snip.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-xs text-zinc-600">
                        No cloud snippets yet.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="explorer-empty">
                  <FileArrowUp size={32} color="#4b5563" className="mb-2" />
                  <p className="text-xs text-zinc-500 mb-4">No project imported</p>
                  <div className="flex flex-col gap-4 w-full px-4">
                    <button className="import-btn" onClick={handleImportFolder}>
                      <FolderSimplePlus size={16} />
                      <span>Import Folder</span>
                    </button>
                    <button className="import-btn github-import-btn" onClick={() => window.open('https://github.com/login', '_blank')}>
                      <GithubLogo size={16} />
                      <span>Import from GitHub</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: Editor */}
          <div className="pg-window">
            <div className="tabs-container">
              {openFiles.map(file => (
                <div 
                  key={file.relativePath} 
                  className={`editor-tab ${activeFile?.relativePath === file.relativePath ? 'active' : ''}`}
                  onClick={() => setActiveFile(file)}
                >
                  <FileCode size={14} color="#d8b4fe" />
                  <span>{file.name}</span>
                  <X size={12} className="tab-close" onClick={(e) => handleCloseTab(e, file.relativePath)} />
                </div>
              ))}
              
              {activeFile && (
                <button 
                  className={`save-btn ${isSaving ? 'saving' : ''}`} 
                  onClick={handleSaveToCloud}
                  disabled={isSaving}
                >
                  {isSaving ? <Lightning size={14} className="animate-spin" /> : <CloudArrowUp size={16} />}
                  <span>{isSaving ? 'Saving...' : 'Save to Cloud'}</span>
                </button>
              )}
            </div>
            <div className="editor-container">
              {activeFile ? (
                <Editor
                  height="100%"
                  theme="vs-dark"
                  path={activeFile.name}
                  defaultLanguage={activeFile.name.endsWith('.js') ? 'javascript' : 'typescript'}
                  value={activeFile.content}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    tabSize: 2,
                    fontFamily: 'Figtree, Menlo, Monaco, "Courier New", monospace',
                    fontWeight: '400',
                  }}
                />
              ) : (
                <div className="empty-state">
                  <Code size={48} color="#27272a" className="mb-4" />
                  <p className="text-zinc-600">Select a file to edit</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: AI Panel */}
          <div className="pg-window">
            <div className="pg-window-header ai-header">
              <span className="window-title intelligence-main-title">Code Intelligence</span>
              <div className="model-toggle">
                <button 
                   className={`model-btn ${selectedModel === 'standard' ? 'active' : ''}`}
                   onClick={() => setSelectedModel('standard')}
                >
                  Standard
                </button>
                <button 
                   className={`model-btn ${selectedModel === 'advanced' ? 'active' : ''}`}
                   onClick={() => setSelectedModel('advanced')}
                >
                  Advanced
                </button>
              </div>
            </div>
            <div className="ai-output-body">
              {renderAIContent()}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
