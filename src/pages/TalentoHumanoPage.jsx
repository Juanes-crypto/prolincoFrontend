// frontend/src/pages/TalentoHumanoPage.jsx (VERSIÓN CORREGIDA)

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import {
    UsersIcon,
    LinkIcon,
    DocumentTextIcon,
    PencilIcon,
    BuildingOfficeIcon,
    MapIcon,
    UserCircleIcon,
    BookOpenIcon,
    AcademicCapIcon,
    ChartBarIcon,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthProvider';
import EditableField from '../components/EditableField';
import EditModal from '../components/EditModal';

const TOOL_STRUCTURE = [
    { name: 'Organigrama', key: 'Organigrama', icon: BuildingOfficeIcon, description: 'Estructura organizacional y relaciones jerárquicas', category: 'Estructura', color: 'from-blue-500 to-cyan-500' },
    { name: 'Mapa de Procesos', key: 'Mapa de Procesos', icon: MapIcon, description: 'Flujos de trabajo y procedimientos operativos', category: 'Procesos', color: 'from-green-500 to-emerald-500' },
    { name: 'Perfil del Empleado', key: 'Perfil del Empleado', icon: UserCircleIcon, description: 'Competencias y responsabilidades por cargo', category: 'Gestión', color: 'from-purple-500 to-indigo-500' },
    { name: 'Manual del Empleado', key: 'Manual del Empleado', icon: BookOpenIcon, description: 'Políticas, normas y cultura organizacional', category: 'Documentación', color: 'from-orange-500 to-amber-500' },
    { name: 'Proceso de Inducción', key: 'Proceso de Inducción', icon: AcademicCapIcon, description: 'Onboarding y adaptación de nuevo personal', category: 'Desarrollo', color: 'from-teal-500 to-blue-500' },
    { name: 'Proceso de Capacitación', key: 'Proceso de Capacitación', icon: ChartBarIcon, description: 'Plan de formación y desarrollo de competencias', category: 'Desarrollo', color: 'from-pink-500 to-rose-500' },
];

const CATEGORIES_CONFIG = {
    'Estructura': { icon: BuildingOfficeIcon, color: 'border-blue-200 bg-blue-50', accent: 'text-blue-700' },
    'Procesos': { icon: MapIcon, color: 'border-green-200 bg-green-50', accent: 'text-green-700' },
    'Gestión': { icon: UserCircleIcon, color: 'border-purple-200 bg-purple-50', accent: 'text-purple-700' },
    'Documentación': { icon: BookOpenIcon, color: 'border-orange-200 bg-orange-50', accent: 'text-orange-700' },
    'Desarrollo': { icon: AcademicCapIcon, color: 'border-teal-200 bg-teal-50', accent: 'text-teal-700' }
};

const mapToolsWithData = (tools, data) => tools.map(tool => ({
    ...tool,
    url: data[tool.key] || '#',
    isConfigured: !!(data[tool.key] && data[tool.key] !== '#')
}));

const TalentoHumanoPage = ({ data = {}, refetch }) => {
    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

    const diagnostic = data.diagnostic || '';
    const specificObjective = data.specificObjective || '';
    
    const [editingUrl, setEditingUrl] = useState({ toolName: null, toolKey: null, url: '' });
    const [talentTools, setTalentTools] = useState([]);

    // ✨ CORRECCIÓN 1: Usar JSON.stringify para una comparación de dependencia estable
    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setTalentTools(mapToolsWithData(TOOL_STRUCTURE, data));
        } else {
            setTalentTools(mapToolsWithData(TOOL_STRUCTURE, {}));
        }
    }, [JSON.stringify(data)]);

    const toolsByCategory = talentTools.reduce((acc, tool) => {
        const category = tool.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(tool);
        return acc;
    }, {});

    const startUrlEdit = (toolName, toolKey, currentUrl) => {
        setEditingUrl({ toolName, toolKey, url: currentUrl || '' });
    };

    const handleUrlUpdate = (updatedData) => {
        if (updatedData && typeof updatedData === 'object') {
            const key = Object.keys(updatedData)[0];
            const newUrl = updatedData[key];
            setTalentTools(prev =>
                prev.map(t => (t.key === key ? { ...t, url: newUrl, isConfigured: !!newUrl && newUrl !== '#' } : t))
            );
        }
        setEditingUrl({ toolName: null, toolKey: null, url: '' });
        if (refetch) refetch();
    };

    const closeModal = () => {
        setEditingUrl({ toolName: null, toolKey: null, url: '' });
    };

    const renderToolCard = (tool) => {
        const CategoryIcon = CATEGORIES_CONFIG[tool.category]?.icon || DocumentTextIcon;
        return (
            <Card
                key={`${tool.key}-${tool.name}`}
                title={tool.name}
                icon={tool.icon}
                padding="p-5"
                className="group relative overflow-hidden h-full flex flex-col"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="flex-1 flex flex-col">
                    <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <CategoryIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{tool.category}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
                    </div>
                    <div className="mb-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${tool.isConfigured ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                            {tool.isConfigured ? (<><CheckCircleIcon className="h-3 w-3" /><span>URL Configurada</span></>) : (<><ExclamationCircleIcon className="h-3 w-3" /><span>URL Pendiente</span></>)}
                        </div>
                    </div>
                    <div className="mt-auto space-y-3">
                        <a href={tool.isConfigured ? tool.url : '#'} target="_blank" rel="noopener noreferrer" className={`w-full inline-flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${tool.isConfigured ? 'bg-prolinco-secondary text-white border-prolinco-secondary hover:bg-prolinco-primary hover:border-prolinco-primary hover:shadow-lg hover:scale-[1.02]' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`} onClick={!tool.isConfigured ? (e) => e.preventDefault() : undefined}>
                            <div className="flex items-center space-x-2"><LinkIcon className="h-4 w-4" /><span className="font-semibold text-sm">{tool.isConfigured ? 'Abrir Documento' : 'No Configurado'}</span></div>
                            {tool.isConfigured && (<ArrowTopRightOnSquareIcon className="h-4 w-4 opacity-80" />)}
                        </a>
                        {isAdmin && (
                            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); startUrlEdit(tool.name, tool.key, tool.url); }} className="w-full inline-flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-prolinco-primary font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 group">
                                <PencilIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                {tool.isConfigured ? 'Cambiar URL' : 'Configurar URL'}
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    const CategorySection = ({ category, tools }) => {
        const categoryConfig = CATEGORIES_CONFIG[category];
        const CategoryIcon = categoryConfig?.icon || DocumentTextIcon;
        return (
            <section key={category} className="mb-10">
                <div className={`rounded-2xl border-2 ${categoryConfig.color} p-6 mb-6`}>
                    <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${categoryConfig.accent} bg-white shadow-sm`}><CategoryIcon className="h-6 w-6" /></div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-gray-800">{category}</h3>
                            <p className="text-gray-600">{tools.length} herramienta{tools.length !== 1 ? 's' : ''} de {category.toLowerCase()}</p>
                        </div>
                        <div className="text-right">
                            <div className={`text-lg font-bold ${categoryConfig.accent}`}>{tools.filter(t => t.isConfigured).length}/{tools.length}</div>
                            <div className="text-sm text-gray-500">Configuradas</div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (<div key={`${tool.key}-${index}-${category}`}>{renderToolCard(tool)}</div>))}
                </div>
            </section>
        );
    };

    return (
        <div className="animate-fadeIn relative">
            <EditModal 
                type="url"
                section="talento"
                editingData={{
                    toolName: editingUrl.toolName,
                    toolKey: editingUrl.toolKey,
                    url: editingUrl.url,
                    field: editingUrl.toolKey
                }}
                onComplete={handleUrlUpdate}
                onClose={closeModal}
            />
            <header className="mb-10">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-prolinco-primary/10 rounded-xl"><UsersIcon className="h-8 w-8 text-prolinco-primary" /></div>
                    <div>
                        <h1 className="text-3xl font-black text-prolinco-dark">Talento Humano</h1>
                        <p className="text-gray-600 text-lg">Gestión integral de recursos humanos y desarrollo organizacional</p>
                    </div>
                </div>
                {/* ... resto del header ... */}
            </header>
            <section className="mb-12">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-2 h-8 bg-prolinco-primary rounded-full"></div>
                            <h3 className="text-xl font-bold text-prolinco-dark">Diagnóstico Actual</h3>
                        </div>
                        <EditableField
                            initialContent={diagnostic}
                            section="talento" // ✨ CORRECCIÓN 2: Usar la clave de la API
                            subsection="diagnostic"
                            onUpdate={refetch}
                        />
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-2 h-8 bg-prolinco-secondary rounded-full"></div>
                            <h3 className="text-xl font-bold text-prolinco-dark">Objetivo Específico</h3>
                        </div>
                        <EditableField
                            initialContent={specificObjective}
                            section="talento" // ✨ CORRECCIÓN 3: Usar la clave de la API
                            subsection="specificObjective"
                            onUpdate={refetch}
                        />
                    </div>
                </div>
            </section>
            <section>
                {/* ... resto de la sección ... */}
                {Object.keys(toolsByCategory).map(category => (
                    <CategorySection
                        key={category}
                        category={category}
                        tools={toolsByCategory[category]}
                    />
                ))}
            </section>
        </div>
    );
};

export default TalentoHumanoPage;