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

export type ReconStatus = "matched" | "unmatched";

export interface LedgerEntry {
  id: string;
  tenantId: string;
  ref: string;
  description: string;
  amount: number;
  date: string;
  status: ReconStatus;
  matchedWith?: string; // bank entry id
}

export interface BankEntry {
  id: string;
  tenantId: string;
  ref: string;
  description: string;
  amount: number;
  date: string;
  status: ReconStatus;
  matchedWith?: string; // ledger entry id
}

interface DBShape {
  tenants: Tenant[];
  users: User[];
  transactions: Txn[];
  ledgerEntries: LedgerEntry[];
  bankEntries: BankEntry[];
}

const SAMPLE_STATEMENTS: Record<string, { ref: string; description: string; amount: number; date: string }[]> = {
  ahli: [
    { ref: "NAJ-4471", description: "AL-NAJDI TRADING TRSF", amount: 5230, date: "2026-07-08" },
    { ref: "POS-6612", description: "POS SETTLEMENT BATCH #6612", amount: 1180.5, date: "2026-07-08" },
    { ref: "-", description: "MONTHLY ACCOUNT MAINTENANCE FEE", amount: 75, date: "2026-07-09" },
  ],
  rajhi: [
    { ref: "INV-2026-011", description: "TAMKEEN CO SETTLEMENT RE INV-2026-011", amount: 9640, date: "2026-07-08" },
    { ref: "FIN-2291", description: "RAJHI FINANCE INSTALLMENT COLLECT", amount: 2500, date: "2026-07-09" },
    { ref: "-", description: "SMS BANKING SERVICE CHARGE", amount: 30, date: "2026-07-09" },
  ],
  upload: [
    { ref: "UPL-001", description: "معاملة مستوردة من الملف المرفوع", amount: 1250, date: "2026-07-10" },
    { ref: "UPL-002", description: "معاملة مستوردة من الملف المرفوع", amount: 640, date: "2026-07-10" },
  ],
};

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

  // ————— مطابقة الحسابات (ERP Ledger مقابل الكشف البنكي) —————

  listLedgerEntries(tenantId: string): LedgerEntry[] {
    return readDB()
      .ledgerEntries.filter((e) => e.tenantId === tenantId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  listBankEntries(tenantId: string): BankEntry[] {
    return readDB()
      .bankEntries.filter((e) => e.tenantId === tenantId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  reconciliationStats(tenantId: string) {
    const ledger = this.listLedgerEntries(tenantId);
    const bank = this.listBankEntries(tenantId);
    const unmatchedLedger = ledger.filter((e) => e.status === "unmatched");
    const unmatchedBank = bank.filter((e) => e.status === "unmatched");
    const matchedLedger = ledger.filter((e) => e.status === "matched");

    const differenceValue =
      unmatchedLedger.reduce((s, e) => s + e.amount, 0) +
      unmatchedBank.reduce((s, e) => s + e.amount, 0);
    const matchedValue = matchedLedger.reduce((s, e) => s + e.amount, 0);

    const totalEntries = ledger.length + bank.length;
    const matchedEntries = matchedLedger.length + bank.filter((e) => e.status === "matched").length;

    return {
      ledgerCount: ledger.length,
      bankCount: bank.length,
      unmatchedLedgerCount: unmatchedLedger.length,
      unmatchedBankCount: unmatchedBank.length,
      differenceValue,
      matchedValue,
      successRate: totalEntries ? Math.round((matchedEntries / totalEntries) * 100) : 0,
      matchedPairs: matchedLedger.length,
      totalPairs: Math.max(ledger.length, bank.length),
    };
  },

  autoMatchReconciliation(tenantId: string): number {
    const data = readDB();
    const ledger = data.ledgerEntries.filter((e) => e.tenantId === tenantId && e.status === "unmatched");
    const bank = data.bankEntries.filter((e) => e.tenantId === tenantId && e.status === "unmatched");
    const usedBank = new Set<string>();
    let count = 0;

    for (const l of ledger) {
      const candidate = bank.find(
        (b) => !usedBank.has(b.id) && Math.abs(b.amount - l.amount) < 0.01
      );
      if (!candidate) continue;
      usedBank.add(candidate.id);

      const lIdx = data.ledgerEntries.findIndex((e) => e.id === l.id);
      const bIdx = data.bankEntries.findIndex((e) => e.id === candidate.id);
      data.ledgerEntries[lIdx] = { ...data.ledgerEntries[lIdx], status: "matched", matchedWith: candidate.id };
      data.bankEntries[bIdx] = { ...data.bankEntries[bIdx], status: "matched", matchedWith: l.id };
      count++;
    }

    writeDB(data);
    return count;
  },

  resetReconciliation(tenantId: string) {
    const data = readDB();
    data.ledgerEntries = data.ledgerEntries.map((e) =>
      e.tenantId === tenantId ? { ...e, status: "unmatched", matchedWith: undefined } : e
    );
    data.bankEntries = data.bankEntries.map((e) =>
      e.tenantId === tenantId ? { ...e, status: "unmatched", matchedWith: undefined } : e
    );
    writeDB(data);
  },

  manualMatchReconciliation(tenantId: string, ledgerId: string, bankId: string): boolean {
    const data = readDB();
    const lIdx = data.ledgerEntries.findIndex((e) => e.id === ledgerId && e.tenantId === tenantId);
    const bIdx = data.bankEntries.findIndex((e) => e.id === bankId && e.tenantId === tenantId);
    if (lIdx === -1 || bIdx === -1) return false;
    data.ledgerEntries[lIdx] = { ...data.ledgerEntries[lIdx], status: "matched", matchedWith: bankId };
    data.bankEntries[bIdx] = { ...data.bankEntries[bIdx], status: "matched", matchedWith: ledgerId };
    writeDB(data);
    return true;
  },

  importSampleStatement(tenantId: string, sampleKey: string): number {
    const rows = SAMPLE_STATEMENTS[sampleKey];
    if (!rows) return 0;
    const data = readDB();
    const stamp = Date.now();
    rows.forEach((r, i) => {
      data.bankEntries.push({
        id: `bk_${stamp}_${i}`,
        tenantId,
        ref: r.ref,
        description: r.description,
        amount: r.amount,
        date: r.date,
        status: "unmatched",
      });
    });
    writeDB(data);
    return rows.length;
  },
};
