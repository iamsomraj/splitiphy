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
    return `/groups/${groupUuid}/search?term=${term}`;
  },
  groupAddNewExpense(groupUuid: string | null) {
    return `/groups/${groupUuid}/expenses/new`;
  },
  settings() {
    return '/settings';
  },
};

export default paths;
