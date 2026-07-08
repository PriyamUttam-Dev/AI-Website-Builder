import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader } from '../components/Loader';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';

export function Builder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log(files);
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    setInitError(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt.trim()
      });

      setTemplateSet(true);
      
      const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

      setLoading(true);
      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map(content => ({
          role: "user",
          content
        }))
      })

      setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

      setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
    } catch (err: any) {
      setLoading(false);
      setTemplateSet(false);

      const status = err?.response?.status;
      const data = err?.response?.data;
      const retryDelay = typeof data?.retryDelay === 'string' ? data.retryDelay : undefined;
      const message = typeof data?.message === 'string' ? data.message : 'Backend error while initializing.';
      const detail = status ? ` (HTTP ${status})` : '';
      const retry = retryDelay ? ` Retry after ${retryDelay}.` : '';
      setInitError(`${message}${detail}.${retry}`);
    }
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="absolute left-[-140px] top-1/3 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <header className="relative border-b border-white/10">
        <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4 text-white/80" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                  <Sparkles className="h-4 w-4 text-blue-300" />
                  Builder
                </div>
              </div>
              <div className="mt-2 text-lg font-semibold text-white/90">Website Builder</div>
              <div className="mt-1 max-w-[70ch] text-xs leading-5 text-white/50">
                Prompt: <span className="text-white/70">{prompt}</span>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">Live preview</div>
          </div>
        </div>
      </header>

      {initError && (
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6">
          <div className="rounded-2xl bg-red-500/10 p-4 ring-1 ring-red-400/20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-red-100">{initError}</div>
              <button
                type="button"
                onClick={() => init()}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
              <div className="p-4">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              <div className="border-t border-white/10 p-4">
                {(loading || !templateSet) && (
                  <div className="rounded-xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
                    <Loader />
                  </div>
                )}

                {!(loading || !templateSet) && (
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-white/70">Refine with chat</label>
                    <textarea
                      value={userPrompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask for tweaks (colors, sections, layout, etc.)"
                      className="min-h-[90px] w-full resize-none rounded-xl bg-black/30 p-3 text-sm text-white/90 ring-1 ring-white/10 placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!userPrompt.trim()) return;
                        const newMessage = {
                          role: "user" as "user",
                          content: userPrompt
                        };

                        setLoading(true);
                        const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                          messages: [...llmMessages, newMessage]
                        });
                        setLoading(false);

                        setLlmMessages(x => [...x, newMessage]);
                        setLlmMessages(x => [...x, {
                          role: "assistant",
                          content: stepsResponse.data.response
                        }]);

                        setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                          ...x,
                          status: "pending" as "pending"
                        }))]);

                        setPrompt("");
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(59,130,246,0.65)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <aside className="lg:col-span-3">
            <div className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <FileExplorer
                files={files}
                onFileSelect={setSelectedFile}
              />
            </div>
          </aside>

          <section className="lg:col-span-6">
            <div className="h-[calc(100vh-10.5rem)] rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <TabView activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="h-[calc(100%-3.5rem)] overflow-hidden rounded-xl ring-1 ring-white/10">
                {activeTab === 'code' ? (
                  <CodeEditor file={selectedFile} />
                ) : (
                  webcontainer ? (
                    <PreviewFrame webContainer={webcontainer} files={files} />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-black/20">
                      <Loader />
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}