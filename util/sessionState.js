const SessionState = class SessionState {
  constructor() {
    this.clubs = {};
  }

  getClub(clubId) {
    if (!this.clubs[clubId]) {
      const club = {
        ellapsedSeconds: 0,
        members: [],
      };

      this.clubs[clubId] = club;
    }

    return this.clubs[clubId];
  }

  checkUserActive(checkMemberId, clubId) {
    return this.clubs[clubId].members.some(
      (memberId) => memberId.toString() === checkMemberId.toString()
    );
  }

  checkMemberIsFirst(checkMemberId, clubId) {
    return this.clubs[clubId].members[0] === checkMemberId;
  }

  addMember(memberId, clubId) {
    this.clubs[clubId].members.push(memberId);
    return this.clubs[clubId].members;
  }

  removeMember(checkMemberId, clubId) {
    const membersLeft = this.clubs[clubId].members.filter(
      (memberId) => memberId.toString() !== checkMemberId.toString()
    );

    this.clubs[clubId].members = membersLeft;
    return membersLeft;
  }

  updateSeconds(currentPosition, clubId) {
    let masterPlaytime = this.clubs[clubId].ellapsedSeconds;
    const wholeNumber = Math.floor(currentPosition);
    if (wholeNumber > masterPlaytime) {
      this.clubs[clubId].ellapsedSeconds = wholeNumber;
      return false;
    }

    const difference = masterPlaytime - wholeNumber;
    if (wholeNumber < masterPlaytime && difference > 2) {
      return masterPlaytime;
    }

    return null;
  }

  resetSeconds(clubId) {
    this.clubs[clubId].ellapsedSeconds = 0;
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
