import { relations, sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  date,
  decimal,
  integer,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uuid: uuid('uuid').default(sql`gen_random_uuid()`),
  username: text('username'),
  email: text('user_email').notNull(),
  phone: text('user_phone'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  profileImage: text('profile_image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  groups: many(groups),
  groupMemberships: many(groupMemberships),
  userBalances: many(userBalances),
  expenses: many(expenses),
  ownedTransactions: many(transactions, {
    relationName: 'owner',
  }),
  paidTransactions: many(transactions, { relationName: 'payer' }),
  receivedTransactions: many(transactions, { relationName: 'receiver' }),
}));

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const groupsRelations = relations(groups, ({ many, one }) => ({
  owner: one(users, {
    fields: [groups.ownerId],
    references: [users.id],
  }),
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
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const groupMembershipsRelations = relations(
  groupMemberships,
  ({ one }) => ({
    user: one(users, {
      fields: [groupMemberships.userId],
      references: [users.id],
    }),
    group: one(groups, {
      fields: [groupMemberships.groupId],
      references: [groups.id],
    }),
  }),
);

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  expenseDate: date('expense_date').notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const expensesRelations = relations(expenses, ({ many, one }) => ({
  groupExpenses: many(groupExpenses),
  transactions: many(transactions),
  owner: one(users, {
    fields: [expenses.ownerId],
    references: [users.id],
  }),
}));

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').default(sql`gen_random_uuid()`),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  payerId: text('payer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expenseId: integer('expense_id')
    .references(() => expenses.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  owner: one(users, {
    fields: [transactions.ownerId],
    references: [users.id],
    relationName: 'owner',
  }),
  payer: one(users, {
    fields: [transactions.payerId],
    references: [users.id],
    relationName: 'payer',
  }),
  receiver: one(users, {
    fields: [transactions.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
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
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  balance: decimal('balance', { precision: 10, scale: 2 }).notNull(),
  lastExpenseId: integer('last_expense_id').references(() => expenses.id, {
    onDelete: 'cascade',
  }),
  lastExpenseDate: date('last_expense_date'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

export const userBalancesRelations = relations(userBalances, ({ one }) => ({
  user: one(users, {
    fields: [userBalances.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [userBalances.groupId],
    references: [groups.id],
  }),
  lastExpense: one(expenses, {
    fields: [userBalances.lastExpenseId],
    references: [expenses.id],
  }),
}));
