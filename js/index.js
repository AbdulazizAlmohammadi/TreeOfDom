let canvas = document.querySelector("#canvas");

let ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = 40;

let lineLength = 50;
let angel = 30;
let radius = 20;
let incX = 8.5;
let incY = 7.3;
let gap = 200;
let counter = 1;
let maxChild = 0;
ctx.strokeStyle = "black";
ctx.font = "14px sans-serif";
let collabseButton = [];
let NodevaluesButton = [];
let nodePaths = [];
let root = document.getElementsByTagName("body")[0];

node = {
  tag: root,
  position: { x: canvas.width / 2, y: 40 },
  nodePath: null,
  children: createTree(root),
  parent: null,
  isOpen: true,
  openButtonPath: null,
  depth: 0,
};

let path = new Path2D();

DrawDOMTree();
//event
function getXY(canvas, event) {
  //shape
  const rect = canvas.getBoundingClientRect();
  const y = event.clientY - rect.top; //mouse event
  const x = event.clientX - rect.left;
  return { x: x, y: y };
}

////////////////////////////////////
//Events Listeners
////////////////////////////////////
canvas.addEventListener(
  "click",
  function (e) {
    const XY = getXY(canvas, e);
    if (ctx.isPointInPath(collabseButton[node.openButtonPath], XY.x, XY.y)) {
      //alert("you clicked on the button");
      node.isOpen = !node.isOpen;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      DrawDOMTree();
      return;
    } else {
      searchForCollapsePath(node, XY);
    }
    searchForValuePath(node, XY);
  },
  false
);

canvas.addEventListener(`mousemove`, (e) => {
  const XY = getXY(canvas, e);

  if (ctx.isPointInPath(nodePaths[node.nodePath], XY.x, XY.y)) {
    alert(node.tag.otterHTML);
  } else {
    searchForNode(node, XY);
  }
});

function searchForCollapsePath(root, XY) {
  for (let i = 0; i < root.children.length; i++) {
    if (
      root.children[i].openButtonPath !== null &&
      ctx.isPointInPath(
        collabseButton[root.children[i].openButtonPath],
        XY.x,
        XY.y
      )
    ) {
      //alert("you clicked on the button");
      root.children[i].isOpen = !root.children[i].isOpen;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      DrawDOMTree();
      return;
    } else if (root.children[i].children.length) {
      //console.log(root.children[i]);
      searchForCollapsePath(root.children[i], XY);
    }
  }
}

function searchForValuePath(root, XY) {
  for (let i = 0; i < root.children.length; i++) {
    if (
      root.children[i].valuesButtonPath !== null &&
      ctx.isPointInPath(
        NodevaluesButton[root.children[i].valuesButtonPath],
        XY.x,
        XY.y
      )
    ) {
      let attributes = root.children[i].tag.attributes;
      if (attributes.length == 0) {
        alert("No attributes");
      } else {
        let strAtr = "";
        for (let i = 0; i < attributes.length; i++) {
          strAtr += ` ${attributes[i].nodeName} : `;
          strAtr += ` ${attributes[i].nodeValue} \n`;
        }
        console.log(strAtr);
        alert(strAtr);
      }
      return;
    } else if (root.children[i].children.length) {
      console.log(root.children[i]);
      searchForValuePath(root.children[i], XY);
    }
  }
}

function searchForNode(root, XY) {
  for (let i = 0; i < root.children.length; i++) {
    if (
      root.children[i].nodePath !== null &&
      ctx.isPointInPath(nodePaths[root.children[i].nodePath], XY.x, XY.y)
    ) {
      alert(root.children[i].tag.innerHTML);
      return;
    } else if (root.children[i].children.length) {
      searchForNode(root.children[i], XY);
    }
  }
}

