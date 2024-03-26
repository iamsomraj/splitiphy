import { pgTable, serial, text, timestamp, boolean, date, decimal, integer } from 'drizzle-orm/pg-core';

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const groupMemberships = pgTable('group_memberships', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id')
    .references(() => groups.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  transaction_date: date('transaction_date').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const groupExpenses = pgTable('group_expenses', {
  id: serial('id').primaryKey(),
  expenseId: integer('expense_id')
    .references(() => transactions.id, { onDelete: 'cascade' })
    .notNull(),
  groupId: integer('group_id')
    .references(() => groups.id, { onDelete: 'cascade' })
    .notNull(),
  payerId: text('payer_id').notNull(),
  receiverId: text('receiver_id').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const groupUserBalances = pgTable('group_user_balances', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id')
    .references(() => groups.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id').notNull(),
  balance: decimal('balance', { precision: 10, scale: 2 }).notNull(),
  lastTransactionId: integer('last_transaction_id')
    .references(() => transactions.id)
    .notNull(),
  lastTransactionDate: date('last_transaction_date').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});
