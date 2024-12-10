import CustomizationDialog from "@/components/customizing/CustomizationDialog";
import React, { createContext, useState } from "react";

type TDialogContext = {
	openDialog: (frameId?: string) => void;
};

const DialogContext = createContext<TDialogContext>({ openDialog: () => {} });

export default function DialogProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<[boolean, string | undefined]>([false, undefined]);
	const openDialog = (frameId?: string) => {
		setState([true, frameId]);
	};
	const setDialogOpen = (_o: boolean) => {
		setState((s) => [_o, s[1]]);
	};

	return (
		<DialogContext.Provider value={{ openDialog }}>
			{children}
			<CustomizationDialog dialogOpen={state[0]} setDialogOpen={setDialogOpen} frameId={state[1]} />
		</DialogContext.Provider>
	);
}

export const useDialog = () => {
	return React.useContext(DialogContext);
};
