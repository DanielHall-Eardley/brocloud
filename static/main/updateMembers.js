function updateMembers (members) {
  const ul = document.querySelector('.main--squad-list');
  const children = ul.getElementsByTagName('li')

  members.forEach(memberId => {
    for (let member of children ) {
      if (member.id.toString() === memberId.toString()) {
        const memberChildren = member.getElementsByTagName('span')
        memberChildren[1].className = 'u--green-circle';
      }
    }
  });
}

export default updateMembers;