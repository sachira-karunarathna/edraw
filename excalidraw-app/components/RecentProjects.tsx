import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    FiEdit2,
    FiUpload,
    FiChevronDown,
    FiLogOut
} from 'react-icons/fi'
import { supabase } from '../config/supabase'
import { Tables } from '../types/supabase-types'
import { useAuth } from "../contexts/AuthContext"
import { getDefaultAppState } from '../../packages/excalidraw/appState'
import { STORAGE_KEYS } from '../app_constants'
import { useAtom } from 'jotai'
import { sessionAtom, userAtom } from '../store/user'
import { appJotaiStore } from '../app-jotai'
import { projectAtom } from '../store/project'

interface ToastValues {
    type: string,
    message: string
}

export default function RecentProjects() {
    const navigate = useNavigate()
    const [user, setUser] = useAtom(userAtom);
    const [session, setSession] = useAtom(sessionAtom);
    const [projects, setProjects] = useState<Array<Tables<'projects'>>>([])
    const [toast, setToast] = useState<ToastValues | null>(null)
    const {signOut, loading} = useAuth()

    const getData = async () => {
        // console.log("USER in RECENT Projects: ", user)
        console.log("SESSION in RECENT Projects: ", session);
        let { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq("user", user?.id)
        if (projects) {
            setProjects(projects)
            console.log("Fetched Data: ", projects)
        }
        if (error) console.error('Error fetching data:', error)
    }

    const createEmptyCanvas = (): HTMLCanvasElement => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Failed to get canvas context");
        }

        canvas.width = 200;
        canvas.height = 300;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
    };

    const createNewProject = async () => {
        const newAppState = getDefaultAppState()
        const newProject = {
            user: session?.user?.id,
            title: "Untitled",
            data: {
                elements: [],
                appState: newAppState,
                files: []
            },
            thumbnail: createEmptyCanvas().toDataURL("image/png")
        };

        return await supabase.from("projects").insert([newProject]).select();
    }

    const handleNewDrawing = async () => {
        const newAppState = getDefaultAppState()

        createNewProject().then((data) => {
            localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(data.data ? data.data[0] : null))
            console.log("DATA: ", data.data ? data.data[0] : null)
            appJotaiStore.set(projectAtom, data.data ? data.data[0] : null)
            const currentProjectData = appJotaiStore.get(projectAtom)

            localStorage.setItem(`${STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS}-${currentProjectData?.id}`, JSON.stringify([]))
            localStorage.setItem(`${STORAGE_KEYS.LOCAL_STORAGE_APP_STATE}-${currentProjectData?.id}`, JSON.stringify(newAppState))

            console.log("New drawing created and saved.");
        }).catch((err) => {
            console.error("Error creating new project:", err.message);
        });
    };

    const handleImportDrawing = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".edraw";

        input.onchange = async (event: Event) => {
            const file = (event.target as HTMLInputElement)?.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async () => {
                const fileData = reader.result;

                try {
                    const importedData = JSON.parse(fileData as string);
                    const { error } = await supabase.from("projects").insert([
                        {
                            user: session?.user?.id,
                            title: file.name,
                            created_at: new Date().toISOString(),
                            data: {
                                elements: [],
                                appState: {},
                                files: importedData
                            },
                        },
                    ]);

                    if (error) {
                        console.error("Error importing drawing:", error.message);
                    } else {
                        console.log("Drawing imported successfully.");
                    }
                } catch (error) {
                    console.error("Error parsing file data:", error);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    useEffect(() => {
        getData()
        console.log("EXCALIDRAW: ", )
    }, [])

    const handleSignOut = async () => {
        signOut()
        if(!loading) {
            navigate("/login")
        }
    }

    return (
        <div className="h-screen bg-white p-6">
            {toast && (
                <div className={`fixed top-4 right-4 p-4 rounded-md z-50 ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                    {toast.message}
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl font-semibold">Recents</h1>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FiLogOut className="w-4 h-4" />
                        <span className="hidden md:inline">Sign out</span>
                    </button>
                </div>

                {/* New Creation Options */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    <Link to="/app/new" onClick={handleNewDrawing} className="group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <FiEdit2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">New eDraw</span>
                                    <span className="text-xs text-gray-500">New</span>
                                </div>
                                <p className="text-sm text-gray-500">Whiteboard</p>
                            </div>
                        </div>
                    </Link>

                    <button onClick={handleImportDrawing} className="group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-gray-500 rounded-lg">
                                <FiUpload className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Import</span>
                                </div>
                                <p className="text-sm text-gray-500">Bring in external files</p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Navigation and Filters */}
                <div className="sticky top-0 bg-white z-10 flex justify-between items-center mb-6 border-b">
                    <nav className="flex gap-6">
                        <button className="px-1 py-3 text-sm font-medium border-b-2 border-black">Recently viewed</button>
                        <button className="px-1 py-3 text-sm text-gray-500 hover:text-gray-900">Shared files</button>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                            All files
                            <FiChevronDown className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                            Last viewed
                            <FiChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Recent Projects Grid */}
                <div className="h-[calc(100vh-24rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] hover:pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 [&::-webkit-scrollbar]:hidden">
                        {projects.map((project, index) => (
                            <Link
                                key={project.id}
                                to={`/app/project/${project.id}`}
                                className="group"
                            >
                                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                                    <img
                                        src={project.thumbnail || undefined}
                                        alt={project.created_at}
                                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                    />
                                </div>
                                <h3 className="font-medium">{project.title}</h3>
                                <p className="text-sm text-gray-500">Edited {project.created_at}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
