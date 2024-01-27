import mysql, { Pool, ResultSetHeader } from "mysql2/promise";
import { User } from "../../types/User";

class DatabaseSingleton {
  private static instance: DatabaseSingleton;
  private pool: Pool;

  private constructor() {
    this.pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "00000000",
      database: "part",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 100,
    });
  }

  public static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  public async getQuery<T extends any>(sql: string, values?: any[]) {
    const connection = await this.pool.getConnection();

    try {
      const [results, fields] = await connection.query(sql, values);
      return results as T[] | [];
    } catch (error) {
      // console.log(error);
      throw error;
    } finally {
      connection.release();
    }
  }

  public async setQuery(sql: string, values?: any[]) {
    const connection = await this.pool.getConnection();

    try {
      const [results, fields] = await connection.query(sql, values);
      return results as ResultSetHeader;
    } catch (error) {
      // console.log(error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default DatabaseSingleton;
