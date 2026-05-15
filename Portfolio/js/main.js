const toggle = document.getElementById("theme-toggle")

toggle.addEventListener("click", function(){

    document.body.classList.toggle("light-mode")

})

const text = "Web Developer"
const typingElement = document.getElementById("typing-text")

let index = 0

function typeText(){

    if(index < text.length){

        typingElement.textContent += text.charAt(index)

        index++

        setTimeout(typeText, 160)

    }

}
typeText()

const navbar = document.querySelector(".navbar")

window.addEventListener("scroll", function(){

    if(window.scrollY > 50){

        navbar.classList.add("navbar-scrolled")

    }else{

        navbar.classList.remove("navbar-scrolled")

    }

})

const skillSection = document.querySelector("#skills")
const progressBars = document.querySelectorAll(".skill-progress")

let skillsAnimated = false

window.addEventListener("scroll", function(){

    const sectionTop = skillSection.offsetTop
    const scrollPosition = window.scrollY + window.innerHeight

    if(scrollPosition > sectionTop && !skillsAnimated){

        progressBars.forEach(bar => {

            const width = bar.getAttribute("data-width")
            bar.style.width = width

        })

        skillsAnimated = true

    }

})
const decorContainer = document.querySelector(".scroll-decorations")
const types = ["line","circle","square","triangle"]
const totalDecor = 14
for(let i = 0; i < totalDecor; i++){

    const decor = document.createElement("div")
    const type = types[Math.floor(Math.random()*types.length)]

    decor.classList.add("decor", type)

    const size = Math.random()*40 + 20

    if(type === "line"){
        decor.style.width = size + "px"
        decor.style.height = "2px"
    } else {
        decor.style.width = size/3 + "px"
        decor.style.height = size/3 + "px"
    }

    decor.style.top = Math.random()*100 + "%"
    decor.style.left = Math.random()*100 + "%"

    const speed = Math.random()*20 + 20
    decor.style.animation = `rotateDecor ${speed}s linear infinite`

    decorContainer.appendChild(decor)

}
const decors = document.querySelectorAll(".decor")

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY
    const docHeight = document.body.scrollHeight - window.innerHeight
    const scrollPercent = scrollTop / docHeight

    decors.forEach((decor, index)=>{

        const move = scrollPercent * (200 + index*20)

        decor.style.transform = `translateY(${move}px)`

    })

})

const sections = document.querySelectorAll("section")
const navLinks = document.querySelectorAll(".nav-link")

window.addEventListener("scroll", () => {

    let current = ""

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150
        const sectionHeight = section.offsetHeight

        if(window.scrollY >= sectionTop){
            current = section.getAttribute("id")
        }

    })

    navLinks.forEach(link => {

        link.classList.remove("active")

        if(link.getAttribute("href").includes(current)){
            link.classList.add("active")
        }

    })

})

const cursorDot = document.querySelector(".cursor-dot")
const cursorOutline = document.querySelector(".cursor-outline")

const outlineText = document.createElement("span")
outlineText.classList.add("cursor-outline-text")
outlineText.textContent = "view"
cursorOutline.appendChild(outlineText)

let mouseX = window.innerWidth / 2
let mouseY = window.innerHeight / 2
let outlineX = mouseX
let outlineY = mouseY
let outlineSize = 32
let targetOutlineSize = 32
let isProjectHover = false

const outlineEase = 0.15

function updateCursorOutline(){
    outlineX += (mouseX - outlineX) * outlineEase
    outlineY += (mouseY - outlineY) * outlineEase

    cursorOutline.style.transform = `translate(calc(${outlineX}px - 50%), calc(${outlineY}px - 50%))`

    const currentWidth = parseFloat(cursorOutline.style.width) || outlineSize
    const currentHeight = parseFloat(cursorOutline.style.height) || outlineSize
    const delta = (targetOutlineSize - currentWidth) * 0.2

    cursorOutline.style.width = `${currentWidth + delta}px`
    cursorOutline.style.height = `${currentHeight + delta}px`

    requestAnimationFrame(updateCursorOutline)
}

function setCursorMode(mode){
    cursorOutline.classList.remove("cursor-hover", "cursor-project", "cursor-pointer", "cursor-text", "cursor-default")

    if(mode === "pointer"){
        cursorOutline.classList.add("cursor-pointer")
        targetOutlineSize = 56
        outlineText.textContent = "click"
        outlineText.style.display = "inline"
        isProjectHover = false

    } else if(mode === "text"){
        cursorOutline.classList.add("cursor-text")
        targetOutlineSize = 46
        outlineText.textContent = "type"
        outlineText.style.display = "inline"
        isProjectHover = false

    } else if(mode === "project"){
        cursorOutline.classList.add("cursor-project")
        targetOutlineSize = 70
        outlineText.textContent = "view"
        outlineText.style.display = "inline"
        isProjectHover = true

    } else {
        cursorOutline.classList.add("cursor-default")
        targetOutlineSize = 32
        outlineText.style.display = "none"
        isProjectHover = false
    }
}

function setHoverState(isHover){
    if(isHover){
        setCursorMode("pointer")
    } else {
        setCursorMode(isProjectHover ? "project" : "default")
    }
}

function setProjectHoverState(isHover){
    if(isHover){
        setCursorMode("project")
    } else {
        setCursorMode("default")
    }
}

window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX
    mouseY = event.clientY

    cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`
})

const interactiveElements = document.querySelectorAll("a, button, .project-card, .nav-link")

interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
        if(el.classList.contains("project-card")){
            setProjectHoverState(true)
        } else {
            setHoverState(true)
        }
    })

    el.addEventListener("mouseleave", () => {
        if(el.classList.contains("project-card")){
            setProjectHoverState(false)
        }
        setHoverState(false)
    })
})

const textInputs = document.querySelectorAll("input[type='text'], input[type='email'], input[type='password'], textarea")

textInputs.forEach(el => {
    el.addEventListener("mouseenter", () => setCursorMode("text"))
    el.addEventListener("mouseleave", () => setCursorMode("default"))
    el.addEventListener("focus", () => setCursorMode("text"))
    el.addEventListener("blur", () => setCursorMode("default"))
})

cursorDot.style.display = "block"
cursorOutline.style.display = "block"

updateCursorOutline()

AOS.init({

    duration:1000,
    once:true

})