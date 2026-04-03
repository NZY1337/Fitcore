interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
}

const GradientText = ({ children, className = '' }: GradientTextProps) => (
    <span className={`text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 ${className}`}>
        {children}
    </span>
);

export default GradientText;