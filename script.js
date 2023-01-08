"use strict";


class ClockViewDOM {
  constructor({size}) {
    this.secondHand
    this.minuteHand
    this.hourHand
    this.clockSize = size-20 //20px - граница часов  
  }

  //Метод создает HTML кружков с цифрами 
  createNumberOnClock(block) {
    const classNameArray = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

    for (let i = 0; i < classNameArray.length; i++) {
      const number = document.createElement('div')

      number.className = `clock__elem ${classNameArray[i]}`
      number.textContent = i + 1
      block.append(number)
    }
  }

  //Метод задает позицию стрелкам
  setPosition(line, angle) {

    const center = this.clockCenter.offsetLeft + this.clockCenter.offsetWidth / 2;

    line.style.left = Math.round(center) + "px";
    line.style.top = Math.round(center - 1) + "px";
    line.style.transform = "rotate(" + (angle - 90) + "deg)";
  }

  //Метод обновляет позицию стрелок
  update({ hours, minutes, seconds }) {
    this.setPosition(this.secondHand, seconds * 6)
    this.setPosition(this.minuteHand, (minutes + seconds / 60) * 6)
    this.setPosition(this.hourHand, (hours + minutes / 60) * 30)
  }

  //Метод создает HTML часов
  createClockOnPage() {
    const clock = document.createElement('div')
    clock.className = 'clock'
  
    //обращаемся к переменной в css для изменения размера часов
    clock.style.setProperty('--clock-size', `${this.clockSize}px`)

    const clockBody = document.createElement('div')
    clockBody.className = 'clock__body'

    const clockCenter = document.createElement('div')
    clockCenter.className = 'clock__center'

    const hourHand = document.createElement('div')
    hourHand.className = 'clock__hour-hand'

    const minuteHand = document.createElement('div')
    minuteHand.className = 'clock__minute-hand'

    const secondHand = document.createElement('div')
    secondHand.className = 'clock__second-hand'


    clockBody.append(clockCenter)
    this.createNumberOnClock(clockBody)
    clockBody.append(hourHand)
    clockBody.append(minuteHand)
    clockBody.append(secondHand)

    clock.append(clockBody)

    this.clockCenter = clockCenter
    this.hourHand = hourHand
    this.minuteHand = minuteHand
    this.secondHand = secondHand

    return clock
  }

  init(container) {
    container.append(this.createClockOnPage())  //выводим на страницу HTML часов
  }
}

class ClockViewSVG {
  constructor({size}) {
    this.svgNS = "http://www.w3.org/2000/svg";
    this.svg
    this.svgSize = size
    this.radiusElemClock
    this.secondHand
    this.minutedHand
    this.hourHand
  }

  //Метор возвращает SVG картинку(circle, line), в зависимости от объекта, который в него передан
  drawSVGElements(circleObject = false, lineObject = false) {

    if (circleObject) {
      const circle = document.createElementNS(this.svgNS, "circle");

      circle.setAttributeNS(null, "cx", circleObject.cx);
      circle.setAttributeNS(null, "cy", circleObject.cy);
      circle.setAttributeNS(null, "r", circleObject.r)
      circle.setAttributeNS(null, "fill", circleObject.color);

      return circle
    }

    if (lineObject) {
      const line = document.createElementNS(this.svgNS, "line");

      line.setAttributeNS(null, "x1", this.svgSize / 2);
      line.setAttributeNS(null, "y1", this.svgSize / 2);
      line.setAttributeNS(null, "x2", lineObject.x);
      line.setAttributeNS(null, "y2", lineObject.y)
      line.setAttributeNS(null, "stroke", "black");
      line.setAttributeNS(null, "stroke-width", lineObject.w);
      line.setAttributeNS(null, "stroke-opacity", 0.6);
      line.setAttributeNS(null, "stroke-linecap", "round");

      return line
    }
  }

