const row = document.querySelector("#drag-and-drop");

var client = new XMLHttpRequest();
var json = null;
client.open('GET', 'data.json');
client.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    json = JSON.parse(client.responseText);
    LoadData(json);
    init();
  }
}
client.send();

function DownloadData() {
  var newJson = [];
  for (var i = 0; i < row.childNodes.length; i++) {
    var node = row.childNodes[i];
    var newParent = {
      "id": node.id,
      "container-class": node.className,
      "childs": []
    };
    for (var j = 0; j < node.childNodes.length; j++) {
      var childNode = node.childNodes[j];
      var child = {
        "id": childNode.id,
        "data": childNode.innerText,
        "class": childNode.className
      };
      newParent.childs.push(child);
    }
    newJson.push(newParent);
  }
  uriContent = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(newJson));
  document.getElementById("dlink").innerHTML = "<a id=\"downloadLink\" href=" + uriContent + " download=\"data.json\">Here is the download link</a>";
  document.getElementById("downloadLink").click();
}

function LoadData(data) {
  data.forEach(element => {
    var newContainer = document.createElement("div");
    newContainer.className = element["container-class"];
    newContainer.id = element.id;
    element["childs"].forEach(child => {
      var newChild = document.createElement("p");
      newChild.className = child["class"];
      newChild.innerText = child["data"];
      newChild.id = child["id"];
      newChild["draggable"] = true;
      newContainer.appendChild(newChild);
    });
    row.appendChild(newContainer);
  });
}

function init() {
  const draggables = document.querySelectorAll('.draggable');
  const containers = document.querySelectorAll('.drag-n-drop-container');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e) => {
      draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });
  })

  containers.forEach(container => {
    container.addEventListener('dragover', e => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY)
      const draggable = document.querySelector('.dragging')
      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    })
  })

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
}