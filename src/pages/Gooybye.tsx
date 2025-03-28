export function Goodbye() {
	return (
		<div className="p-4 flex flex-col items-center justify-center min-h-screen">
			<div className="text-left max-w-md flex flex-col gap-4">
				<h2 className="text-[12pt] font-semibold">
					Thank you for participating!
				</h2>
				<p className="text-[10pt] leading-relaxed">
					Your responses have been recorded. If you have any questions or need
					further information, please feel free to reach out.
				</p>
				<p className="text-[10pt]">Have a great day!</p>
			</div>
		</div>
	);
}
