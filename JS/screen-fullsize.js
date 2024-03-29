let seq =0;
var maincanvas=[];
let vx1=0;
let vx2=0;
let vx3=0;
let vx4=0;
let vx5=0;



var playButton;
var timerButton;
var languageBtn;
var scanImage;
var scanCanvas;
let scanLine = 0;



//timer
var counter =0;
var seconds,minutes;


let overAlltexture;
let texture1;
let texture2;

let startCanvas;

//shader
let theShader;
let Img;
let WebglCanvas;
let WebglCanvas2;


//text
let scriptCanvas;
var dialogp = []; //popup
var dialogs = []; //move
let moveScript;
let moveNum;
let popScript;
let moveEn;
let popEn;
let moveCh;
let popCh;
let typeCh;
let popNum;
var dialogT = [];
let typeScript;
let typeNum;

  

// cloud image
let cloud=[];
let cloud1img;
var vx =0;
let info=[];


//glitch
const maxXChange = 125;
const maxYChange = 5;
const yNoiseChange = 0.01;
const mouseYNoiseChange = 0.3;
const timeNoiseChange = 0.013;

let inverted = false;

const micSampleRate = 44100;

const freqDefinition = 8192;


const minFreqHz = 2300;//C3
const maxFreqHz = 2500;//C7


let mic, fft, spectrum;
let historygram;
let sounds = [];

let enFont;
let chFont;







function preload(){

	mic= loadSound("Asset/Sound/noise1min.mp3");

	scanImage = loadImage("Asset/Image/testcloud.jpeg");

	overAlltexture = loadImage('Asset/bgAssets/texture.png');
	texture1=loadImage("Asset/bgAssets/texture1.png")
	texture2=loadImage("Asset/bgAssets/texture2.png")
	enFont=loadFont('Asset/Font/enFont0.7.ttf');
	chFont=loadFont("Asset/Font/chFont0.8.ttf");

	moveEn = loadTable("Asset/CSV/moveScript.csv","csv", "header");
	popEn = loadTable("Asset/CSV/popScript.csv","csv", "header");
	typeScript = loadTable("Asset/CSV/typeScript.csv","csv", "header");
	//chinese version
	moveCh = loadTable("Asset/CSV/moveScript-c.csv","csv", "header");
	popCh= loadTable("Asset/CSV/popScript-c.csv","csv", "header");

	//load Shader
	theShader0 = loadShader('shaders/shader1.vert', 'shaders/shader1.frag');
	theShader = new p5.Shader(this.renderer,vert,frag);
	Img = loadImage('Asset/bgAssets/canvastexture.png');

	// preload cloud images, cloud1img, cloud2img, cloud3img, etc.... please add more....
	cloud1img = loadImage("Asset/Image/cloud1.png");

	//cloud images : x, y, image, scale, borntime
	cloud[0] = new Cloud(windowWidth,windowHeight/5,cloud1img,0.5,15000,false);
	cloud[1] = new Cloud(windowWidth,windowHeight/5,cloud1img,1,20000,false);
	cloud[2] = new Cloud(windowWidth,windowHeight/5,cloud1img,2,35000,false);
	cloud[3] = new Cloud(windowWidth,windowHeight/5,cloud1img,3,35000,false);

	//load sound chunks
	sounds[0]= loadSound("Asset/Sound/000.mp3");
	sounds[1]= loadSound("Asset/Sound/001.mp3");
	sounds[2]= loadSound("Asset/Sound/002.mp3");
	sounds[3]= loadSound("Asset/Sound/003.mp3");
	sounds[4]= loadSound("Asset/Sound/004.mp3");
	sounds[5]= loadSound("Asset/Sound/005.mp3");
	
}