  //Метод создает кружки с цифрами и выводит на страницу
  createNumberOnClock(obj, number) {
    const circle = this.drawSVGElements(obj)

    const text = document.createElementNS(this.svgNS, "text");
    text.setAttributeNS(null, "style", `font-size: ${0.063 * this.svgSize}px;`)
    text.setAttributeNS(null, "fill", 'white')

    if (number > 9) {
      text.setAttributeNS(null, "x", `${obj.cx - 0.033*this.svgSize}`);
      text.setAttributeNS(null, "y", `${obj.cy + 0.018 * this.svgSize}`);
    } else {
      text.setAttributeNS(null, "x", `${obj.cx - 0.017*this.svgSize}`);
      text.setAttributeNS(null, "y", `${obj.cy + 0.017*this.svgSize}`);
    }

    text.textContent = `${number}`

    this.svg.append(circle)
    this.svg.append(text)
  }

  //Метод задает позицию стрелок
  setPosition(line, radius, angle) {

    const angleRadians = parseFloat(angle) / 180 * Math.PI;
    const clockCenterX = this.svgSize / 2;
    const clockCenterY = this.svgSize / 2;

    line.setAttributeNS(null, "x2", clockCenterX + radius * Math.sin(angleRadians));
    line.setAttributeNS(null, "y2", clockCenterY - radius * Math.cos(angleRadians));
  }

  //Метод обновляет позицию стрелкам
  update({ hours, minutes, seconds }) {
    this.setPosition(this.secondHand, 0.423 * this.svgSize, seconds * 6)
    this.setPosition(this.minutedHand, 0.356 * this.svgSize, (minutes + seconds / 60) * 6)
    this.setPosition(this.hourHand, 0.271 * this.svgSize, (hours + minutes / 60) * 30)
  }

  //Метод создает SVG картинку часов
  createClockOnPage() {
    //Создание svg элемента 
    this.svg = document.createElementNS(this.svgNS, 'svg')
    this.svg.setAttributeNS(null, "width", this.svgSize);
    this.svg.setAttributeNS(null, "height", this.svgSize);
    this.svg.setAttributeNS(null, "id", "svg2");

   
    this.radiusElemClock = Math.ceil((this.svgSize / 2) * 0.1)

    //создание циферблата
    const clock = this.drawSVGElements({ cx: this.svgSize / 2, cy: this.svgSize / 2, r: this.svgSize / 2, color: '#6969bf' })
    //создание кружка в цетре
    const clockCenter = this.drawSVGElements({ cx: this.svgSize / 2, cy: this.svgSize / 2, r: this.svgSize * 0.042, color: 'black' })

    this.svg.append(clock)
    this.svg.append(clockCenter)

    //создание и вывод на страницу кружков с цифрами
    this.createNumberOnClock({ cx: this.svgSize / 2, cy: 0.0677 * this.svgSize, r: this.radiusElemClock, color: '#1b1ba1' }, 12)
    this.createNumberOnClock({ cx: 0.71 * this.svgSize, cy: 0.127 * this.svgSize, r: this.radiusElemClock, color: '#1b1ba1' }, 1)
    this.createNumberOnClock({ cx: 0.87 * this.svgSize, cy: 0.279 * this.svgSize, r: this.radiusElemClock, color: '#1b1ba1' }, 2)
    this.createNumberOnClock({ cx: 0.932 * this.svgSize, cy: this.svgSize / 2, r: this.radiusElemClock, color: '#1b1ba1' }, 3)
    this.createNumberOnClock({ cx: 0.87 * this.svgSize, cy: 0.71 * this.svgSize, r: this.radiusElemClock, color: '#1b1ba1' }, 4)
    this.createNumberOnClock({ cx: 0.71 * this.svgSize, cy: 0.87 * this.svgSize, r: this.radiusElemClock, color: '#1b1ba1' }, 5)
    this.createNumberOnClock({ cx: this.svgSize / 2, cy: 0.93 * this.svgSize, r: this.radiusElemClock, color: '#1b1ba1' }, 6)
    this.createNumberOnClock({ cx: 0.279 * this.svgSize, cy: 0.87 * this.svgSize, r: this.radiusElemClock, color: '#1b1ba1' }, 7)
    this.createNumberOnClock({ cx: 0.127 * this.svgSize, cy: 0.71 * this.svgSize, r: this.radiusElemClock, color: '#1b1ba1' }, 8)
    this.createNumberOnClock({ cx: 0.0677 * this.svgSize, cy: this.svgSize / 2, r: this.radiusElemClock, color: '#1b1ba1' }, 9)
    this.createNumberOnClock({ cx: 0.127 * this.svgSize, cy: 0.279 * this.svgSize, r: this.radiusElemClock, color: '#1b1ba1' }, 10)
    this.createNumberOnClock({ cx: 0.288 * this.svgSize, cy: 0.127 * this.svgSize, r: this.radiusElemClock, color: '#1b1ba1' }, 11)

    //создание стрелок 
    this.secondHand = this.drawSVGElements(false, { x: this.svgSize / 2, y: 0.06 * this.svgSize, w: this.svgSize * 0.008 })
    this.minutedHand = this.drawSVGElements(false, { x: this.svgSize / 2, y: 0.134 * this.svgSize, w: 0.016 * this.svgSize })
    this.hourHand = this.drawSVGElements(false, { x: 0.5 * this.svgSize, y: 0.24 * this.svgSize, w: 0.025 * this.svgSize })

    this.svg.append(this.secondHand)
    this.svg.append(this.minutedHand)
    this.svg.append(this.hourHand)


    return this.svg
  }

