import Image from 'next/image';

export const Logo = () => {
    return (
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xl">P</span>
            </div>
            <div>
                <h2 className="text-white font-bold text-xl">
                    Platzi
                </h2>
                <p className="text-slate-400 text-sm">
                    LMS San Pablo
                </p>
            </div>
        </div>
    )
}