function DrawDOMTree() {
  ctx.beginPath();
  ctx.fillText(node.tag.nodeName, node.position.x - 15, node.position.y, 54);
  path = new Path2D();
  ctx.arc(node.position.x, node.position.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  path.arc(node.position.x, node.position.y, radius, 0, Math.PI * 2);
  nodePaths.push(path);
  node.nodePath = nodePaths.length - 1;
  node.openButtonPath = drawOpenClose(node.position.x, node.position.y, node);
  counter = 1;
  if (node.isOpen) drawTree(node, 2);
}

function drawTree(tree, level) {
  num = getNodesPerLevel(level);
  console.log(num);
  let axisY = tree.position.y + 100;
  let axisX = tree.position.x - radius * (maxChild / counter);
  // let axisX = canvas.width / num;
  //x -= radius * tree.children.length;
  for (let i = 0; i < tree.children.length; i++) {
    let tag = tree.children[i].tag;
    if (tag.nodeName === "#text") continue;

    tree.children[i].nodePath = drawNode(axisX, axisY, tag, tree, i);
    tree.children[i].valuesButtonPath = drawAttribute(axisX, axisY);
    if (tag.firstChild !== null && tag.firstChild.nodeType === Node.TEXT_NODE) {
      drawText(axisX, axisY, tag, tree, i);
    }

    if (
      tag.hasChildNodes &&
      tag.firstChild !== null &&
      tag.firstChild.nodeType !== Node.TEXT_NODE
    ) {
      tree.children[i].openButtonPath = drawOpenClose(axisX, axisY);
      counter++;
      console.log(tree.isOpen);
      if (tree.children[i].isOpen) drawTree(tree.children[i], level + 1);
    } else {
      console.log(`No ${tag.nodeName}`);
    }
    axisX += 100;
  }
  console.log(level);
}

function createTree(rootNode) {
  let nodes = [];
  if (rootNode.hasChildNodes) {
    if (rootNode.childNodes.length > maxChild) {
      maxChild = rootNode.childNodes.length;
    }
    for (let i = 0; i < rootNode.childNodes.length; i++) {
      if (rootNode.childNodes.item(i).nodeName !== "#text") {
        let currentNode = {
          tag: rootNode.childNodes.item(i),
          parent: rootNode,
          //depth: counter,
          position: { x: 0, y: 0 },
          nodePath: null,
          isOpen: true,
          openButtonPath: null,
          valuesButtonPath: null,
          children: createTree(rootNode.childNodes.item(i)),
        };
        nodes.push(currentNode);
      } else if (rootNode.childNodes.item(i).nodeType === Node.TEXT_NODE) {
        let currentNode = {
          tag: rootNode.childNodes.item(i),
          parent: rootNode,
          //depth: counter,
          position: { x: 0, y: 0 },
          nodePath: null,
          isOpen: true,
          openButtonPath: null,
          valuesButtonPath: null,
          children: [],
        };
        nodes.push(currentNode);
      }
    }
  }
  return nodes;
}

function drawNode(axisX, axisY, tag, tree, i) {
  let context = canvas.getContext("2d");
  path = new Path2D();
  context.beginPath();
  context.strokeStyle = "black";
  context.arc(axisX, axisY, radius, 0, Math.PI * 2);
  context.moveTo(axisX, axisY - radius);
  context.lineTo(tree.position.x, tree.position.y + radius);
  context.stroke();

  tree.children[i].position = { x: axisX, y: axisY };
  context.fillText(tag.nodeName, axisX - 15, axisY, 54);
  context.closePath();
  path.arc(axisX, axisY, radius, 0, Math.PI * 2);
  nodePaths.push(path);

  return nodePaths.length - 1;
}

function drawText(axisX, axisY, tag, tree, i) {
  let context = canvas.getContext("2d");
  context.fillText(tag.firstChild.textContent, axisX - 30, axisY - 50, 54);
  context.beginPath();
  context.strokeStyle = "purple";
  context.moveTo(axisX - 30, axisY - 50);
  context.lineTo(
    tree.children[i].position.x,
    tree.children[i].position.y - radius
  );
  context.stroke();
  context.strokeRect(axisX - 30, axisY - 65, 40, 20);
  context.strokeStyle = "black";
  context.closePath();
}

function drawOpenClose(axisX, axisY) {
  let context = canvas.getContext("2d");
  //let buttonPath = new Path2D();
  path = new Path2D();
  context.fillStyle = "blue";
  context.fillRect(axisX - 30, axisY - 23, 10, 10);
  context.fillStyle = "black";
  context.fillText("+", axisX - 28, axisY - 13, 54);
  path.rect(axisX - 30, axisY - 23, 10, 10);
  collabseButton.push(path);
  return collabseButton.length - 1;
}

function drawAttribute(axisX, axisY) {
  let context = canvas.getContext("2d");
  path = new Path2D();
  context.fillStyle = "red";
  context.fillRect(axisX - 30, axisY - 5, 10, 10);
  context.fillStyle = "black";
  context.fillText("...", axisX - 28, axisY, 54);
  path.rect(axisX - 30, axisY - 5, 10, 10);
  NodevaluesButton.push(path);
  return NodevaluesButton.length - 1;
}

function getNodesPerLevel(row) {
  return row <= 0 ? 1 : _getNodesPerLevel(document, row);
}
function _getNodesPerLevel(e, row) {
  if (row == 0)
    if ("children" in e) return e.children.length;
    else return 0;
  else if (!("children" in e)) return 0;
  var total = 0;
  for (let i = 0; i < e.children.length; i++)
    total += _getNodesPerLevel(e.children[i], row - 1);
  return total;
}

//////////////////////////////////////
// Save canvas
//////////////////////////////////////

function saveImage() {
  const btnDownload = document.querySelector("#save");
  btnDownload.addEventListener("click", function () {
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(canvas.msToBlob(), "canvas-image.png");
    } else {
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = canvas.toDataURL("image/png");
      a.download = "canvas-image.png";
      a.click();
      document.body.removeChild(a);
    }
  });
}
