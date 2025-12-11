import { useAutosizeTextArea } from "@/hooks/useAutoResizeTextarea";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useImperativeHandle } from "react";

export type AutosizeTextAreaRef = {
	textArea: HTMLTextAreaElement;
	maxHeight: number;
	minHeight: number;
	focus: () => void;
};

type AutosizeTextAreaProps = {
	maxHeight?: number;
	minHeight?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutosizeTextarea = React.forwardRef<
	AutosizeTextAreaRef,
	AutosizeTextAreaProps
>(
	(
		{
			maxHeight = Number.MAX_SAFE_INTEGER,
			minHeight = 52,
			className,
			onChange,
			value,
			...props
		}: AutosizeTextAreaProps,
		ref: React.Ref<AutosizeTextAreaRef>
	) => {
		const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
		const [triggerAutoSize, setTriggerAutoSize] = React.useState("");

		useAutosizeTextArea({
			textAreaRef,
			triggerAutoSize: triggerAutoSize,
			maxHeight,
			minHeight,
		});

		useImperativeHandle(ref, () => ({
			textArea: textAreaRef.current as HTMLTextAreaElement,
			focus: () => textAreaRef?.current?.focus(),
			maxHeight,
			minHeight,
		}));

		React.useEffect(() => {
			setTriggerAutoSize(value as string);
		}, [props?.defaultValue, value]);

		return (
			<textarea
				spellCheck={"false"}
				{...props}
				value={value}
				ref={textAreaRef}
				className={cn("flex w-full px-3 py-2 text-center", className)}
				onChange={(e) => {
					setTriggerAutoSize(e.target.value);
					onChange?.(e);
				}}
			/>
		);
	}
);
AutosizeTextarea.displayName = "AutosizeTextarea";
