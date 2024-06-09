export type RouletteItem = {
    id: number;
    name: string;
    probability: number;
};

export type RouletteConfig = {
    items: RouletteItem[];
    colors: string[];
};
