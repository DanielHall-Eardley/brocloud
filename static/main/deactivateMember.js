function deactivateMember(userId) {
  const ul = document.querySelector(".main--squad-list");
  const children = ul.getElementsByTagName("li");

  for (let clubMember of children) {
    const activityIndicator = clubMember.getElementsByTagName("span")[1];
    const clubMemberId = clubMember.id;
    if (userId.toString() === clubMemberId.toString()) {
      activityIndicator.className = "u--red-circle";
    }
  }
}

export default deactivateMember;
