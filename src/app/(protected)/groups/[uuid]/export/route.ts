import { getGroupDetailsById, getLoggedInUser } from '@/db/queries';
import constants from '@/lib/constants';
import { toCsv } from '@/lib/csv';
import { auth } from '@clerk/nextjs/server';
import { format } from 'date-fns';

const fullName = (user: { firstName: string; lastName: string }) =>
  `${user.firstName} ${user.lastName}`.trim();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { uuid } = await params;
  // getGroupDetailsById returns null unless the caller is a group member.
  const [group, user] = await Promise.all([
    getGroupDetailsById(uuid),
    getLoggedInUser(),
  ]);

  if (!group) {
    return new Response('Group not found', { status: 404 });
  }

  const currency = user?.currency || 'INR';
  const categoryName = (key: string | null) =>
    constants.expensesCategories.find((category) => category.key === key)
      ?.name || 'Other';

  const rows = [
    [
      'Date',
      'Name',
      'Category',
      'Description',
      'Total Amount',
      'Currency',
      'Added By',
      'Type',
      'Paid By',
      'Paid For',
      'Share',
    ],
    ...group.groupExpenses.flatMap(({ expense, isSystemGenerated }) =>
      expense.transactions.map((transaction) => [
        format(expense.date, 'yyyy-MM-dd'),
        expense.name,
        categoryName(expense.category),
        expense.description,
        expense.amount,
        currency,
        fullName(expense.owner),
        isSystemGenerated ? 'Settlement' : 'Expense',
        fullName(transaction.payer),
        fullName(transaction.receiver),
        transaction.amount,
      ]),
    ),
  ];

  const fileName = `${group.name.replace(/[^\w-]+/g, '-').toLowerCase()}-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;

  return new Response(toCsv(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  });
}
