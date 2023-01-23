import "swiper/swiper.min.css";
import "../styles/reset.scss";
import "../styles/mixins.scss";
import "../styles/styles.scss";
// import { version } from "html-webpack-plugin";

import Swiper, { Navigation, Pagination } from 'swiper';
Swiper.use([Navigation, Pagination])

const classes = {
  opened: "opened",
  hidden: "hidden",
  active: "active"

};

//массив из списка характеристик в карточке игрока
const checkboxes = {
   requirements: ["minimum", 'recommended'],
   version: ["standart", 'limited']
};

const values = [
   {  
      title: "Standart Edition",
      price: 19.99,
   },
   {
      title: "Standart Edition",
      price: 18.99,
   },
   {
      title: "Delux Edition",
      price: 29.99,
   },
]

const checkBox = document.querySelectorAll(".checkbox");
const header = document.querySelector(".header");
const menuBtn = document.querySelector(".header-menu__button");
const menuLink = document.querySelectorAll(".menu-link");
const video = document.getElementById("video");
const videoBtn = document.querySelector(".video-btn");
const faqItem = document.querySelectorAll(".faq-item");
const section = document.querySelectorAll(".section");
const buyButton = document.querySelectorAll(".buy-button");
const modal = document.querySelector(".modal");
const modalPrice = document.querySelector(".modal-total__price");
const modalTitle = document.querySelector(".modal-title");
const modalClose = document.querySelector(".modal-close");
const overlay = document.querySelector(".overlay");

let isPlay = false;

//? burger
const toggleMenu = () => header.classList.toggle(classes.opened); // добавление класс opened при клике на header-menu__button

//? video
const handleVideo = ({target}) => {
   const info = target.parentElement; 

   isPlay = !isPlay;
   info.classList.toggle(classes.hidden, isPlay)
   target.innerText = isPlay ? 'Pause' : 'Play';
   isPlay ? video.play() : video.pause()
}

//плавный скрол на якорям по страници //? scrollToSection
const scrollToSection = (elem) => {
  elem.preventDefault();
  const href = elem.currentTarget.getAttribute("href");

  if (!href && !href.startWith("#")) return;

  const section = href.slice(1);
  const top = document.getElementById(section)?.offsetTop || 0;
  window.scrollTo({ top, behavior: "smooth" });
};

//? таймер
//конвертируем время в миллисекундах в необходимые показатели
const getTimerVals = (diff) => 
 ({
    seconds: (diff / 1000) % 60,
    minutes: (diff / (1000 * 60)) % 60,
    hours: (diff / (1000 * 3600)) % 24,
    days: (diff / (1000 * 3600 * 24)) % 30,
    mounth: (diff / (1000 * 3600 * 24 * 30)) % 12,
  });

const formatVal =(value)=> value < 10? `0${value}` : value;

const startTimer =(date)=> {
  setInterval(() => {
   const diff = new Date(date).getTime() - new Date().getTime(); //вычисляем текущею дату от заданой 
   const vals = getTimerVals(diff) // кладем в переменную разницу в миллисеках
   
   //очистка таймера 
   if (diff < 0) {
      clearInterval(id);
      return;
   }
   //получаем обьект перебераем его
   Object.entries(vals).forEach(([key, value])=> {
     const timerVal = document.getElementById(key) //доступ по ключам к айдишникам 
     timerVal.innerText = formatVal(Math.floor(value)) //вывод данных
   })
  }, 1000);//каждую секунду выводим 

};
//? таймер

//? переключатель по  data-requirements + id
const handleCheck = ({currentTarget: {checked, name}}) => {
   const {active} = classes;
   const value = checkboxes[name][Number(checked)];
   const list = document.getElementById(value);
   const tabs = document.querySelectorAll(`[data-${name}]`);
   const siblings = list.parentElement.children;

   //для списка
   for(const item of siblings) item.classList.remove(active);
   //для тайтла
   for(const tab of tabs) {;
      tab.classList.remove(active)
      tab.dataset[name] === value && tab.classList.add(active);
   }


   list.classList.add(active)
   // console.log(value);
}

//? slider
const initSlider = () => {
   new Swiper(".swiper", {
      loop: true,
      slidesPerView: 3,
      spaceBetween: 20,
      initialSlide: 2,
      navigation: {
         nextEl: ".swiper-button-next",
         prevEl: ".swiper-button-prev",
      },
      pagination: {
         el: ".swiper-pagination",
         dynamicBullets: true,
       },
   })
}
initSlider();

//? faq
const handleFaqItem = ({ currentTarget: target }) => {
   target.classList.toggle(classes.opened);

   const isOpened = target.classList.contains(classes.opened);
   const height = target.querySelector("p").clientHeight;
   const content = target.querySelector(".faq-item__content")

   content.style.height = `${isOpened ? height : 0}px`
}

//! анимация класса hidden
const heandleScroll =()=> {
   const { scrollY: y, innerHeight: h} = window; // y - число скрола экрана
   // console.log(y);
   section.forEach((sectns) =>{
      if(y>sectns.offsetTop - h / 1.5) sectns.classList.remove(classes.hidden)
   })
}

//! модальное окно по клику кнопка купить
const handleBuyBtn = ({currentTarget: target}) =>{
   const {value} = target.dataset

   if(!value) return

   const {price, title} = values[value]

   modalTitle.innerText = title;
   modalPrice.innerText = `${price}$`;
   modal.classList.add(classes.opened);
   overlay.classList.add(classes.opened);
}
const closedModal = () => {
   modal.classList.remove(classes.opened);
   overlay.classList.remove(classes.opened);
}


startTimer("April 12, 2023 00:00:00");// заданная дата

window.addEventListener('scroll', heandleScroll)//! по скролу анимация класса hidden
videoBtn.addEventListener("click", handleVideo);  //? Video
menuBtn.addEventListener("click", toggleMenu); //событие клик и добавление через функцию //? toggleMenu класса opened
modalClose.addEventListener("click", closedModal); //? закрытие модального окна


menuLink.forEach((link) => link.addEventListener("click", scrollToSection)); //по клику на меню запускамы функцию //? scrollToSection
checkBox.forEach((box) => box.addEventListener("click", handleCheck)); //по клику на меню запускамы функцию //? scrollToSection
faqItem.forEach((item) => item.addEventListener("click", handleFaqItem));// по клику выезжает item в faq section
buyButton.forEach((btn) => btn.addEventListener("click", handleBuyBtn));// по клику выезжает //? модальное окно
