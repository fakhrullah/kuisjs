/*
 * Kuis 
 * 
 * Kuis.js (kuis dot js)
 * ---------------------------------------------
 * author:  Mohd Fakhrullah 
 * email : fakhrul@fajarhac.com
 * version: 1.1.0
 * ----------------------------------------------
 * 
 */

function Kuis(){
	
    /**--------nav---------**/	
    this.nav = function nav(){
        var self = this;
        //home
        $("#home").click(function(){
            self.showHide(".qa",0);// qaSect(0); //hide qa
            self.showHide('.lists',1);//Sect(1); //show lists
            // hide next,prev,qa_id button
            self.showHidden("#next",0);
            self.showHidden("#prev",0);
            self.showHidden("#qaId",0);
            // read user correct wrong data then adjust view
            self.setData("correctWrongData",0);
        });
        //next
        $("#next").click(function(){
            self.nextQuestion();
        });
        $("#prev").click(function(){
            self.prevQuestion();
        });

    }
    this.nextQuestion = function nextQuestion(){
        var  qa_id = $("#q").attr("data-q-num");
        if(qa_id != this.countQuestions()-1){
            qa_id ++;
            this.writeQA(qa_id);
        // get qa_id, add by 1, write qa
        }
		
    }
    this.prevQuestion = function prevQuestion(){
        var  qa_id = $("#q").attr("data-q-num");
        if(qa_id != 0){
            qa_id --;
            this.writeQA(qa_id);
        // get qa_id, add by 1, write qa
        }
    }
    
    /**-------- Getters from data.js [json]---------**/	
    // count all questions from data json
    this.countQuestions = function countQuestions(){
        return qa.length;
    }
    //
    this.getQuestion = function getQuestion(qa_id){
        return qa[qa_id].question;
    }
    this.getAnswers = function getAnswers(qa_id){
    	//var separator = "<#>"; // old
		var separator = "<::>";
        return qa[qa_id].choices.split(separator);
    }
    this.getAnswerId = function getAnswerId(qa_id){
        return qa[qa_id].answer;
    }
    this.getExtraClass = function getExtraClass(qa_id){
        return qa[qa_id].extra_class;
    }
    
    /**--------list---------**/	
    // write lists questions, write number
    this.writeQuestionLists = function writeQuestionLists(){
        var ulOpen = "<ul>";
        var ulClose = "</ul>";
		
        var qLists="";
        var allQuestions = this.countQuestions();
        //var extraClass= this.getExtraClass(qa_id);
        var cls="";
        for( var x=1; x<=allQuestions; x++ ){
            qLists += "<li id='"+x+"' class='"+this.getExtraClass(x-1)+" "+cls+"' >"+ x +"</li>";			
        }

        $(".lists").html(
            ulOpen
            + qLists
            + ulClose
            );
        this.setData("correctWrongData",0);
    }
    this.clickLists = function clickLists(){
        var self = this;
        var qa_id=0;
        $(".lists li").click(function(){
            qa_id = parseInt( $(this).attr("id") ) - 1;
            self.showHide(".lists",0); //hide lists
            self.showHide(".qa",1); // show qa
            self.writeQA(qa_id);
        });
    // self.msg("qa_id",qa_id);
    }
    /**--------qa---------**/	

    // write html kuis from data
    this.writeQA = function writeQA(qa_id){
        // show or hide next if available
        if( qa_id < (this.countQuestions()-1) ) this.showHidden("#next",1);
        else this.showHidden("#next",0);

        if( qa_id != 0 ) this.showHidden("#prev",1);
        else this.showHidden("#prev",0);

        //write question number adn status, green if answered and correct (from data) else default color
        $("#qaId").html(qa_id+1);
        // show qa_id 
        this.showHidden("#qaId",1);

        var ulOpen = "<ul>";
        var ulClose = "</ul>";
        var question = this.getQuestion(qa_id);
        var answers = this.getAnswers(qa_id);
        var answer = this.getAnswerId(qa_id);
        // answer choices
        var answerChoices ="";
        var cls="";
        for ( var x=0; x<answers.length; x++){
            if ( x==answer ) cls="ans";
            else cls="";
            answerChoices += "<li class='choices "
                +cls+"' >"
                +answers[x]
                +"</li>";			
        }
		
        $(".qa").html( 
            '<div id="q" data-q-num="'+qa_id+'">'+ question + '</div>'
            + ulOpen 
            + answerChoices
            + ulClose );
        this.clickChoices();
        // this.msg("answer id",answer)

        // set qaId lime color if corrected before, get from data
        var dataQaId = $("#qaId").text();
        this.setData("getCorrectWrong",dataQaId);
    }
    this.clickChoices = function clickChoices(){
        var self = this;
        $(".choices").click(function(){
            if( $(this).siblings(".chosed").length < 1 ){
                var qaId = $("#qaId").text();
                //self.msg(" check if this hasClass ans setData");
                if ( $(this).hasClass("ans") ){
                    self.setData("updateCorrectWrong",qaId);
                //self.msg(qaId);
                } 
            }else self.msg(" do nothing");
            $(this).addClass("chosed");
        });
    }
    /**-------user data (localStorage)---------**/
    this.supports_html5_storage = function supports_html5_storage() {
        if (Modernizr.localstorage) {
            // window.localStorage is available!
            this.msg("localStorage supported!");
        } else {
            this.msg("error in saving data bcoz localStorage not supported!");
            alert("Maaf, pelayar(browser) anda tidak boleh menyimpan data menggunakan localStorage, jadi xdapat nk simpa data. Main je, tanpa save data boleh lah.");
        // no native support for HTML5 storage :(
        // maybe try dojox.storage or a third-party solution
        }
    }
    this.setData = function setData(what,data){
        var correctWrong, userCorrectWrong;
        switch(what){
            case "version":
                var currentVersion = localStorage.getItem("version");
                if(currentVersion === null || currentVersion<data){
                    localStorage.setItem("version",data);
                    this.msg("set version : ",currentVersion);
                }else{
                // expand correctWrong data , and change version
                }
                this.msg("cur version",currentVersion);
                break;
            case "correctWrongData":
                correctWrong = localStorage.getItem("correctWrong");
                var allQuestions = this.countQuestions();
                
                if( correctWrong === null || correctWrong === ""){
                    //intialize data
                    var initData = "";
                    for (var x=0 ; x< allQuestions; x++){
                        initData += "0";
                    }
                    localStorage.setItem("correctWrong",initData);
                    this.msg("init data : ",initData);
                    correctWrong = localStorage["correctWrong"];
                }
                // add correctworng data for added data.
                else if(  correctWrong.split('').length < allQuestions){
                    //add more data
                    this.msg("add data");
                    
                    var newAddedCorrectWrong ='';
                    // count differents
                    var diff = allQuestions - correctWrong.split('').length;
                    // create "0" for not enough data
                    for (var y=0 ; y< diff; y++){
                            newAddedCorrectWrong += "0";
                    }
                    // add to current data
                    correctWrong += newAddedCorrectWrong;
                    // set to localstorage
                    localStorage.setItem("correctWrong", correctWrong);
                    this.msg("init data : ",correctWrong);
                    correctWrong = localStorage["correctWrong"];
               }/**/else{
                // expand correctWrong data , and change version
                }
                // read data then use it
                userCorrectWrong = correctWrong.split("");
                for (var y=0; y<allQuestions; y++){
                    //this.msg(""+y,userCorrectWrong[y]);
                    var qId = y+1;
                    if(userCorrectWrong[y]==1){
                        this.msg(qId,"corrected")
                        $("#"+qId).addClass("corrected");
                    }
                }
                this.msg("correctWrongData",localStorage["correctWrong"]);
                break;
            case "updateCorrectWrong":
                correctWrong = localStorage.getItem("correctWrong");
                // read data then use it
                userCorrectWrong = correctWrong.split("");
                data = data -1;
                userCorrectWrong[data] = 1;
                localStorage["correctWrong"] = userCorrectWrong.join("");
                this.msg("correctWrongData",localStorage["correctWrong"]);
                break;
            case "getCorrectWrong":
                correctWrong = localStorage.getItem("correctWrong");
                // read data then use it
                userCorrectWrong = correctWrong.split("");
                data = data -1;
                localStorage["correctWrong"] = userCorrectWrong.join("");
                if(userCorrectWrong[data] == 1)$("#qaId").addClass("corrected");
                else $("#qaId").removeClass("corrected");
                this.msg("getWrongData",localStorage["correctWrong"]);
                break;
        }
    }
    
    /**-------- touch user experience---------**/
    this.ui = function ui(){
        var self=this;
        var s1,s2,op=0;
        // check if scroll or not
        var userHasScrolled = false;
        window.onscroll = function (e){
            userHasScrolled = true;
        }
        var motionTriggerDistance = (window.innerWidth > 0) ? window.innerWidth/3 : screen.width/3;
        document.getElementsByClassName('qa')[0].addEventListener('touchstart', function(e){
			
            //console.log(e.changedTouches[0].pageX);
            s1 = e.changedTouches[0].pageX;
        }, false);
        document.getElementsByClassName('qa')[0].addEventListener('touchend', function(e){
            //console.log(e.changedTouches[0].pageX);
            $(this).css('left','0');
            s2 = e.changedTouches[0].pageX;
            var distance = s2-s1;
            if(s2-s1>motionTriggerDistance){
                console.log('next',distance);
                self.prevQuestion();
            }else if(s2-s1<-motionTriggerDistance){
                console.log('prev',distance);
                self.nextQuestion();
            }
            op=1;
            userHasScrolled = false;
        }, false);
        document.getElementsByClassName('qa')[0].addEventListener('touchmove', function(e){
            op=e.changedTouches[0].pageX-s1;
            // if(!userHasScrolled)
                e.preventDefault();
            if(op>40){
                //e.preventDefault();
                $(this).css('left',op-40);
            }
            if(op<-40){
                //e.preventDefault();
                $(this).css('left',op+40);
            }
        }, false);
    }
	
    /**--------useable function---------**/	
    this.showHide = function showHide(elem, hide){
        // 0-> hide, 1-> show
        if (hide==0) $(elem).removeClass("show").addClass("hide");
        else if (hide==1) $(elem).removeClass("hide").addClass("show");
        else this.msg("Error show and hide : "+elem);
    }
    this.showHidden = function showHidden(elem, hidden){
        // 0-> hide, 1-> show
        if (hidden==0) $(elem).removeClass("show").addClass("hidden");
        else if (hidden==1) $(elem).removeClass("hidden").addClass("show");
        else this.msg("Error show and hide : "+elem);
    }

    /**------main--------**/
    // this.msg(this.countQuestions(),qa[0].choices.split(",")[0]);
    this.msg = function msg(str1,str2,str3){
        str1 = str1 || "str1";
        str2 = str2 || "str2";
        str3 = str3 || "str3";
        //console.log( str1 + " <> " + str2 + " <> " + str3);
        console.log( str1,str2,str3);
    }
    this.init = function init(){
        var version = 1;
        var self = this;
        this.supports_html5_storage();
        this.setData("version",version);
        //alert("hi");
        this.writeQuestionLists();
        this.clickLists();
        this.nav();
        //this.writeQA(3);
        //this.clickChoices();
        this.ui();
        window.applicationCache.addEventListener('cached', console.log("cached!"));
		
    }
}
var kuis = new Kuis();
kuis.init();
