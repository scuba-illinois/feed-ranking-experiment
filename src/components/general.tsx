import { ReactNode } from "react";

export function Header({ children }: { children: ReactNode }) {
	return <h2 className="font-bold text-[12pt]">{children}</h2>;
}

export function Body({ children }: { children: ReactNode }) {
	return <p className="text-gray-600 text-[10pt]">{children}</p>;
}

export function Button({
	type = "button", // Default to "button" if not provided
	onClick = () => {}, // Default to an empty function if not provided
	children,
	disabled = false, // Default to false if not provided
}: {
	type?: "button" | "submit" | "reset"; // Optional type prop for the button
	onClick?: () => void;
	disabled?: boolean; // Optional prop to disable the button
	children: React.ReactNode;
}) {
	return (
		<button
			type={type}
			className={`px-4 py-2 rounded-md text-[10pt] ${
				!disabled
					? "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
					: "bg-gray-300 text-gray-500 cursor-not-allowed"
			}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
