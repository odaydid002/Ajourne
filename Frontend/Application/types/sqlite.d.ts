export type SQLiteTransaction = {
  executeSql: (
    sql: string,
    params?: any[],
    success?: (tx: SQLiteTransaction, result: any) => void,
    error?: (tx: SQLiteTransaction, err: any) => boolean
  ) => void;
};

export type SQLiteDB = {
  transaction: (callback: (tx: SQLiteTransaction) => void) => void;
};
