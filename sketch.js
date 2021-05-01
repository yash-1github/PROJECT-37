var db;
var gs = 0;
var pc = 0;
var limit = 25;
var ansarray = [];
var namearray = [];
var p1,p2;

function setup(){
    createCanvas(1200,700);
   
    db= firebase.database();
    db.ref("gamestate").on("value" , function(data){
        gs = data.val();
    })
    db.ref("playercount").on("value", function(data){
        pc = data.val();
    })
     
    heading = createElement("h1");
    heading.html("MY QUIZ GAME")
    heading.position(550, 75);
    
    question = createElement("h3");
    question.html("If a fire accidents takes place at the following places on the same time, where will the ambulance go first to estinguish the fire?")
    question.position(200, 150);

    option1 = createElement("h3");
    option1.html("1 : Hospital")
    option1.position(200,180);
    option2 = createElement("h3");
    option2.html("2 : School")
    option2.position(200,210);
    option3 = createElement("h3");
    option3.html("3 : Temple")
    option3.position(200,240);
    option4 = createElement("h3");
    option4.html("4 : None of these")
    option4.position(200,270);

   names = createInput();
   names.attribute("placeholder" ,   "ENTER YOUR NAME");
   names.style("textAlign", "center");
   names.style("width", "300px");
   names.style("height", "40px");
   names.position(300, 400);
   
   response = createInput();
   response.attribute("placeholder" ,   "ENTER YOUR ANSWER");
   response.style("textAlign", "center");
   response.style("width", "300px");
   response.style("height", "40px");
   response.position(700, 400);

  submit = createButton();
  submit.html("SUBMIT");
  submit.style( "borderRadius", "10px");
  submit.style("width", "100px");
  submit.style("height", "50px");
  submit.position(600,550);

  reset = createButton();
  reset.html("RESET");
  reset.style( "backgroundColor" , "red");
  reset.style( "borderRadius", "10px");
  reset.style("width", "100px");
  reset.style("height", "50px");
  reset.position(1100,650);
  reset.mousePressed(resetdb);
  submit.mousePressed(regisplayer);

}

function draw(){
    background("pink");

    if(pc === 2){
        gs = 1;
        result();
        db.ref("/").update({
            gamestate : gs
        })
        
    }

    if(gs === 1 && namearray.length === pc && ansarray.length ===pc && namearray.includes(undefined) === false){
     p1 = createElement("h3").html(namearray[0] + " : " + ansarray[0]).position(300,400);
     p2 = createElement("h3").html(namearray[1] + " : " + ansarray[1]).position(300,430);
    }
   
    drawSprites();
}

function regisplayer(){
   pc = pc+1;
   db.ref("/").update({
       playercount : pc
   })

   db.ref("players/player"+ pc).set({
       name : names.value(),
       answer : response.value()
   })

   response.hide();
   names.hide();
   submit.hide();
   question.hide();
   option1.hide();
   option2.hide();
   option3.hide();
   option4.hide();
}

function resetdb(){
    db.ref("/").update({playercount : 0, gamestate : 0 });
    db.ref("players").remove();
  
  }

  function result(){
    if(pc === 2 && limit ===25 ){
      for(var i = 1 ; i<pc+1 ; i++){
          db.ref("players/player"+ i+ "/name").on("value" , function(data){
              namearray.push(data.val());
          })
      }

      for(var i = 1 ; i<pc+1 ; i++){
        db.ref("players/player"+ i+ "/answer").on("value" , function(data){
            ansarray.push(data.val());
        })
        limit = 0;
    }

    
    }

}