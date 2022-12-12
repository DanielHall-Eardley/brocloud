const SessionState = class SessionState {
  constructor() {
    this.clubs = {};
  }

  getClub(clubId) {
    if (!this.clubs[clubId]) {
      const club = {
        members: [],
      };

      this.clubs[clubId] = club;
    }

    return this.clubs[clubId];
  }

  addMember(memberId, clubId) {
    const checkMember = this.clubs[clubId].members.includes(memberId);
    if (!checkMember) {
      this.clubs[clubId].members.push(memberId);
    }
    return this.clubs[clubId].members;
  }

  removeMember(checkMemberId, clubId) {
    const membersLeft = this.clubs[clubId].members.filter(
      (memberId) => memberId.toString() !== checkMemberId.toString()
    );

    this.clubs[clubId].members = membersLeft;
    return membersLeft;
  }

  state(clubId) {
    return this.clubs[clubId];
  }
};

const initSession = (() => {
  let Session;

  return () => {
    if (!Session) {
      Session = new SessionState();
      return Session;
    }

    return Session;
  };
})();

module.exports = initSession;