function setup() {


	//new
	fft = new p5.FFT(0.0, 1024);
	sounds[seq].connect(fft);
	sounds[seq].onended(soundloop);
	sounds[0].play();
	sounds[0].amp(1);
	frameRate(10);
	background(0);
	startCanvas = createGraphics(windowWidth,windowHeight);
	scriptCanvas = createGraphics(windowWidth,windowHeight);
	scanCanvas = createGraphics(windowWidth,windowHeight);
	
	// monitor size setup
	createCanvas(1920, 5400);

	//shader setup
    WebglCanvas = createGraphics(1920,5400,WEBGL);
	pixelDensity(1);
	noStroke();

	WebglCanvas2 = createGraphics(1920,5400,WEBGL);
	pixelDensity(1);
	noStroke();
    


	// text script running
	moveScript=moveEn;
	popScript=popEn;
	moveNum = moveScript.getRowCount();
		
	let x = moveScript.getColumn("X");
	let y = moveScript.getColumn("Y");
	let text = moveScript.getColumn("Text");
	let font = moveScript.getColumn("Font");
	let color = moveScript.getColumn("Color");
	let size = moveScript.getColumn("Size");
	let speed = moveScript.getColumn("Speed");
	let time = moveScript.getColumn("Borntime");
	

	for(let i = 0; i< moveNum ; i++){
		dialogs[i]= new Dialog(Number(x[i])*windowWidth, Number(y[i])*windowHeight, text[i], eval(font[i]),color[i],Number(size[i]),Number(speed[i]),Number(time[i]),false);
	}
	

	popNum = popScript.getRowCount();

	let px = popScript.getColumn("X");
	//print("x"+px);
	let py = popScript.getColumn("Y");
	let ptext = popScript.getColumn("Text");
	let pfont = popScript.getColumn("Font");
	let pcolor = popScript.getColumn("Color");
	let psize = popScript.getColumn("Size");
	let pborntime = popScript.getColumn("Borntime");
	let pdeadtime = popScript.getColumn("Deadtime");



	for(let z = 0; z< popNum ; z++){
	
		dialogp[z]= new DialogP(Number(px[z])*windowWidth, Number(py[z])*windowHeight, ptext[z], eval(pfont[z]),pcolor[z],Number(psize[z]),pborntime[z],pdeadtime[z],false);
		
	}

	typeNum = typeScript.getRowCount();
	//X,Y,X1,Y1,N,Text,Font,Color,Size,Speed
	let xT = typeScript.getColumn("X");
	let yT = typeScript.getColumn("Y");
	let xT1 = typeScript.getColumn("X1");
	let yT1 = typeScript.getColumn("Y1");
	let n = typeScript.getColumn("N");
	let textT = typeScript.getColumn("Text");
	let fontT = typeScript.getColumn("Font");
	let colorT = typeScript.getColumn("Color");
	let sizeT = typeScript.getColumn("Size");
	let borntimeT = typeScript.getColumn("Borntime");
	let speedT = typeScript.getColumn("Speed");

	for(let q = 0; q< typeNum ; q++){
	
		dialogT[q]= new DialogT(Number(xT[q])*windowWidth, Number(yT[q])*windowHeight,Number(xT1[q])*windowWidth, Number(yT1[q])*windowHeight, Number(n[q]),textT[q], eval(fontT[q]),colorT[q],Number(sizeT[q]),borntimeT[q],Number(speedT[q]),false);
		//print(pfont);
	
	}

	
	
	maincanvas[0] = createGraphics(windowWidth,10000);
	maincanvas[1] = createGraphics(windowWidth,10000);
	maincanvas[2] = createGraphics(windowWidth,10000);
	maincanvas[3] = createGraphics(windowWidth,10000);
	maincanvas[4] = createGraphics(windowWidth,10000);
	maincanvas[5] = createGraphics(windowWidth,10000);
	
}



