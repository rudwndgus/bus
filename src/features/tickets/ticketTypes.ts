export interface Ticket {
  id: string;
  zones: number;
  region: "INTRASTATE" | "INTERSTATE";
  route: string;
  expiry: string;
  status: "unused" | "preview" | "used";
}
