export enum Nations {
    Bastok = 'Republic of Bastok',
    Sandoria = 'Kingdom of San d\'Oria',
    Windurst = 'Federation of Windurst',
    Kazham = 'Kazham',
}

export interface Tod {
    id: string;
    timestamp: Date;
    nation: Nations;
}