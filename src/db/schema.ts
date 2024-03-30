import { relations, sql } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, boolean, date, decimal, integer, uuid } from 'drizzle-orm/pg-core';

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  ownerId: text('owner_id').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  groupMemberships: many(groupMemberships),
  groupExpenses: many(groupExpenses),
  userBalances: many(userBalances),
}));

export const groupMemberships = pgTable('group_memberships', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').default(sql`gen_random_uuid()`),
  groupId: integer('group_id')
    .references(() => groups.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const groupMembershipsRelations = relations(groupMemberships, ({ one }) => ({
  group: one(groups, {
    fields: [groupMemberships.groupId],
    references: [groups.id],
  }),
}));

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  expenseDate: date('expense_date').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const expensesRelations = relations(expenses, ({ many }) => ({
  groupExpenses: many(groupExpenses),
  transactions: many(transactions),
}));

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').default(sql`gen_random_uuid()`),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  ownerId: text('owner_id').notNull(),
  payerId: text('payer_id').notNull(),
  receiverId: text('receiver_id').notNull(),
  expenseId: integer('expense_id')
    .references(() => expenses.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  expense: one(expenses, {
    fields: [transactions.expenseId],
    references: [expenses.id],
  }),
}));

export const groupExpenses = pgTable('group_expenses', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').default(sql`gen_random_uuid()`),
  expenseId: integer('expense_id')
    .references(() => expenses.id, { onDelete: 'cascade' })
    .notNull(),
  groupId: integer('group_id')
    .references(() => groups.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const groupExpensesRelations = relations(groupExpenses, ({ one }) => ({
  group: one(groups, {
    fields: [groupExpenses.groupId],
    references: [groups.id],
  }),
  expense: one(expenses, {
    fields: [groupExpenses.expenseId],
    references: [expenses.id],
  }),
}));

export const userBalances = pgTable('user_balances', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').default(sql`gen_random_uuid()`),
  groupId: integer('group_id')
    .references(() => groups.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id').notNull(),
  balance: decimal('balance', { precision: 10, scale: 2 }).notNull(),
  lastExpenseId: integer('last_expense_id').references(() => expenses.id, { onDelete: 'cascade' }),
  lastExpenseDate: date('last_expense_date'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const userBalancesRelations = relations(userBalances, ({ one }) => ({
  group: one(groups, {
    fields: [userBalances.groupId],
    references: [groups.id],
  }),
  lastExpense: one(expenses, {
    fields: [userBalances.lastExpenseId],
    references: [expenses.id],
  }),
}));