  init(container) {
    container.append(this.createClockOnPage()) //Метод выводит на страницу SVG картинку часов
  }
}

class ClockViewCanvas {
  constructor({size}) {
    this.clockCanvas = document.createElement('canvas')
    this.ctx = this.clockCanvas.getContext("2d");
    this.clockSize = size
    this.hours = 0
    this.minutes = 0
    this.seconds = 0
    this.clockCenter = this.clockSize/2;
  }

  //Метод задает позицию стрелкам и перерисовывает их
  setPosition(line, radius, angle) {

    const angleRadians = parseFloat(angle) / 180 * Math.PI;
    const clockCenterX = this.clockCenter
    const clockCenterY = this.clockCenter

    if (line === 'second') this.drawCanvasElements(false, { x: clockCenterX + radius * Math.sin(angleRadians), y: clockCenterY - radius * Math.cos(angleRadians), w: 0.0067*this.clockSize})

    if (line === 'minute') this.drawCanvasElements(false, { x: clockCenterX + radius * Math.sin(angleRadians), y: clockCenterY - radius * Math.cos(angleRadians), w: 0.017*this.clockSize })

    if (line === 'hour') this.drawCanvasElements(false, { x: clockCenterX + radius * Math.sin(angleRadians), y: clockCenterY - radius * Math.cos(angleRadians), w: 0.025*this.clockSize })
  }

  //Метор рисует элемент(circle, line), в зависимости от объекта, который в него передан
  drawCanvasElements(circleObject = false, lineObject = false) {
    let ctx = this.ctx

    if (circleObject) {
      ctx.strokeStyle = circleObject.color;
      ctx.fillStyle = circleObject.color;
      ctx.lineWidth = 1

      ctx.beginPath();
      ctx.arc(circleObject.x, circleObject.y, circleObject.r, 0, 2 * Math.PI);
      ctx.fill()
      ctx.stroke();
    }

    if (lineObject) {
      ctx.strokeStyle = "rgba(3, 3, 3, 0.6)";
      ctx.lineWidth = lineObject.w;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(this.clockCenter, this.clockCenter);
      ctx.lineTo(lineObject.x, lineObject.y);
      ctx.stroke();
    }
  }

