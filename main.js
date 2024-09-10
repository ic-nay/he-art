/*
TODO
- Touch support (optimistic)
- Dark mode/light mode
- custom domain? .art domains are cheap right now.

*/

/*hearts = {
  "red":"❤️",
  "pink":"🩷",
  "orange":"🧡",
  "yellow":"💛",
  "green":"💚",
  "blue":"💙",
  "light_blue":"🩵",
  "purple":"💜",
  "brown":"🤎",
  "black":"🖤",
  "white":"🤍",
  "grey":"🩶"
}*/


hearts = ["❤️","🩷","🧡","💛","💚","💙","🩵","💜","🤎","🖤","🤍","🩶"]

coloredHearts = []

selecting = false;
document.addEventListener("mousedown", function(){
  selecting = true;
})
document.addEventListener("touchstart", function(){
  selecting = true;
})
document.addEventListener("touchmove", touchheartevent)
document.addEventListener("mouseup", function(){
  selecting = false;
  coloredHearts = []
  activeColour = ""
  document.getElementById("status").innerHTML = ""
})
document.addEventListener("touchend", function(){
  selecting = false;
  coloredHearts = []
  activeColour = ""
  document.getElementById("status").innerHTML = ""
})

const CANVAS = document.getElementById("canvas")

const LINKER = document.getElementById("linker")
LINKER.addEventListener("click", toggleLink)
linked = false;

const WIDTHSELECTOR = document.getElementById("width")
const HEIGHTSELECTOR = document.getElementById("height")
WIDTHSELECTOR.addEventListener("change", function(){
  checkLinked(WIDTHSELECTOR.value)
  setCanvasSize(WIDTHSELECTOR.value, HEIGHTSELECTOR.value)
})
HEIGHTSELECTOR.addEventListener("change", function(){
  checkLinked(HEIGHTSELECTOR.value)
  setCanvasSize(WIDTHSELECTOR.value, HEIGHTSELECTOR.value)
})

const COLORONE = document.getElementById("colorone")
const COLORTWO = document.getElementById("colortwo")
const COLORONE_PICKER = document.getElementById("colorone_picker")
const COLORTWO_PICKER = document.getElementById("colortwo_picker")
for (child of COLORONE_PICKER.children){
  child.addEventListener("click", setColorOne)
}
for (child of COLORTWO_PICKER.children){
  child.addEventListener("click", setColorTwo)
}
colorOne = "❤️"
colorTwo = "🖤"
activeColour = ""

function setLinkedStatus(){
  icon = LINKER.firstChild.cloneNode(true)
  if (linked){
    icon.innerHTML = "link"
  }
  else {
    icon.innerHTML = "link_off"
  }
  LINKER.replaceChild(icon, LINKER.childNodes[0])
}

function toggleLink(){
  linked = !linked
  setLinkedStatus();
}

function checkLinked(value){
  if (linked){
    WIDTHSELECTOR.value = value
    HEIGHTSELECTOR.value = value
  }
}

function makeNewRow(width){
  row = document.createElement("tr")
  for (i = 0; i <= width; i ++){
    row.appendChild(makeNewHeart())
  }
  return row
}

function setColorOne(e){
  colorOne = e.target.innerHTML
  COLORONE.innerHTML = "<span class=\"material-symbols-outlined\">stylus_note</span>"+colorOne
}

function setColorTwo(e){
  temp = colorTwo
  colorTwo = e.target.innerHTML
  COLORTWO.innerHTML = "<span class=\"material-symbols-outlined\">format_color_fill</span>"+colorTwo
  for (child of CANVAS.children){
    for (heart of child.children){
      if (heart.innerHTML == temp){
        heart.innerHTML = colorTwo
      }
    }
  }
}

function makeNewHeart(){
  td = document.createElement("td")
  td.innerHTML = colorTwo
  td.addEventListener("mousedown", function(e){toggleheart(e.target)})
  td.addEventListener("touchstart", function(e){preventDefault(); toggleheart(e.target)})
  td.addEventListener("mouseenter", heartentry)
  return td
}

async function copy(){
  text = ""
  for (child of CANVAS.children){
    for (heart of child.children){
      text = text+heart.innerHTML
    }
    text = text+"\n"
  }
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error.message);
  }
}

function setCanvasSize(width, height){
  while (CANVAS.children.length > height){
    CANVAS.removeChild(CANVAS.lastChild)
  }
  while (CANVAS.children.length < height){
    CANVAS.appendChild(makeNewRow(width))
  }
  for (child of CANVAS.children){
    while (child.children.length > width){
      child.removeChild(child.lastChild)
    }
    while (child.children.length < width){
      child.appendChild(makeNewHeart())
    }
  }
}

function toggleheart(heart){
  if (activeColour == ""){
    if (heart.innerHTML == colorTwo){
      activeColour = colorOne
    }
    else {
      activeColour = colorTwo
    }
  }
  if (!coloredHearts.includes(heart)){
    coloredHearts.push(heart)
    heart.innerHTML = activeColour
  }
}

function touchheartevent(e){
    element = document.elementFromPoint(e.clientX, e.clientY);
    if (element.tagName == "TD"){
        toggleheart(element)
    }
    document.getElementById("status").innerHTML = "SELECTING: " + element.tagName + element.innerHTML;
}

function heartentry(e){
  if (selecting == true){
    toggleheart(e.target)
  }
}

function setup(){
  setLinkedStatus()
  checkLinked(6)
  setCanvasSize(WIDTHSELECTOR.value, HEIGHTSELECTOR.value) 
}
setup()
