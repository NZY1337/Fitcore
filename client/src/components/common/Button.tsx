interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'glow';
    className?: string;
    [key: string]: any;
}

const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
    const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full text-sm px-6 py-3";
    const variants = {
        primary: "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.15)]",
        secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
        glow: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] border border-white/10",
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;