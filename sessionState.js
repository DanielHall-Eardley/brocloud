const SessionState = class SessionState {
  constructor () {
    this.clubs = {}
  }

  getClub(clubId) {
    if (!this.clubs[clubId]) {
      const club = {
        ellapsedSeconds: 0,
        members: []
      };

      this.clubs[clubId] = club;
    };

    return this.clubs[clubId];
  }

  checkUserActive(checkMemberId, clubId) {
    return this.clubs[clubId].members.some(
      memberId => memberId.toString() === checkMemberId.toString()
    )
  }

  addMember(memberId, clubId) {
    this.clubs[clubId].members.push(memberId);
    return this.clubs[clubId].members
  }

  removeMember(checkMemberId, clubId) {
    const removeMember = this.clubs[clubId].members.filter(
      memberId => memberId.toString() === checkMemberId.toString()
    );
    
    this.clubs[clubId].members = removeMember;
    return removeMember;
  }

  updateSeconds(seconds, userId, clubId) {
    if (this.clubs[clubId].members[0].toString() === userId.toString()) {
      this.clubs[clubId].ellapsedSeconds = seconds;
    }

    return this.clubs[clubId].ellapsedSeconds;
  }

  resetSeconds(clubId) {
    this.clubs[clubId].ellapsedSeconds = 0;
  }

  state(clubId) {
    return this.clubs[clubId];
  }
};

module.exports = new SessionState();