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
  settings() {
    return '/settings';
  },
  account() {
    return '/account';
  },
};

export default paths;
