const paths = {
  home() {
    return '/';
  },
  signIn() {
    return '/sign-in';
  },
  signUp() {
    return '/sign-up';
  },
  groups() {
    return '/groups';
  },
  groupShow(uuid: string | null) {
    return `/groups/${uuid}`;
  },
  groupUserSearch(groupUuid: string | null, term: string | null) {
    return `/groups/${groupUuid}/search?term=${term}`;
  },
};

export default paths;