  //Метод создает кружки с цифрами и выводит на canvas
  createNumberOnClock(obj, number) {

    let ctx = this.clockCanvas.getContext("2d");

    this.drawCanvasElements(obj) //создание курга 

    //помещаем цифры в круг
    if (number > 9) {
      ctx.font = `${0.06*this.clockSize+'px'} serif`;
      ctx.fillStyle = "#fff";
      ctx.fillText(`${number}`, `${obj.x - 0.032*this.clockSize}`, `${obj.y + 0.02*this.clockSize}`)
    } else {
      ctx.font = `${0.06*this.clockSize+'px'} serif`;
      ctx.fillStyle = "#fff";
      ctx.fillText(`${number}`, `${obj.x - 0.0175*this.clockSize}`, `${obj.y + 0.02*this.clockSize}`)
    }
  }

  //Метод обновляет позицию стрелок
  update({ hours, minutes, seconds }) {
    this.hours = hours
    this.minutes = minutes
    this.seconds = seconds
  }

  //Метод создает Canvas
  createClockOnPage(container) {
    this.ctx.clearRect(0, 0, this.clockCanvas.width, this.clockCanvas.height)
    this.clockCanvas.width = this.clockSize
    this.clockCanvas.height = this.clockSize
    
    //создание и вывод на страницу циферблата
    this.drawCanvasElements({ x: this.clockSize/2, y: this.clockSize/2, r: this.clockSize/2, color: '#6969bf' })

    //создание и вывод на страницу центра часов
    this.drawCanvasElements({ x: this.clockSize/2, y: this.clockSize/2, r: 0.04 *this.clockSize, color: 'black' })

    //создание и вывод на страницу кружков с цифрами
    this.createNumberOnClock({ x: this.clockSize/2, y: 0.068*this.clockSize, r: 0.05*this.clockSize, color: '#1b1ba1' }, 12)
    this.createNumberOnClock({ x: 0.71*this.clockSize, y: 0.13*this.clockSize, r: 0.05*this.clockSize, color: '#1b1ba1' }, 1)
    this.createNumberOnClock({ x: 0.87*this.clockSize, y: 0.28*this.clockSize, r: 0.05*this.clockSize, color: '#1b1ba1' }, 2)
    this.createNumberOnClock({ x: 0.93*this.clockSize, y: this.clockSize/2, r: 0.05*this.clockSize, color: '#1b1ba1' }, 3)
    this.createNumberOnClock({ x: 0.87*this.clockSize, y: 0.71*this.clockSize, r: 0.05*this.clockSize, color: '#1b1ba1' }, 4)
    this.createNumberOnClock({ x: 0.71*this.clockSize, y: 0.87*this.clockSize, r: 0.05*this.clockSize, color: '#1b1ba1' }, 5)
    this.createNumberOnClock({ x: this.clockSize/2, y: 0.93*this.clockSize, r: 0.05*this.clockSize, color: '#1b1ba1' }, 6)
    this.createNumberOnClock({ x: 0.28*this.clockSize, y: 0.87*this.clockSize, r: 0.05*this.clockSize, color: '#1b1ba1' }, 7)
    this.createNumberOnClock({ x: 0.13*this.clockSize, y: 0.71*this.clockSize, r: 0.05*this.clockSize, color: '#1b1ba1' }, 8)
    this.createNumberOnClock({ x: 0.068*this.clockSize, y: this.clockSize/2, r: 0.05*this.clockSize, color: '#1b1ba1' }, 9)
    this.createNumberOnClock({ x: 0.13*this.clockSize, y: 0.29*this.clockSize, r: 0.05*this.clockSize, color: '#1b1ba1' }, 10)
    this.createNumberOnClock({ x: 0.28*this.clockSize, y: 0.13*this.clockSize, r: 0.05*this.clockSize, color: '#1b1ba1' }, 11)


    //перерисовка стрелок 
    this.setPosition('second', 0.42*this.clockSize, this.seconds * 6)
    this.setPosition('minute', 0.32*this.clockSize, (this.minutes + this.seconds / 60) * 6)
    this.setPosition('hour', 0.25*this.clockSize, (this.hours + this.minutes / 60) * 30)
    
    container.append(this.clockCanvas)
    requestAnimationFrame(() => this.createClockOnPage(container))
  }