function draw() {

	sounds[seq].onended(soundloop);
	frameRate(10);
	background(0);
	theShader.setUniform('u_resolution',[width,height])
	theShader.setUniform('u_time',millis()/1000)
	theShader.setUniform('tex0',WebglCanvas)
	theShader.setUniform('tex1',Img)
	WebglCanvas2.shader(theShader)
	WebglCanvas2.rect(-width/2,-height/2,5400,6000)


	// draw strokes on 5 canvases

	if(seq >=0){
	vx=vx+5;
	spectrum = fft.analyze();
	if(frameCount%200==0){console.log(vx+"vxxxxx");}
	

	//define stroke color
	let colorR = 176 + random(-50,100);
	let colorG = 73 + random(10,50);
	let colorB = 20 + random(-30,30);

	



		// draw sound stroke
	for (let i = maxFreqHz; i >= minFreqHz; i--) {
			let index = maxFreqHz - i;
			let energy1000 = fft.getEnergy(1000);
			let iEngergy = fft.getEnergy(i);

			let intensity = (fft.getEnergy(i)-fft.getEnergy(1000))*2.5;
			let intensityX= map(intensity,0,300,0.5,5);

			// new
			let transp = map(intensity,150,255,0,100);
			let widthhis = map(intensity,0,400,1,10);
			maincanvas[0].stroke(intensity/3,intensity/3,intensity/3,transp);

			if(frameCount % 10 <3){
				maincanvas[0].stroke(218,18,32,50,90);
			}
			else if(frameCount % 10 >=3 && frameCount <6)
			{
				maincanvas[0].stroke(106,33,228);
			}
			else if(frameCount%10 >=6){
				maincanvas[0].stroke(21,49,190,90);
			}



			if(intensity>120){

				let x = index / (maxFreqHz - minFreqHz - 1) * windowWidth;
				maincanvas[0].line(x,height+3-vx, x,height-vx);
			}

			if(intensity>220){
				maincanvas[0].stroke(intensity,intensity,intensity,transp/5);
				let x = index / (maxFreqHz - minFreqHz - 1) * width;
				maincanvas[0].noStroke();
				// let colorR = 176 + random(-50,100);
				// let colorG = 73 + random(10,50);
				// let colorB = 20 + random(-30,30);

				// stroke color(R,G,B,,alpha)
				maincanvas[0].fill(colorR,colorG,colorB,2);
				maincanvas[0].rect(x,height-vx,widthhis,2);
				maincanvas[0].fill(colorR,colorG,colorB,5);
				maincanvas[0].ellipse(x,height-vx,widthhis+10);
				maincanvas[0].fill(colorR,colorG,colorB,7);
				maincanvas[0].ellipse(x,height-vx,widthhis+6);
				maincanvas[0].fill(colorR,colorG,colorB,9);
				maincanvas[0].ellipse(x,height-vx,widthhis+3);
				maincanvas[0].fill(colorR,colorG,colorB,11);
				maincanvas[0].ellipse(x,height-vx,widthhis);
			}

		}

	}



		// 第二个Canvas
		if(seq >= 1){
			vx1=vx1+5;
			spectrum = fft.analyze();
		
		
			// draw sound stroke
			for (let i = maxFreqHz; i >= minFreqHz; i--) {
					let index = maxFreqHz - i;
					let energy1000 = fft.getEnergy(1000);
					let iEngergy = fft.getEnergy(i);
		
					let intensity = (fft.getEnergy(i)-fft.getEnergy(1000))*2.5;
					let intensityX= map(intensity,0,300,0.5,5);
		
					// new
					let transp = map(intensity,150,255,0,100);
					let widthhis = map(intensity,0,400,1,10);
					maincanvas[1].stroke(intensity/3,intensity/3,intensity/3,transp);
		
					if(frameCount % 10 <3){
						maincanvas[1].stroke(218,18,32,50,90);
					}
					else if(frameCount % 10 >=3 && frameCount <6)
					{
						maincanvas[1].stroke(106,33,228);
					}
					else if(frameCount%10 >=6){
				
						maincanvas[1].stroke(21,49,190,80);
					}
		
			
		
					if(intensity>120){
						let x = index / (maxFreqHz - minFreqHz - 1) * windowWidth;
						maincanvas[1].line(x,height+2-vx1, x,height-vx1);
					}
		
					if(intensity>200){

						maincanvas[1].stroke(intensity,intensity,intensity,transp/5);
						let x = index / (maxFreqHz - minFreqHz - 1) * width;
						maincanvas[1].noStroke();
						// let colorR = 176 + random(-50,100);
						// let colorG = 73 + random(10,50);
						// let colorB = 20 + random(-30,30);
						maincanvas[1].fill(colorR,colorG,colorB,2);
						maincanvas[1].rect(x,height-vx1,widthhis,2);
						maincanvas[1].fill(colorR,colorG,colorB,5);
						maincanvas[1].ellipse(x,height-vx1,widthhis+10);
						maincanvas[1].fill(colorR,colorG,colorB,7);
						maincanvas[1].ellipse(x,height-vx1,widthhis+6);
						maincanvas[1].fill(colorR,colorG,colorB,9);
						maincanvas[1].ellipse(x,height-vx1,widthhis+3);
						maincanvas[1].fill(colorR,colorG,colorB,11);
						maincanvas[1].ellipse(x,height-vx1,widthhis);
					}
		
				}
		}

				// 第3个Canvas
				if(seq >= 2){
					vx2=vx2+5;
					spectrum = fft.analyze();
					if(frameCount%200==0){console.log(vx2+"vxxx2222222222xx");}
				
					// draw sound stroke
					for (let i = maxFreqHz; i >= minFreqHz; i--) {
							let index = maxFreqHz - i;
							let energy1000 = fft.getEnergy(1000);
							let iEngergy = fft.getEnergy(i);
				
							let intensity = (fft.getEnergy(i)-fft.getEnergy(1000))*2.5;
							let intensityX= map(intensity,0,300,0.5,5);
				
							// new
							let transp = map(intensity,150,255,0,100);
							let widthhis = map(intensity,0,400,1,10);
							//historygram.stroke(intensity/3,intensity/3,intensity/3,transp);
							maincanvas[2].stroke(intensity/3,intensity/3,intensity/3,transp);
				
							if(frameCount % 10 <3){
								//historygram.stroke(218,18,32,50,90);
								maincanvas[2].stroke(218,18,32,50,90);
							}
							else if(frameCount % 10 >=3 && frameCount <6)
							{
								//historygram.stroke(106,33,228);
								maincanvas[2].stroke(106,33,228);
							}
							else if(frameCount%10 >=6){
								//historygram.stroke(21,49,190,80);
								maincanvas[2].stroke(21,49,190,80);
							}
				
						  //  if(frameCount %20 == 0) {console.log("intensity="+intensity); console.log("1000energy"+fft.getEnergy(1000))}
				
							if(intensity>120){
							
				
								// let y = index / (maxFreqHz - minFreqHz - 1) * height;
								// historygram.line(vx-2+intensityX,y, vx+intensityX,y);
				
								let x = index / (maxFreqHz - minFreqHz - 1) * windowWidth;
								//historygram.line(x,height+2-vx, x,height-vx);
								maincanvas[2].line(x,height+2-vx2, x,height-vx2);
							}
				
							if(intensity>200){
				
								//historygram.stroke(intensity,intensity,intensity,transp/5);
								maincanvas[2].stroke(intensity,intensity,intensity,transp/5);
								let x = index / (maxFreqHz - minFreqHz - 1) * width;
								//historygram.noStroke();
								maincanvas[2].noStroke();
								// let colorR = 176 + random(-50,100);
								// let colorG = 73 + random(10,50);
								// let colorB = 20 + random(-30,30);
								// historygram.fill(colorR,colorG,colorB,2);
								// //historygram.rect(vx,y,widthhis,2);
								// historygram.rect(x,height-vx,widthhis,2);
								// historygram.fill(colorR,colorG,colorB,5);
								// historygram.ellipse(x,height-vx,widthhis+10);
								// historygram.fill(colorR,colorG,colorB,7);
								// historygram.ellipse(x,height-vx,widthhis+6);
								// historygram.fill(colorR,colorG,colorB,9);
								// historygram.ellipse(x,height-vx,widthhis+3);
								// historygram.fill(colorR,colorG,colorB,11);
								// historygram.ellipse(x,height-vx,widthhis);
				
				
								maincanvas[2].fill(colorR,colorG,colorB,2);
								//historygram.rect(vx,y,widthhis,2);
								maincanvas[2].rect(x,height-vx2,widthhis,2);
								maincanvas[2].fill(colorR,colorG,colorB,5);
								maincanvas[2].ellipse(x,height-vx2,widthhis+10);
								maincanvas[2].fill(colorR,colorG,colorB,7);
								maincanvas[2].ellipse(x,height-vx2,widthhis+6);
								maincanvas[2].fill(colorR,colorG,colorB,9);
								maincanvas[2].ellipse(x,height-vx2,widthhis+3);
								maincanvas[2].fill(colorR,colorG,colorB,11);
								maincanvas[2].ellipse(x,height-vx2,widthhis);
							}
				
						}
				}





		// the fourth canvas

						if(seq >= 3){
							vx3=vx3+5;
							spectrum = fft.analyze();
							if(frameCount%200==0){console.log(vx3+"333333vxxxxx");}
						
							// draw sound stroke
							for (let i = maxFreqHz; i >= minFreqHz; i--) {
									let index = maxFreqHz - i;
									let energy1000 = fft.getEnergy(1000);
									let iEngergy = fft.getEnergy(i);
						
									let intensity = (fft.getEnergy(i)-fft.getEnergy(1000))*2.5;
									let intensityX= map(intensity,0,300,0.5,5);
						
									// new
									let transp = map(intensity,150,255,0,100);
									let widthhis = map(intensity,0,400,1,10);
									//historygram.stroke(intensity/3,intensity/3,intensity/3,transp);
									maincanvas[3].stroke(intensity/3,intensity/3,intensity/3,transp);
						
									if(frameCount % 10 <3){
										//historygram.stroke(218,18,32,50,90);
										maincanvas[3].stroke(218,18,32,50,90);
									}
									else if(frameCount % 10 >=3 && frameCount <6)
									{
										//historygram.stroke(106,33,228);
										maincanvas[3].stroke(106,33,228);
									}
									else if(frameCount%10 >=6){
										//historygram.stroke(21,49,190,80);
										maincanvas[3].stroke(21,49,190,80);
									}
						
								  //  if(frameCount %20 == 0) {console.log("intensity="+intensity); console.log("1000energy"+fft.getEnergy(1000))}
						
									if(intensity>120){
									
						
										// let y = index / (maxFreqHz - minFreqHz - 1) * height;
										// historygram.line(vx-2+intensityX,y, vx+intensityX,y);
						
										let x = index / (maxFreqHz - minFreqHz - 1) * windowWidth;
										//historygram.line(x,height+2-vx, x,height-vx);
										maincanvas[3].line(x,height+2-vx3, x,height-vx3);
									}
						
									if(intensity>200){
						
										//historygram.stroke(intensity,intensity,intensity,transp/5);
										maincanvas[3].stroke(intensity,intensity,intensity,transp/5);
										let x = index / (maxFreqHz - minFreqHz - 1) * width;
										//historygram.noStroke();
										maincanvas[3].noStroke();
										// let colorR = 176 + random(-50,100);
										// let colorG = 73 + random(10,50);
										// let colorB = 20 + random(-30,30);
										// historygram.fill(colorR,colorG,colorB,2);
										// //historygram.rect(vx,y,widthhis,2);
										// historygram.rect(x,height-vx,widthhis,2);
										// historygram.fill(colorR,colorG,colorB,5);
										// historygram.ellipse(x,height-vx,widthhis+10);
										// historygram.fill(colorR,colorG,colorB,7);
										// historygram.ellipse(x,height-vx,widthhis+6);
										// historygram.fill(colorR,colorG,colorB,9);
										// historygram.ellipse(x,height-vx,widthhis+3);
										// historygram.fill(colorR,colorG,colorB,11);
										// historygram.ellipse(x,height-vx,widthhis);
						
						
										maincanvas[3].fill(colorR,colorG,colorB,2);
										//historygram.rect(vx,y,widthhis,2);
										maincanvas[3].rect(x,height-vx3,widthhis,2);
										maincanvas[3].fill(colorR,colorG,colorB,5);
										maincanvas[3].ellipse(x,height-vx3,widthhis+10);
										maincanvas[3].fill(colorR,colorG,colorB,7);
										maincanvas[3].ellipse(x,height-vx3,widthhis+6);
										maincanvas[3].fill(colorR,colorG,colorB,9);
										maincanvas[3].ellipse(x,height-vx3,widthhis+3);
										maincanvas[3].fill(colorR,colorG,colorB,11);
										maincanvas[3].ellipse(x,height-vx3,widthhis);
									}
						
								}
						}	
						
						
		//the fifth canvas
						
						if(seq >= 4){
							vx4=vx4+5;
							spectrum = fft.analyze();
							
						
							// draw sound stroke
							for (let i = maxFreqHz; i >= minFreqHz; i--) {
									let index = maxFreqHz - i;
									let energy1000 = fft.getEnergy(1000);
									let iEngergy = fft.getEnergy(i);
						
									let intensity = (fft.getEnergy(i)-fft.getEnergy(1000))*2.5;
									let intensityX= map(intensity,0,300,0.5,5);
						
									// new
									let transp = map(intensity,150,255,0,100);
									let widthhis = map(intensity,0,400,1,10);
									//historygram.stroke(intensity/3,intensity/3,intensity/3,transp);
									maincanvas[4].stroke(intensity/3,intensity/3,intensity/3,transp);
						
									if(frameCount % 10 <3){
										//historygram.stroke(218,18,32,50,90);
										maincanvas[4].stroke(218,18,32,50,90);
									}
									else if(frameCount % 10 >=3 && frameCount <6)
									{
										//historygram.stroke(106,33,228);
										maincanvas[4].stroke(106,33,228);
									}
									else if(frameCount%10 >=6){
										//historygram.stroke(21,49,190,80);
										maincanvas[4].stroke(21,49,190,80);
									}
						
								  //  if(frameCount %20 == 0) {console.log("intensity="+intensity); console.log("1000energy"+fft.getEnergy(1000))}
						
									if(intensity>120){
									
						
										// let y = index / (maxFreqHz - minFreqHz - 1) * height;
										// historygram.line(vx-2+intensityX,y, vx+intensityX,y);
						
										let x = index / (maxFreqHz - minFreqHz - 1) * windowWidth;
										//historygram.line(x,height+2-vx, x,height-vx);
										maincanvas[4].line(x,height+2-vx4, x,height-vx4);
									}
						
									if(intensity>200){
						
										//historygram.stroke(intensity,intensity,intensity,transp/5);
										maincanvas[4].stroke(intensity,intensity,intensity,transp/5);
										let x = index / (maxFreqHz - minFreqHz - 1) * width;
										//historygram.noStroke();
										maincanvas[4].noStroke();
										// let colorR = 176 + random(-50,100);
										// let colorG = 73 + random(10,50);
										// let colorB = 20 + random(-30,30);
										// historygram.fill(colorR,colorG,colorB,2);
										// //historygram.rect(vx,y,widthhis,2);
										// historygram.rect(x,height-vx,widthhis,2);
										// historygram.fill(colorR,colorG,colorB,5);
										// historygram.ellipse(x,height-vx,widthhis+10);
										// historygram.fill(colorR,colorG,colorB,7);
										// historygram.ellipse(x,height-vx,widthhis+6);
										// historygram.fill(colorR,colorG,colorB,9);
										// historygram.ellipse(x,height-vx,widthhis+3);
										// historygram.fill(colorR,colorG,colorB,11);
										// historygram.ellipse(x,height-vx,widthhis);
						
						
										maincanvas[4].fill(colorR,colorG,colorB,2);
										//historygram.rect(vx,y,widthhis,2);
										maincanvas[4].rect(x,height-vx4,widthhis,2);
										maincanvas[4].fill(colorR,colorG,colorB,5);
										maincanvas[4].ellipse(x,height-vx4,widthhis+10);
										maincanvas[4].fill(colorR,colorG,colorB,7);
										maincanvas[4].ellipse(x,height-vx4,widthhis+6);
										maincanvas[4].fill(colorR,colorG,colorB,9);
										maincanvas[4].ellipse(x,height-vx4,widthhis+3);
										maincanvas[4].fill(colorR,colorG,colorB,11);
										maincanvas[4].ellipse(x,height-vx4,widthhis);
									}
						
								}
						}


							
						if(seq >= 5){
							vx5=vx5+5;
							spectrum = fft.analyze();
							
						
							// draw sound stroke
							for (let i = maxFreqHz; i >= minFreqHz; i--) {
									let index = maxFreqHz - i;
									let energy1000 = fft.getEnergy(1000);
									let iEngergy = fft.getEnergy(i);
						
									let intensity = (fft.getEnergy(i)-fft.getEnergy(1000))*2.5;
									let intensityX= map(intensity,0,300,0.5,5);
						
									// new
									let transp = map(intensity,150,255,0,100);
									let widthhis = map(intensity,0,400,1,10);
									//historygram.stroke(intensity/3,intensity/3,intensity/3,transp);
									maincanvas[5].stroke(intensity/3,intensity/3,intensity/3,transp);
						
									if(frameCount % 10 <3){
										//historygram.stroke(218,18,32,50,90);
										maincanvas[5].stroke(218,18,32,50,90);
									}
									else if(frameCount % 10 >=3 && frameCount <6)
									{
										//historygram.stroke(106,33,228);
										maincanvas[5].stroke(106,33,228);
									}
									else if(frameCount%10 >=6){
										//historygram.stroke(21,49,190,80);
										maincanvas[5].stroke(21,49,190,80);
									}
						
								  //  if(frameCount %20 == 0) {console.log("intensity="+intensity); console.log("1000energy"+fft.getEnergy(1000))}
						
									if(intensity>120){
									
						
										// let y = index / (maxFreqHz - minFreqHz - 1) * height;
										// historygram.line(vx-2+intensityX,y, vx+intensityX,y);
						
										let x = index / (maxFreqHz - minFreqHz - 1) * windowWidth;
										//historygram.line(x,height+2-vx, x,height-vx);
										maincanvas[5].line(x,height+2-vx5, x,height-vx5);
									}
						
									if(intensity>200){
						
										//historygram.stroke(intensity,intensity,intensity,transp/5);
										maincanvas[5].stroke(intensity,intensity,intensity,transp/5);
										let x = index / (maxFreqHz - minFreqHz - 1) * width;
										//historygram.noStroke();
										maincanvas[5].noStroke();
										// let colorR = 176 + random(-50,100);
										// let colorG = 73 + random(10,50);
										// let colorB = 20 + random(-30,30);
										// historygram.fill(colorR,colorG,colorB,2);
										// //historygram.rect(vx,y,widthhis,2);
										// historygram.rect(x,height-vx,widthhis,2);
										// historygram.fill(colorR,colorG,colorB,5);
										// historygram.ellipse(x,height-vx,widthhis+10);
										// historygram.fill(colorR,colorG,colorB,7);
										// historygram.ellipse(x,height-vx,widthhis+6);
										// historygram.fill(colorR,colorG,colorB,9);
										// historygram.ellipse(x,height-vx,widthhis+3);
										// historygram.fill(colorR,colorG,colorB,11);
										// historygram.ellipse(x,height-vx,widthhis);
						
						
										maincanvas[5].fill(colorR,colorG,colorB,2);
										//historygram.rect(vx,y,widthhis,2);
										maincanvas[5].rect(x,height-vx5,widthhis,2);
										maincanvas[5].fill(colorR,colorG,colorB,5);
										maincanvas[5].ellipse(x,height-vx5,widthhis+10);
										maincanvas[5].fill(colorR,colorG,colorB,7);
										maincanvas[5].ellipse(x,height-vx5,widthhis+6);
										maincanvas[5].fill(colorR,colorG,colorB,9);
										maincanvas[5].ellipse(x,height-vx5,widthhis+3);
										maincanvas[5].fill(colorR,colorG,colorB,11);
										maincanvas[5].ellipse(x,height-vx5,widthhis);
									}
						
								}
						}




	image(WebglCanvas2,0,0,width,height);


	push()
	blendMode(DIFFERENCE)
	blendMode(DARKEST)

	pop()
	
	image(maincanvas[0],0,-5400+vx);
	image(maincanvas[1],0,-5400+vx1);
	image(maincanvas[2],0,-5400+vx2);
	image(maincanvas[3],0,-5400+vx3);
	image(maincanvas[4],0,-5400+vx4);
	image(maincanvas[5],0,-5400+vx5);

		image(scriptCanvas,0,0);
	
		

		if(frameCount%15 == 0){
			return;
		}
		else{
			scriptCanvas.clear(0,0,width,height);
		}
		

	if(frameCount%100>80 && frameCount%100<95){
	//	glitch1();
	}

}


