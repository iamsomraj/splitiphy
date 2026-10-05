const paths = {
  home() {
    return '/';
  },
  getStarted() {
    return '/get-started';
  },
  dashboard() {
    return '/dashboard';
  },
  groupShow(uuid: string | null) {
    return `/groups/${uuid}`;
  },
  groupUserSearch(groupUuid: string | null, term: string | null) {
    return `/groups/${groupUuid}/search?term=${encodeURIComponent(term || '')}`;
  },
  groupAddNewExpense(groupUuid: string | null) {
    return `/groups/${groupUuid}/expenses/new`;
  },
  groupEditExpense(groupUuid: string | null, groupExpenseUuid: string | null) {
    return `/groups/${groupUuid}/expenses/${groupExpenseUuid}/edit`;
  },
  groupExportCsv(groupUuid: string | null) {
    return `/groups/${groupUuid}/export`;
  },
  groupInvite(inviteToken: string) {
    return `/invite/${inviteToken}`;
  },
  settings() {
    return '/settings';
  },
  terms() {
    return '/terms';
  },
  privacy() {
    return '/privacy';
  },
};

export default paths;
