import fs from "fs";
import path from "path";

// طبقة بيانات بسيطة تعتمد على ملف JSON، تكفي للتجربة والتطوير المحلي.
// في بيئة إنتاج حقيقية استبدلها بقاعدة بيانات فعلية (PostgreSQL عبر Prisma مثلاً).

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export type Role = "user" | "admin";

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export interface Tenant {
  id: string;
  name: string;
  plan: string;
  branches: number;
}

export type TxnStatus = "matched" | "exception";

export interface Txn {
  id: string;
  tenantId: string;
  source: string;
  branch: string;
  amount: number;
  status: TxnStatus;
  matchedWith?: string;
  note?: string;
  date: string;
}

interface DBShape {
  tenants: Tenant[];
  users: User[];
  transactions: Txn[];
}

function readDB(): DBShape {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data: DBShape) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  getUserByEmail(email: string): User | undefined {
    return readDB().users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  },
  getTenant(id: string): Tenant | undefined {
    return readDB().tenants.find((t) => t.id === id);
  },
  listTenants(): Tenant[] {
    return readDB().tenants;
  },
  listTransactions(tenantId: string): Txn[] {
    return readDB()
      .transactions.filter((t) => t.tenantId === tenantId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  },
  listAllTransactions(): Txn[] {
    return readDB().transactions;
  },
  updateTransaction(id: string, patch: Partial<Txn>): Txn | null {
    const data = readDB();
    const idx = data.transactions.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    data.transactions[idx] = { ...data.transactions[idx], ...patch };
    writeDB(data);
    return data.transactions[idx];
  },
  stats() {
    const data = readDB();
    const matched = data.transactions.filter((t) => t.status === "matched").length;
    const total = data.transactions.length;
    return {
      tenants: data.tenants.length,
      users: data.users.length,
      transactions: total,
      matched,
      exceptions: total - matched,
      matchRate: total ? Math.round((matched / total) * 100) : 0,
    };
  },
  tenantStats(tenantId: string) {
    const txns = this.listTransactions(tenantId);
    const matched = txns.filter((t) => t.status === "matched").length;
    return {
      total: txns.length,
      matched,
      exceptions: txns.length - matched,
      matchRate: txns.length ? Math.round((matched / txns.length) * 100) : 0,
    };
  },
};