  init(container) {
    requestAnimationFrame(() => this.createClockOnPage(container)) //Метод выводит на страницу Canvas
  }
}


class Model {
  constructor(gmt) {
    this.gmt = gmt
    this.time
    this.hours  
    this.minutes
    this.seconds
    this.setIntervalId
  }

  //Метод рассчитывает разницу во времени
  getDifferenceInTime(){
    const currentCountryGMT = -1 * this.time.getTimezoneOffset()/60 
    const searchCountryGMT = Number(this.gmt.split('').slice(3).join(''))
    let differenceInTime 

    if(searchCountryGMT>currentCountryGMT){
      differenceInTime = -1* Math.abs(currentCountryGMT-searchCountryGMT)
    }else if(searchCountryGMT===0){
      differenceInTime = currentCountryGMT
    }
    else{
      differenceInTime = searchCountryGMT<0? Math.abs(searchCountryGMT)+currentCountryGMT: Math.abs(searchCountryGMT-currentCountryGMT) 
    }

    return  differenceInTime
  }

  //Метод рассчитывает текущее время
  getTime() {
    this.time = new Date()
    this.hours = this.time.getHours() - this.getDifferenceInTime()
    this.minutes = this.time.getMinutes()
    this.seconds = this.time.getSeconds()
  }

  //Метод останавливает работу часов
  stop() {
    clearInterval(this.setIntervalId)
  }

  //Метод обновляется время и отправляет данные в View
  update() {
    this.getTime()
    this.view.update({ hours: this.hours, minutes: this.minutes, seconds: this.seconds })

    this.setIntervalId = setInterval(() => {
      this.getTime()
      this.view.update({ hours: this.hours, minutes: this.minutes, seconds: this.seconds })
    }, 1000)
  }

  init(view) {
    this.view = view
  }
}

class Controller {
  constructor() {
    this.model
    this.container
    this.startButton
    this.stopButton
  }

 //Метод вызывает метод модели для возобновления работы часов 
  startClock() {
    this.model.update()
    this.startButton.disabled = true
    this.stopButton.disabled = false
  }

  //Метод вызывает метод модели для остановки часов 
  stopClock() {
    this.model.stop()
    this.startButton.disabled = false
    this.stopButton.disabled = true
  }

  //В метод передается модель и контейнер, в котором хранятся часы и кнопки
  init(model, container_1) {
    this.model = model
    this.container = container_1

    this.startButton = this.container.querySelector('.button__start')
    this.startButton.addEventListener('click', () => this.startClock())
    this.startButton.disabled = true
    
    this.stopButton = this.container.querySelector('.button__stop')
    this.stopButton.addEventListener('click', (event) => this.stopClock())
    this.stopButton.disabled = false

    this.model.update() //обращаемся к мотоду модели при загрузке страницы 
  }
}


const minskClockView = new ClockViewDOM({size:400});
const minskClockModel = new Model('GMT+3');
const minskClockController = new Controller();

const container_1 = document.querySelector('.container_1')

minskClockView.init(container_1);
minskClockModel.init(minskClockView);
minskClockController.init(minskClockModel, container_1)

//=================================================================
const londonClockView = new ClockViewSVG({size:400});
const londonClockModel = new Model('GMT');
const londonClockController = new Controller();

const container_2 = document.querySelector('.container_2')

londonClockView.init(container_2);
londonClockModel.init(londonClockView);
londonClockController.init(londonClockModel, container_2)

//====================================================ViewCanvas
const berlinClockView = new ClockViewCanvas({size:400});
const berlinClockModel = new Model('GMT+1');
const berlinClockController = new Controller();

const container_3 = document.querySelector('.container_3')

berlinClockView.init(container_3);
berlinClockModel.init(berlinClockView);
berlinClockController.init(berlinClockModel, container_3)




