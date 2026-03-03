import { ChevronLeft, Home, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/lib/auth';

interface Breadcrumb {
    label: string;
    onClick: () => void;
}

interface HeaderProps {
    breadcrumbs: Breadcrumb[];
    onBack: () => void;
    canBack: boolean;
    onHome: () => void;
    user: User;
    onLogout: () => void;
}

export function Header({ breadcrumbs, onBack, canBack, onHome, user, onLogout }: HeaderProps) {
    return (
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-card/80">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onBack}
                        disabled={!canBack}
                        className={cn(
                            "p-2 rounded-lg hover:bg-muted transition-colors",
                            !canBack && "opacity-30 cursor-not-allowed"
                        )}
                        title="Zurück"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onHome}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Home"
                    >
                        <Home className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex items-center text-sm font-medium text-muted-foreground whitespace-nowrap overflow-x-auto no-scrollbar">
                    {breadcrumbs.map((bc, i) => (
                        <div key={i} className="flex items-center">
                            {i > 0 && <ChevronRight className="h-4 w-4 mx-2 text-slate-300" />}
                            <button
                                onClick={bc.onClick}
                                className={cn(
                                    "hover:text-foreground transition-colors py-1 px-2 rounded-md",
                                    i === breadcrumbs.length - 1 && "text-foreground font-bold bg-slate-100"
                                )}
                            >
                                {bc.label}
                            </button>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end mr-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">{user.name}</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{user.role}</span>
                </div>
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-primary border shadow-sm">
                    <UserIcon className="h-5 w-5" />
                </div>
                <button
                    onClick={onLogout}
                    className="p-2 ml-2 h-10 w-10 bg-slate-100 rounded-xl border flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
                    title="Abmelden"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
