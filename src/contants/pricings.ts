
import { Glazing, Backing, Printing, Sides, Mirror, Stretching } from "@prisma/client";


// NOTE: Prices should be in paisa (1/100 of a rupee)

export const GlazingPrice: Record<Glazing, number> = {
    [Glazing.UVGlass]: 20,
    [Glazing.Acrylic]: 30,
    [Glazing.MuseumGlass]: 40,
    [Glazing.NonGlareGlass]: 50,
    [Glazing.RegularGlass]: 60
};

export const BackingPrice: Record<Backing, number> = {
    [Backing.Cardboard]: 40,
    [Backing.Foamcore]: 20,
    [Backing.MDF]: 60
}

export const PrintingPrice: Record<Printing, number> = {
    [Printing.CanvasGSM]: 60,
    [Printing.PaperGSM]: 40
}

export const SidesPrice: Record<Sides, number> = {
    [Sides.Black]: 20,
    [Sides.Custom]: 50,
    [Sides.Image]: 30,
    [Sides.Mirror]: 70,
    [Sides.White]: 60
}

export const StretchingPrice: Record<Stretching, number> = {
    [Stretching.FloatFrame]: 30,
    [Stretching.GalleryWrap]: 40,
    [Stretching.MuseumWrap]: 60,
    [Stretching.StretcherBar]: 80
}

export const MirrorPrice: Record<Mirror, number> = {
    [Mirror.Antique]: 40,
    [Mirror.Beveled]: 50,
    [Mirror.NonBeveled]: 30,
    [Mirror.Plain]: 20
}

export const MAT_PRICE = 6;