function timeIt(){

	counter++;
	minutes =floor(counter/60);
	seconds = counter%60;
	timerButton.html(+ minutes + ":"+ seconds);

}





/*
  function keyPressed() {

	if (keyCode === LEFT_ARROW) {
		if (mic.isPlaying()) {
			// .isPlaying() returns a boolean
			mic.stop();
		  } else {
			mic.play();
			mic.amp(1);
		   // mic.loop();
		  }
	}

  }

  */

//   function timerCount(){
// 	  if(mic.isPlaying()){
// 		counter++;
// 		minutes =floor(counter/60);
// 		seconds = counter%60;
// 		timerButton.html(minutes + ":"+ seconds);
// 	  }
//   }





  function soundloop(){
	  seq += 1;
	  sounds[seq].play();
	  sounds[seq].amp(1); 
	  sounds[seq].connect(fft);
	  console.log("this is number" + seq);
  }







function script(){
	//if(mic.isPlaying()){


	
		for(i=0;i<dialogs.length;i++) {
			
			dialogs[i].show();
			dialogs[i].move();
		}

		for(z=0;z<dialogp.length;z++) {
		
			dialogp[z].show();
		
		}

		for(q=0;q<dialogT.length;q++){
			dialogT[q].show();
		}

		
  }

 
  




  function glitch(){

	let y = floor(random(height));
	let h = floor(random(20, 30)); 
	let xChange = floor(random(-maxXChange/5, maxXChange/5));
	let yChange = floor(xChange/5);
	image(WebglCanvas, xChange - maxXChange, yChange - maxYChange + y, width, h, 0, y, width, h);


  }


  function glitch1(){
	var x1 = floor(random(windowWidth/2,windowWidth/2 +40));
	var y1 = floor(random(10,200));
  
	var x2 = round(x1 + random(-100, 100));
	var y2 = round(y1 + random(-50, 50));
  
	var w = floor(random(10, 300));
	var h = floor(random(10, 500));

	var col = get(x1, y1, w, h)
   
	set(x2, y2, col);
  }




