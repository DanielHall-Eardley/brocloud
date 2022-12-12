function updateMembers(activeUserIds) {
  const ul = document.querySelector(".main--squad-list");
  const children = ul.getElementsByTagName("li");
  for (let clubMember of children) {
    const activityIndicator = clubMember.getElementsByTagName("span")[1];
    const clubMemberId = clubMember.id;
    const activeUser = activeUserIds.includes(clubMemberId);
    if (activeUser) {
      activityIndicator.className = "u--green-circle";
    } else {
      activityIndicator.className = "u--red-circle";
    }
  }
}

export default updateMembers;
