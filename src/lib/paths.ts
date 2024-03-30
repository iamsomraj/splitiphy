const paths = {
  home() {
    return '/';
  },
  groups() {
    return '/groups';
  },
  groupShow(uuid: string) {
    return `/groups/${uuid}`;
  },
};

export default paths;
