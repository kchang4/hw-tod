export enum Nations {
    Bastok = 'Republic of Bastok',
    Sandoria = 'Kingdom of San d\'Oria',
    Windurst = 'Federation of Windurst',
    Kazham = 'Kazham',
}

interface DbRecord {
    id: number;
    created_by: string;
    created_on: number;
}

export interface TodRaw extends DbRecord {
    tod_timestamp: number;
    nation: Nations;
    count: number;
}

export class Tod {
    id: number
    timestamp: Date
    nation: Nations
    created_by: string
    created_on: Date
    count: number

    constructor({ id, tod_timestamp, nation, count, created_by, created_on }: TodRaw) {
        this.id = id
        this.timestamp = new Date(tod_timestamp)
        this.nation = nation
        this.count = count
        this.created_by = created_by
        this.created_on = new Date(created_on)
    }

    static fromDb(rawTod: TodRaw) {
        return new Tod(rawTod)
    }
}
