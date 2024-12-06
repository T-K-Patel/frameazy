// NOTE: Prices should be in paisa (1/100 of a rupee)

export const GlazingPrice: Record<string, number> = {
	["UVGlass"]: 20,
	["Acrylic"]: 30,
	["MuseumGlass"]: 40,
	["NonGlareGlass"]: 50,
	["RegularGlass"]: 60,
};

export const BackingPrice: Record<string, number> = {
	["Cardboard"]: 40,
	["Foamcore"]: 20,
	["MDF"]: 60,
};

export const PrintingPrice: Record<string, number> = {
	["CanvasGSM"]: 60,
	["PaperGSM"]: 40,
};

export const SidesPrice: Record<string, number> = {
	["Black"]: 20,
	["Custom"]: 50,
	["Image"]: 30,
	["Mirror"]: 70,
	["White"]: 60,
};

export const StretchingPrice: Record<string, number> = {
	["FloatFrame"]: 30,
	["GalleryWrap"]: 40,
	["MuseumWrap"]: 60,
	["StretcherBar"]: 80,
};

export const MirrorPrice: Record<string, number> = {
	["Antique"]: 40,
	["Beveled"]: 50,
	["NonBeveled"]: 30,
	["Plain"]: 20,
};

export const MAT_PRICE = 6;
