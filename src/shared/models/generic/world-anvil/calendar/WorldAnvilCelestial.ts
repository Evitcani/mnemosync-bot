export interface WorldAnvilCelestial {
    name: string;
    cycle: string;
    shift: string;
    icon: string;
    color: string;
    classes: string;
    desc: string;
    phaseNames: {
        new: string,
        young: string,
        waxingCrescent: string,
        waxingQuarter: string,
        waxingGibbous: string,
        full: string,
        waningGibbous: string,
        waningQuarter: string,
        waningCrescent: string,
        old: string
    };
    showPhases: boolean;
}