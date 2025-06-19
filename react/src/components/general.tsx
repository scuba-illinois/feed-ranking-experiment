import { ReactNode } from "react";

export const RedAsterisk = () => <span className="text-red-600">*</span>;

export function Header({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <h2 className={`font-bold text-[12pt] ${className}`}>{children}</h2>;
}

export function Body({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <p className={`text-gray-600 text-[10pt] ${className}`}>{children}</p>;
}

export const Email = ({ children }: { children: string }) => (
	<span className="text-blue-600">{children}</span>
);

export function Button({
	type = "button", // Default to "button" if not provided
	onClick = () => {}, // Default to an empty function if not provided
	children,
	disabled = false, // Default to false if not provided
	className = "", // Additional className prop
}: {
	type?: "button" | "submit" | "reset"; // Optional type prop for the button
	onClick?: () => void;
	disabled?: boolean; // Optional prop to disable the button
	children: React.ReactNode;
	className?: string; // Optional className prop for custom styles
}) {
	return (
		<button
			type={type}
			className={`px-4 py-2 rounded-md text-[10pt] ${
				!disabled
					? "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
					: "bg-gray-300 text-gray-500 cursor-not-allowed"
			} ${className}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
