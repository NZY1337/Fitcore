type AlertProps = {
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
};

export default function Alert({ variant, title, message }: AlertProps) {
    const styles = {
        success: "bg-success-50 border-success-300 text-success-700 dark:bg-success-500/15 dark:border-success-500/30 dark:text-success-400",
        error: "bg-error-50 border-error-300 text-error-700 dark:bg-error-500/15 dark:border-error-500/30 dark:text-error-400",
        warning: "bg-warning-50 border-warning-300 text-warning-700 dark:bg-warning-500/15 dark:border-warning-500/30 dark:text-warning-400",
        info: "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-500/15 dark:border-blue-500/30 dark:text-blue-400",
    };

    return (
        <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}>
            <span className="font-semibold">{title}: </span>
            {message}
        </div>
    );
}
