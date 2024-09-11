/*
TODO
- fix single-heart touch select (preventDefault()?)
- Comment/clean up code
- Dark mode/light mode
- custom domain? .art domains are cheap right now.

*/

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

const FOREGROUND = document.getElementById("foreground")
const BACKGROUND = document.getElementById("background")
const FOREGROUND_PICKER = document.getElementById("foreground_picker")
const BACKGROUND_PICKER = document.getElementById("background_picker")
for (child of FOREGROUND_PICKER.children){
  child.addEventListener("click", setForeground)
}
for (child of BACKGROUND_PICKER.children){
  child.addEventListener("click", setBackground)
}
foregroundColor = "❤️"
backgroundColor = "🖤"
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

function setForeground(e){
  foregroundColor = e.target.innerHTML
  FOREGROUND.innerHTML = "<span class=\"material-symbols-outlined\">stylus_note</span>"+foregroundColor
}

function setBackground(e){
  temp = backgroundColor
  backgroundColor = e.target.innerHTML
  BACKGROUND.innerHTML = "<span class=\"material-symbols-outlined\">format_color_fill</span>"+backgroundColor
  for (child of CANVAS.children){
    for (heart of child.children){
      if (heart.innerHTML == temp){
        heart.innerHTML = backgroundColor
      }
    }
  }
}

function makeNewHeart(){
  td = document.createElement("td")
  td.innerHTML = backgroundColor
  td.addEventListener("mousedown", function(e){
    toggleheart(e.target)
  })
  td.addEventListener("touchstart", function(e){
    e.preventDefault()
    toggleheart(e.target)
  }) //is this still necessary?
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
    if (heart.innerHTML == backgroundColor){
      activeColour = foregroundColor
    }
    else {
      activeColour = backgroundColor
    }
  }
  if (!coloredHearts.includes(heart)){
    coloredHearts.push(heart)
    heart.innerHTML = activeColour
  }
}

function touchheartevent(e){
    element = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    if (element.tagName == "TD"){
        toggleheart(element)
    }
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