//   function drawImage2(){
//     scanImage.resize(windowWidth,0);
//     let pixelColors = [];

//     if(scanLine<=height){
//         for(let s=0; s<width; s++) {
//             pixelColors[s] = scanImage.get(s,scanLine);
//             let clr = color(pixelColors[s]);
//             clr.setAlpha(100);
//         }
//     }

//     for (let s=0; s<windowWidth;s++) {
//         scanCanvas.noStroke();
//         scanCanvas.fill(pixelColors[s]);
//         scanCanvas.rect(s,scanLine,5,2);
//     }


//     push();
//     blendMode(ADD);
//     blendMode(OVERLAY);
//     image(scanCanvas,0,0);
//     pop();

//     scanLine = scanLine + 1;
// }





 



function languageSwitch(){


	// console.log("hiii"+counter);

	if(moveScript == moveEn){
		moveScript = moveCh;
		popScript = popCh;
		languageBtn.html("Switch to English");
	}
	 else{
		moveScript = moveEn;
		popScript = popEn;
		 languageBtn.html("Switch to Chinese");
	}

	//delete all script array objects

		dialogs.splice(0,dialogs.length);

		dialogp.splice(0,dialogp.length);

		dialogT.splice(0,dialogT.length);	




	//rewrite

	moveNum = moveScript.getRowCount();

	let x = moveScript.getColumn("X");
	let y = moveScript.getColumn("Y");
	let text = moveScript.getColumn("Text");
	let font = moveScript.getColumn("Font");
	let color = moveScript.getColumn("Color");
	let size = moveScript.getColumn("Size");
	let speed = moveScript.getColumn("Speed");
	let time = moveScript.getColumn("Borntime");

	

	for(let i = 0; i< moveNum ; i++){
	
		  if(Number(time[i])>counter*1000){
			  dialogs.push(new Dialog(Number(x[i])*windowWidth, Number(y[i])*windowHeight, text[i], eval(font[i]),color[i],Number(size[i]),Number(speed[i]),Number(time[i]),false));
			  //dialogs[i]= new Dialog(Number(x[i])*windowWidth, Number(y[i])*windowHeight, text[i], eval(font[i]),color[i],Number(size[i]),Number(speed[i]),Number(time[i]),false);
			  }
	}



	popNum = popScript.getRowCount();

	let px = popScript.getColumn("X");
	//print("x"+px);
	let py = popScript.getColumn("Y");
	let ptext = popScript.getColumn("Text");
	let pfont = popScript.getColumn("Font");
	let pcolor = popScript.getColumn("Color");
	let psize = popScript.getColumn("Size");
	let pborntime = popScript.getColumn("Borntime");
	let pdeadtime = popScript.getColumn("Deadtime");



	for(let z = 0; z< popNum ; z++){

		  if(Number(pborntime[z])>counter*1000){
			  dialogp.push(new DialogP(Number(px[z])*windowWidth, Number(py[z])*windowHeight, ptext[z], eval(pfont[z]),pcolor[z],Number(psize[z]),pborntime[z],pdeadtime[z],false));
		//	dialogp[z]= new DialogP(Number(px[z])*windowWidth, Number(py[z])*windowHeight, ptext[z], eval(pfont[z]),pcolor[z],Number(psize[z]),pborntime[z],pdeadtime[z],false);
			//print(pfont);
		  }		
	}

	typeNum = typeScript.getRowCount();
	//X,Y,X1,Y1,N,Text,Font,Color,Size,Speed
	let xT = typeScript.getColumn("X");
	let yT = typeScript.getColumn("Y");
	let xT1 = typeScript.getColumn("X1");
	let yT1 = typeScript.getColumn("Y1");
	let n = typeScript.getColumn("N");
	let textT = typeScript.getColumn("Text");
	let fontT = typeScript.getColumn("Font");
	let colorT = typeScript.getColumn("Color");
	let sizeT = typeScript.getColumn("Size");
	let borntimeT = typeScript.getColumn("Borntime");
	let speedT = typeScript.getColumn("Speed");

	for(let q = 0; q< typeNum ; q++){

			dialogT[q]= new DialogT(Number(xT[q])*windowWidth, Number(yT[q])*windowHeight,Number(xT1[q])*windowWidth, Number(yT1[q])*windowHeight, Number(n[q]),textT[q], eval(fontT[q]),colorT[q],Number(sizeT[q]),borntimeT[q],Number(speedT[q]),false);
			//print(pfont);
		
	
	}
	



}


  