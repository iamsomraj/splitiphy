import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, boolean, date, decimal, integer } from 'drizzle-orm/pg-core';

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: text('owner_id').notNull(),
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
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  ownerId: text('owner_id').notNull(),
  payerId: text('payer_id').notNull(),
  receiverId: text('receiver_id').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  expenseDate: date('expense_date').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const expenseTransactions = pgTable('expense_transactions', {
  id: serial('id').primaryKey(),
  expenseId: integer('expense_id')
    .references(() => expenses.id, { onDelete: 'cascade' })
    .notNull(),
  transactionId: integer('transaction_id')
    .references(() => transactions.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const groupExpenses = pgTable('group_expenses', {
  id: serial('id').primaryKey(),
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

export const userBalances = pgTable('user_balances', {
  id: serial('id').primaryKey(),
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
