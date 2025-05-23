const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
            {children}
        </div>
    )
}

export default AuthLayout