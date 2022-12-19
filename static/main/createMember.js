import { createHTMLComponent } from "../../util/createHTMLComponent";

{
  /* <li id="<%= member._id %>">
<span>
  <%= member.firstName %>
  <q> <%= member.nickName %></q>
  <%= member.lastName %>
</span>
<% if (member.active) { %>
<span class="u--green-circle"></span>
<% } else { %>
<span class="u--red-circle"></span>
<% } %>
</li> */
}

/* {
  name: "html element",
  attributes: 
    { attName: attValue }
  content: "inner text"
  children: [
    repeat Object
  ]
} */

function createMember(user) {
  const member = [
    {
      name: "li",
      attributes: { id: user._id },
      children: [
        {
          name: "span",
          content: `${user.firstName} "${user.nickName}" ${user.lastName}`,
        },
        {
          name: "span",
          attributes: { class: "u--green-circle" },
        },
      ],
    },
  ];

  const newHTML = createHTMLComponent(member);
  return newHTML;
}

module.exports = createMember;
