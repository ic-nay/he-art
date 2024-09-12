hearts = ["❤️","🩷","🧡","💛","💚","💙","🩵","💜","🤎","🖤","🤍","🩶"]

// Used to track what hearts get coloured in a given stroke, so that
// re-passing over a heart does not toggle it back again
coloredHearts = []


//Keeps track of whether the user is selecting something or not.
selecting = false;
document.addEventListener("mousedown", function(){
  selecting = true;
})
document.addEventListener("touchstart", function(){
  selecting = true;
})
document.addEventListener("touchmove", touchheartevent)
//Clears the list of hearts being coloured and the active colour being drawn with
document.addEventListener("mouseup", function(){
  selecting = false;
  coloredHearts = []
  activeColor = ""
})
document.addEventListener("touchend", function(){
  selecting = false;
  coloredHearts = []
  activeColor = ""
})

const CANVAS = document.getElementById("canvas")

//Height-width linking
const LINKER = document.getElementById("linker")
LINKER.addEventListener("click", toggleLink)
linked = false;

//Height and width selectors
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


//Colour selectors
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
activeColor = ""

function toggleLink(){
  linked = !linked
  if (linked){
    LINKER.firstChild.innerHTML = "link"
  }
  else {
    LINKER.firstChild.innerHTML = "link_off"
  }
}

function checkLinked(value){
  if (linked){
    WIDTHSELECTOR.value = value
    HEIGHTSELECTOR.value = value
  }
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

function makeNewRow(width){
  row = document.createElement("tr")
  for (i = 0; i <= width; i ++){
    row.appendChild(makeNewHeart())
  }
  return row
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
  if (activeColor == ""){
    if (heart.innerHTML == foregroundColor){
      activeColor = backgroundColor
    }
    else {
      activeColor = foregroundColor
    }
  }
  if (!coloredHearts.includes(heart)){
    coloredHearts.push(heart)
    heart.innerHTML = activeColor
  }
}

function touchheartevent(e){
    //Actually determines whether the user is touching a heart or not.
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

setCanvasSize(WIDTHSELECTOR.value, HEIGHTSELECTOR.value)
