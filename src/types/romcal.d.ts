declare module "romcal" {
  export interface RomcalLiturgicalColor {
    key: string;
    value: string;
  }

  export interface RomcalSeason {
    key: string;
    value: string;
  }

  export interface RomcalDate {
    moment: string;
    key: string;
    name: string;
    type: string;
    data?: {
      season?: RomcalSeason;
      meta?: {
        liturgicalColor?: RomcalLiturgicalColor;
      };
    };
  }

  export function calendarFor(options: {
    year: number;
    country?: string;
    locale?: string;
  }): RomcalDate[];
}
