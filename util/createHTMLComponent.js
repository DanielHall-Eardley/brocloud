/* 
  Use this structure for creating html components
  [
    {
      name: "html element",
      attributes: 
        { attName: attValue }
      content: "inner text"
      children: [
        repeat Object
      ]
    }
  ]
*/

function addAttributesToElement(htmlElement, attributes) {
  if (!attributes) return htmlElement;
  const attributeNames = Object.keys(attributes);

  if (attributeNames.length > 0) {
    attributeNames.forEach((attName) => {
      const attValue = attributes[attName];
      htmlElement.setAttribute(attName, attValue);
    });
  }

  return htmlElement;
}

function addTextToElement(htmlELement, text) {
  if (text) {
    const escapedText = document.createTextNode(text);
    htmlELement.appendChild(escapedText);
  }

  return htmlELement;
}

exports.createHTMLComponent = function (compStructure) {
  const component = new DocumentFragment();

  function recursive(elementStructure, parent) {
    elementStructure.forEach((obj) => {
      const { name, attributes, content, children } = obj;
      const htmlElement = document.createElement(name);
      const htmlElementAtt = addAttributesToElement(htmlElement, attributes);
      const htmlElementText = addTextToElement(htmlElementAtt, content);
      parent.append(htmlElementText);

      if (children && children.length > 0) {
        recursive(children, htmlElementText);
      }
    });
  }

  recursive(compStructure, component);
  return component;
};
