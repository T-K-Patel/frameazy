export type FrameDataType = {
	id: string;
	name: string;
	variants: {
		borderWidth: number;
		unit_price: number;
	}[];
	image: string;
	borderSrc: string;
	color: string;
	collection: string;
	category: string;
};

export type FramesFilterType = {
	categories: string[];
	collections: string[];
	colors: string[];
	name: string;
};
