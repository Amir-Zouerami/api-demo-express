export interface Mysql2Error {
  code: string;
  errno: number;
  sql: string;
  sqlState: string;
  sqlMessage: string;
}
