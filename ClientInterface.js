//Interface values
var CharExists1 = 1; var CharName1 = 'Sios'; var CharHpPct1 = 100; var CharHp1 = 3500; var CharMpPct1 = 100; var CharMp1 = 160; var CharActPct1 = 0.01; var CharAct1 = 0;
var CharExists2 = 0; var CharName2 = ''; var CharHpPct2 = 0.01; var CharHp2 = 0; var CharMpPct2 = 0.01; var CharMp2 = 0; var CharActPct2 = 0.01; var CharAct2 = 0;
var EnnemyExists1 = 0; var EnnemyName1 = ''; var EnnemyHpPct1 = 0.01; var EnnemyHp1 = 0; var EnnemyMpPct1 = 0.01; var EnnemyMp1 = 0; var EnnemyActPct1 = 0.01; var EnnemyAct1 = 0;
var EnnemyExists2 = 0; var EnnemyName2 = ''; var EnnemyHpPct2 = 0.01; var EnnemyHp2 = 0; var EnnemyMpPct2 = 0.01; var EnnemyMp2 = 0; var EnnemyActPct2 = 0.01; var EnnemyAct2 = 0;
var vta1 = 0; var vta2 = 0; var vta3 = 0;
var vfs1  = 0; var vfs2 = 0;  var vfs3  = 0; var vfs4  = 0; var vfs5  = 0; var vfs6  = 0; var vfs7  = 0; var vfs8  = 0; var vfs9  = 0; var vfs10  = 0;
var vas1  = 0; var vas2  = 0; var vas3  = 0; var vas4  = 0; var vas5  = 0; var vas6 = 0; var vas7 = 0; var vas8 = 0; var vas9 = 0; var vas10 = 0;
var vnfs1 = ''; var vnfs2 = ''; var vnfs3  = ''; var vnfs4 = ''; var vnfs5 = ''; var vnfs6 = ''; var vnfs7 = ''; var vnfs8 = ''; var vnfs9 = ''; var vnfs10 = '';
var vnas1 = ''; var vnas2 = ''; var vnas3  = ''; var vnas4 = ''; var vnas5 = ''; var vnas6 = ''; var vnas7 = ''; var vnas8 = ''; var vnas9 = ''; var vnas10 = '';
var targetedId = 0;
var channelLog = 1; var LastLogCount = 0;
var channelChat = 1; var LastChatCount = 0;
var onstate = 2;
var fightengaged = 0;
var ws;
var captchaWidgetId;
var captchaIsSet = 0;
var captchaBlock = $('#CaptchaDiv')[0];

var InfoRefresh

/*--INTERFACE PREPARATION--*/
var UserRegistry = "";
var WebSocketLocation = "";
var NewMsgChan1 = 0;
var NewMsgChan2 = 0;
var NewMsgChan3 = 0;
var NewMsgChan4 = 0;
function PrepareConnection(RegNo, Server)
{
    UserRegistry = RegNo;
    WebSocketLocation = Server;
}
function StartInterface()
{
    $("button").button();
    $("#prgCharExp1").progressbar({ value: 1 });
    $("#prgCharExp2").progressbar({ value: 1 });
    $("#prgCharExp3").progressbar({ value: 1 });
    $("#prgCharExp4").progressbar({ value: 1 });
    $("#prgActionTimer").progressbar({ max:100, value: 0.1 });
    $("#ChatSend").click(function () { SendMessage(document.getElementById('txtMessage').value); });
    $("#btnOpen").click(function () { OpenChests(); });
    $("#btnOpenResBag").click(function () { OpenResBag(); });
    $("#btnEvent").click(function () { sendRequestContentFill('getEventScreen.aspx?null='); fightengaged = 0; ChangeLogChannel(2); });
    $("#ChatCh1").click(function () { ChangeChatChannel(1); });  $("#LogCh1").click(function () { ChangeLogChannel(1); });
    $("#ChatCh2").click(function () { ChangeChatChannel(2); });  $("#LogCh2").click(function () { ChangeLogChannel(2); });
    $("#ChatCh3").click(function () { ChangeChatChannel(3); });  $("#LogCh3").click(function () { ChangeLogChannel(3); });
    $("#ChatCh4").click(function () { ChangeChatChannel(4); }); 
    //sendRequestMapFill('getMiniMap.aspx?null=');
    if ('WebSocket' in window) { connect(WebSocketLocation); }
    $("#submitCaptcha").click(function () { 
        sendCaptcha(grecaptcha.getResponse( captchaWidgetId )); 
        $.unblockUI(); 
    });
    captchaBlock = $('#CaptchaDiv')[0];

    $( "#dialogChest" ).dialog({
        autoOpen: false,
        resizable: false
    });
}


/*--CONNECTIVITY--*/
function connect(host) {
    ws = new WebSocket(host);
    ws.onopen = function () {
        $("#ChatLog").append("Connectection established ... waiting for registration<br />");
        ws.send("GETBASE|");
        sendRequestContentFill('GameMenu.aspx');
    };
    ws.onmessage = function (evt) {
        ServerReceptionHandler(evt.data);
    };
    ws.onclose = function () {
        alert("Your connection to the game was closed");
        document.location.href = "Home.aspx";
    };
};

function ServerReceptionHandler(ValueReceived) {
    var Arr = ValueReceived.split("|");
    var Command = Arr[0];
    if (Command == "CONNECTED") {
        $("#ChatLog").append("Registration completed !<br />");
    }
    if (Command == "DISCONNECTED") {
        alert("You connected from another location, this connection will now close.");
        document.location.href = "Home.aspx";
    }
    if (Command == "KICKED") {
        alert("You were kicked out of the game, disconnecting in a few seconds ...");
        document.location.href = "Home.aspx";
    }
    if (Command == "CHATSTART") {
        var Chatinfo = Arr[1];
        $('#ChatLog').html(Chatinfo);
        if (channelChat == 1) { $('#ChatName1').html('Public'); NewMsgChan1 = 0;}
        if (channelChat == 2) { $('#ChatName2').html('Help'); NewMsgChan2 = 0;}
        if (channelChat == 3) { $('#ChatName3').html('Kingdom'); NewMsgChan3 = 0;}
        if (channelChat == 4) { $('#ChatName4').html('Recruit'); NewMsgChan4 = 0;}
    }
    if (Command == "CHATNOTIF") {
        var ChatNum = Arr[1];
        if (ChatNum == 1) { NewMsgChan1++; $('#ChatName1').html('Public (' + NewMsgChan1.toString() + ')');}
        if (ChatNum == 2) { NewMsgChan2++; $('#ChatName2').html('Help (' + NewMsgChan2.toString() + ')');}
        if (ChatNum == 3) { NewMsgChan3++; $('#ChatName3').html('Kingdom (' + NewMsgChan3.toString() + ')');}
        if (ChatNum == 4) { NewMsgChan4++; $('#ChatName4').html('Recruit (' + NewMsgChan4.toString() + ')');}
    }
    if (Command == "LOGSTART") {
        var infoplus = Arr[1];
        $('#MultiLog').html(infoplus);
    }
    if (Command == "CHATNEW") {
        var Chatinfo = Arr[1];
        $('#ChatLog').html(Chatinfo + $('#ChatLog').html());
    }
    if (Command == "LOGNEW") {
        var infoplus = Arr[1];
        $('#MultiLog').html(infoplus + $('#MultiLog').html());
    }
    if (Command == "SETCD") { //actuel, max, text
        var infoCDActual = Arr[1];
        var infoCDMax = Arr[2];
        var infoCDText = Arr[3];
        var timetoAdd = (infoCDActual * 1000);
        mincd = infoCDActual;
        $("#prgActionTimer > .ui-progressbar-value").stop();
        $("#prgActionTimer").progressbar({ value: (100 * infoCDActual / infoCDMax) });
        $("#prgActionTimer > .ui-progressbar-value").animate({width: "0%"}, timetoAdd, "linear");
        $("#prgActionOverlay").html(infoCDText);
        if ($('#prgCharAc1').length) {
            $("#prgCharAc1 > .ui-progressbar-value").stop();
            $("#prgCharAc1").progressbar({ value: (100 * infoCDActual / infoCDMax) });
            $("#prgCharAc1 > .ui-progressbar-value").animate({ width: "0%" }, timetoAdd, "linear");
        }
        SkillCooldowns();

    }
    if (Command == "SETNAME") {
        var infoname = Arr[1];
        var infotitle = Arr[2];
        $('#SideName').html(infoname);
        $('#SideTitle').html(infotitle);
    }
    if (Command == "SETKING") {
        var infoname = Arr[1];
        var infobuilding = Arr[2];
        var infotax = Arr[3];
        $('#SideKingdom').html(infoname);
        $('#SideBuilding').html(infobuilding);
        $('#SideTax').html(infotax + " % tax");
    }
    if (Command == "TIMER") {
        var info1 = Arr[1];
        var info2 = Arr[2];
        var info3 = Arr[3];
        $('#SideBonusTime').html(info1);
        $('#SideBonusExp').html(info2);
        $('#SideBonusSpeed').html(info3);
    }
    if (Command == "SETGOLD") {
        var infogold = Arr[1];
        $('#SideGold').html(abbreviateNumber(infogold).toString());
        $('#SideGold2').html(fullNumDisplay(infogold).toString() + "<br/>Gold Coins");
    }
    if (Command == "SETME") {
        var infome = Arr[1];
        $('#SideME').html(abbreviateNumber(infome).toString());
        $('#SideME2').html(fullNumDisplay(infome).toString() + "<br/>Magic Elements");
    }
    if (Command == "SETGEM") {
        var infogems = Arr[1];
        $('#SideGems').html(abbreviateNumber(infogems).toString());
        $('#SideGems2').html(fullNumDisplay(infogems).toString() + "<br/>Gems");
    }
    if (Command == "SETRELIC") {
        var inforelic = Arr[1];
        $('#SideRelic').html(abbreviateNumber(inforelic).toString());
        $('#SideRelic2').html(fullNumDisplay(inforelic).toString() + "<br/>Relics");
    }
    if (Command == "SETKEY") {
        var infokey = Arr[1];
        $('#SideChest').html(abbreviateNumber(infokey).toString());
        $('#SideChest2').html(fullNumDisplay(infokey).toString() + "<br/>Keys");
        if (infokey != 0) { $("#btnOpen").show(); } else { $("#btnOpen").hide(); }
    }
    if (Command == "SETRESBOX") {
        var inforesbox = Arr[1];
        $('#SideItem').html(abbreviateNumber(inforesbox).toString());
        $('#SideItem2').html(fullNumDisplay(inforesbox).toString() + "<br/>Resource bags");
        if (inforesbox != 0) { $("#btnOpenResBag").show(); } else { $("#btnOpenResBag").hide(); }
    }
    if (Command == "SETTITLECOUNT") {
        var infokey = Arr[1];
        $('#SideSP').html(abbreviateNumber(infokey).toString() + " Titles");
    }
    if (Command == "SETLVL") {
        var infokey = Arr[1];
        $('#SideLvl').html("Level " + abbreviateNumber(infokey).toString());
    }
    if (Command == "CAPTCHA_CHALLENGE") {
        $.blockUI({ message: captchaBlock }); 
            if (captchaIsSet == 0){
                captchaWidgetId = grecaptcha.render('grep1', {
                    'sitekey' : '6Ld9ehsTAAAAAHAlRPXb27P98Ye00_uL7L8f6VGG',
                    'theme' : 'light'
                });   
                captchaIsSet = 1;     
            }
            else{
                grecaptcha.reset(captchaWidgetId);
            }
    }
    if (Command == "NOTIF") {
        var infoMessage = Arr[1];
        $.growlUI('Notification', infoMessage); 
    }
    if (Command == "UNBLOCK") {
        $.unblockUI(); 
    }
    if (Command == "SETLOC") {
        var infocoords = Arr[1];
        var infolevel = Arr[2];
        var infoexp = Arr[3];
        var infotile = Arr[4];
        $('#SideCoords').html(infocoords.toString());
        $('#SideLand').html(infotile.toString());
        $('#SideActLvl').html(infolevel.toString());
        $('#SideActExp').html(infoexp.toString());
    }
    if (Command == "SETKING") {
        var infokingdom = Arr[1];
        var infobuilding = Arr[2];
        var infotax = Arr[3];
        $('#SideKingdom').html(infokingdom.toString());
        $('#SideBuilding').html(infobuilding.toString());
        $('#SideTax').html(infotax.toString() + " % tax");
    }
    if (Command == "SETORE") {
        var infores1 = abbreviateNumber(Arr[1]);
        var infores2 = abbreviateNumber(Arr[2]);
        var infores3 = abbreviateNumber(Arr[3]);
        var infores4 = abbreviateNumber(Arr[4]);
        var infores5 = abbreviateNumber(Arr[5]);
        $('#T1Ore').html(infores1.toString());
        $('#T2Ore').html(infores2.toString());
        $('#T3Ore').html(infores3.toString());
        $('#T4Ore').html(infores4.toString());
        $('#T5Ore').html(infores5.toString());
    }
    if (Command == "SETPLANT") {
        var infores1 = abbreviateNumber(Arr[1]);
        var infores2 = abbreviateNumber(Arr[2]);
        var infores3 = abbreviateNumber(Arr[3]);
        var infores4 = abbreviateNumber(Arr[4]);
        var infores5 = abbreviateNumber(Arr[5]);
        $('#T1Gather').html(infores1.toString());
        $('#T2Gather').html(infores2.toString());
        $('#T3Gather').html(infores3.toString());
        $('#T4Gather').html(infores4.toString());
        $('#T5Gather').html(infores5.toString());
    }
    if (Command == "SETWOOD") {
        var infores1 = abbreviateNumber(Arr[1]);
        var infores2 = abbreviateNumber(Arr[2]);
        var infores3 = abbreviateNumber(Arr[3]);
        var infores4 = abbreviateNumber(Arr[4]);
        var infores5 = abbreviateNumber(Arr[5]);
        $('#T1Wood').html(infores1.toString());
        $('#T2Wood').html(infores2.toString());
        $('#T3Wood').html(infores3.toString());
        $('#T4Wood').html(infores4.toString());
        $('#T5Wood').html(infores5.toString());
    }
    if (Command == "SETFISH") {
        var infores1 = abbreviateNumber(Arr[1]);
        var infores2 = abbreviateNumber(Arr[2]);
        var infores3 = abbreviateNumber(Arr[3]);
        var infores4 = abbreviateNumber(Arr[4]);
        var infores5 = abbreviateNumber(Arr[5]);
        $('#T1Fish').html(infores1.toString());
        $('#T2Fish').html(infores2.toString());
        $('#T3Fish').html(infores3.toString());
        $('#T4Fish').html(infores4.toString());
        $('#T5Fish').html(infores5.toString());
    }
    if (Command == "LOADPAGE") {
        var htmlcontent = Arr[1];
        $('#ContentLoad').html(htmlcontent.toString());
    }
    if (Command == "LOADMINIMAP") {
        var htmlcontent = Arr[1];
        $('#MiniMap').html(htmlcontent.toString());
    }
    if (Command == "LOADKINGMINIMAP") {
        var htmlcontent = Arr[1];
        $('#KingdomMap').html(htmlcontent.toString());
    }
    if (Command == "NLOG") {
        var infochannel = Arr[1];
        var infocontent = Arr[2] + '<br />';
        if (infochannel == 2){
            if ($('#TsLog').length){ $('#TsLog').html(infocontent + $('#TsLog').html()); }
        }else if (infochannel == 3){
            if ($('#ItemLog').length){ $('#ItemLog').html(infocontent + $('#ItemLog').html()); }
        }
    }
    if (Command == "NBLOG") {
        var infocontent = Arr[1] + '<br />';
        if ($('#BLog').length) { $('#BLog').html(infocontent + $('#BLog').html()); }
    }

    if (Command == "LOGSTART") {
        var infochannel = Arr[1];
        var infocontent = Arr[2];
        if (infochannel == 2){
            if ($('#TsLog').length){ $('#TsLog').html(infocontent); }
        }else if (infochannel == 3){
            if ($('#ItemLog').length){ $('#ItemLog').html(infocontent); }
        }
    }
    if (Command == "TSLVL") {
        var infoStatus = Arr[1];
        var infoName = Arr[2];
        var infoLvl = Arr[3];
        var infoExp = Arr[4];
        var infoExpMax = Arr[5];
        var infoExpPct = Arr[6];
        var infoWorkload = Arr[7];
        if ($('#WorkLvl').length){
            $('#WorkLvl').html(infoLvl.toString() + ', ' + infoExpPct.toString() + ' %');
            $('#WorkExp').html(infoExp.toString() + '/' + infoExpMax.toString());
            $('#WorkStatus').html(infoStatus.toString());
            $('#Workload').html(infoWorkload.toString());
        }
    }
    if (Command == "TSBONUS") {
        var infoexplvl = Arr[1];
        var inforeslvl = Arr[2];
        var infoworklvl = Arr[3];
        var infochestlvl = Arr[4];
        var infotierlvl1 = Arr[5];
        var infoexprel = Arr[6];
        var inforesrel = Arr[7];
        var infoworkrel = Arr[8];
        var infochestrel = Arr[9];
        var infotierrel1 = Arr[10];
        if ($('#BonusExp').length){
            $("#BonusExp").html(infoexplvl); $("#ExpRel").html(infoexprel + " relics"); $("#ExpRel2").html(((infoexprel * 10) + 45) + " relics");
            $("#BonusRes").html(inforeslvl); $("#ResRel").html(inforesrel + " relics"); $("#ResRel2").html(((inforesrel * 10) + 45) + " relics");
            $("#BonusWork").html(infoworklvl); $("#WorkRel").html(infoworkrel + " relics"); $("#WorkRel2").html(((infoworkrel * 10) + 45) + " relics");
            $("#BonusChest").html(infochestlvl); $("#ChestRel").html(infochestrel + " relics"); $("#ChestRel2").html(((infochestrel * 10) + 45) + " relics");
            $("#BonusTier").html(infotierlvl1); $("#TierRel").html(infotierrel1 + " relics"); $("#TierRel2").html(((infotierrel1 * 10) + 45) + " relics");
        }
    }
    if (Command == "TSODDS") {
        var infot1 = Arr[1];
        var infot2 = Arr[2];
        var infot3 = Arr[3];
        var infot4 = Arr[4];
        var infot5 = Arr[5];
        var infoo1 = Arr[6];
        var infoo2 = Arr[7];
        var infoo3 = Arr[8];
        var infoo4 = Arr[9];
        var infoo5 = Arr[10];
        if ($('#Tier1Count').length){
            $("#Tier1Count").html(infot1.toString()); 
            $("#Tier2Count").html(infot2.toString()); 
            $("#Tier3Count").html(infot3.toString()); 
            $("#Tier4Count").html(infot4.toString()); 
            $("#Tier5Count").html(infot5.toString()); 
            $("#Tier1Odds").html(infoo1.toString()); 
            $("#Tier2Odds").html(infoo2.toString()); 
            $("#Tier3Odds").html(infoo3.toString()); 
            $("#Tier4Odds").html(infoo4.toString()); 
            $("#Tier5Odds").html(infoo5.toString());
        }
    }
    if (Command == "OPENR") { 
        $('#OpChestCount').html(Arr[1]);
        $('#OpChestDetails').html(Arr[2]);
        $("#dialogChest").dialog("open");
    }
    if (Command == "SETEN1") { 
        var infoName = Arr[1];
        var infoHP = Arr[2];
        if ($('#NameEnn1').length){
            $('#NameEnn1').html(infoName);
            minhp1 = infoHP; maxhp1 = infoHP;
            minac1 = 10; maxac1 = 10;
            $('#prgEnnHp1').animate_progressbar((minhp1 / maxhp1) * 100);
            $('#prgEnnAc1').animate_progressbar((minac1 / maxac1) * 100);
        }
    }
    if (Command == "VALEN1") {
        var infoMinAc = Arr[1];
        var infoMaxAc = Arr[2];
        var infoMinHp = Arr[3];
        if ($('#NameEnn1').length) {
            minhp1 = infoMinHp;
            minac1 = infoMinAc; maxac1 = infoMaxAc;
            $('#prgEnnHp1').animate_progressbar((minhp1 / maxhp1) * 100);
            $('#prgEnnAc1').animate_progressbar((minac1 / maxac1) * 100);
        }
    }
    if (Command == "SETEN2") {
        var infoName = Arr[1];
        var infoHP = Arr[2];
        if ($('#NameEnn2').length) {
            if (infoName == "NULL") {
                $('#SecEnemy').hide();
                $('#SecEnemySk').hide();
                minhp2 = 0; maxhp2 = 0;
                minac2 = 0; maxac2 = 0;
            }
            else {
                $('#SecEnemy').show();
                $('#SecEnemySk').show();
                $('#NameEnn2').html(infoName);
                minhp2 = infoHP; maxhp2 = infoHP;
                minac2 = 10; maxac2 = 10;
                $('#prgEnnHp2').animate_progressbar((minhp2 / maxhp2) * 100);
                $('#prgEnnAc2').animate_progressbar((minac2 / maxac2) * 100);            
            }
        }
    }
    if (Command == "VALEN2") {
        var infoMinAc = Arr[1];
        var infoMaxAc = Arr[2];
        var infoMinHp = Arr[3];
        if ($('#NameEnn2').length) {
            minhp2 = infoMinHp;
            minac2 = infoMinAc; maxac2 = infoMaxAc;
            $('#prgEnnHp2').animate_progressbar((minhp2 / maxhp2) * 100);
            $('#prgEnnAc2').animate_progressbar((minac2 / maxac2) * 100);
        }
    }
    if (Command == "SETPL1") {
        var infoName = Arr[1];
        var infoHP = Arr[2];
        var infoMP = Arr[3];
        if ($('#prgCharHp1').length) {
            $('#NameChar1').html(infoName);
            minhp = infoHP; maxhp = infoHP;
            minmp = infoMP; maxmp = infoMP;
            minac = 10; maxac = 10;
            $('#prgCharHp1').animate_progressbar((minhp / maxhp) * 100);
            $('#prgCharMp1').animate_progressbar((minmp / maxmp) * 100);
            $('#prgCharAc1').animate_progressbar((minac / maxac) * 100);
        }
    }
    if (Command == "VALPL1") {
        var infoMinHp = Arr[1];
        var infoMinMp = Arr[2];
        if ($('#prgCharHp1').length) {
            minhp = infoMinHp;
            minmp = infoMinMp;
            $('#prgCharHp1').animate_progressbar((minhp / maxhp) * 100);
            $('#prgCharMp1').animate_progressbar((minmp / maxmp) * 100);
        }
    }
    if (Command == "SKCD") {
        sk1 = Arr[1];
        sk2 = Arr[2];
        sk3 = Arr[3];
        sk4 = Arr[4];
        sk5 = Arr[5];
        sk6 = Arr[6];
        sk7 = Arr[7];

        SkillCooldowns();
    }

}
function SkillCooldowns() {
    if ($('#sk1').length) {
        if (sk1 < 0) { $("#sk1").hide(); $("#sk1b").hide(); }
        if (sk2 < 0) { $("#sk2").hide(); $("#sk2b").hide(); }
        if (sk3 < 0) { $("#sk3").hide(); $("#sk3b").hide(); }
        if (sk4 < 0) { $("#sk4").hide(); $("#sk4b").hide(); }
        if (sk5 < 0) { $("#sk5").hide(); }
        if (sk6 < 0) { $("#sk6").hide(); }
        if (sk7 < 0) { $("#sk7").hide(); }

        if ((sk1 != 0) || (mincd != 0)) { $("#sk1").addClass("skInactive"); $("#sk1b").addClass("skInactive"); } else { $("#sk1").removeClass("skInactive"); $("#sk1b").removeClass("skInactive"); }
        if ((sk2 != 0) || (mincd != 0)) { $("#sk2").addClass("skInactive"); $("#sk2b").addClass("skInactive"); } else { $("#sk2").removeClass("skInactive"); $("#sk2b").removeClass("skInactive"); }
        if ((sk3 != 0) || (mincd != 0)) { $("#sk3").addClass("skInactive"); $("#sk3b").addClass("skInactive"); } else { $("#sk3").removeClass("skInactive"); $("#sk3b").removeClass("skInactive"); }
        if ((sk4 != 0) || (mincd != 0)) { $("#sk4").addClass("skInactive"); $("#sk4b").addClass("skInactive"); } else { $("#sk4").removeClass("skInactive"); $("#sk4b").removeClass("skInactive"); }
        if ((sk5 != 0) || (mincd != 0)) { $("#sk5").addClass("skInactive"); } else { $("#sk5").removeClass("skInactive"); }
        if ((sk6 != 0) || (mincd != 0)) { $("#sk6").addClass("skInactive"); } else { $("#sk6").removeClass("skInactive"); }
        if ((sk7 != 0) || (mincd != 0)) { $("#sk7").addClass("skInactive"); } else { $("#sk7").removeClass("skInactive"); }

        if (sk1 > 0) { $("#sk1text").html("Attack (" + sk1 + ")"); $("#sk1btext").html("Attack (" + sk1 + ")"); } else { $("#sk1text").html("Attack"); $("#sk1btext").html("Attack"); }
        if (sk2 > 0) { $("#sk2text").html("Void Lance (" + sk2 + ")"); $("#sk2btext").html("Void Lance (" + sk2 + ")"); } else { $("#sk2text").html("Void Lance"); $("#sk2btext").html("Void Lance"); }
        if (sk3 > 0) { $("#sk3text").html("Sure Shot (" + sk3 + ")"); $("#sk3btext").html("Sure Shot (" + sk3 + ")"); } else { $("#sk3text").html("Sure Shot"); $("#sk3btext").html("Sure Shot"); }
        if (sk4 > 0) { $("#sk4text").html("Freeze (" + sk4 + ")"); $("#sk4btext").html("Freeze (" + sk4 + ")"); } else { $("#sk4text").html("Freeze"); $("#sk4btext").html("Freeze"); }
        if (sk5 > 0) { $("#sk5text").html("Heal (" + sk5 + ")"); } else {       $("#sk5text").html("Heal"); }
        if (sk6 > 0) { $("#sk6text").html("Cleave (" + sk6 + ")"); } else {     $("#sk6text").html("Cleave"); }
        if (sk7 > 0) { $("#sk7text").html("Firestorm (" + sk7 + ")"); } else {  $("#sk7text").html("Firestorm"); }    
    }
}

/*WS HANDLERS*/
function OpenChests() { ws.send("OPENALL|1"); }
function OpenResBag() { ws.send("OPENALL2|1"); }
function TradeskillStart(WorkId){       ws.send("TSSTART|" + WorkId.toString());}
function TradeskillStop(WorkId){        ws.send("TSSTOP|" + WorkId.toString());}
function TradeskillBonus(bonus){        ws.send("TSADDBONUS|" + bonus.toString());}
function GetInfoTradeskill(WorkId){     ws.send("TSGET|" + WorkId.toString());}
function StartEncounter(Pos){           ws.send("ENCOUNTER|" + Pos.toString());}
function SendMessage(Message) {         ws.send("SENDCHAT|" + encodeURIComponent(Message)); document.getElementById('txtMessage').value = ''; }
function sendRequestContentFill(url) {  ws.send("GETCONTENT|" + url.toString()); }
function sendCaptcha(captcha) {         ws.send("SOLVECAPTCHA|" + captcha);}
function getKingMap(xLoc, yLoc) {       ws.send("GETKINGMAP|" + xLoc + "|" + yLoc + "");}
function loadFight(PosTile) {           ws.send("LOADFIGHT|" + PosTile); }
function UseSkill(SkillId, TargetId){   ws.send("USESKILL|" + SkillId.toString() + "|" + TargetId.toString());}

function ChangeChatChannel(Channel)
{
    if (channelChat != Channel)
    {
        channelChat = Channel;
        LastChatCount = 0;
        if (ws.readyState == 1){ ws.send("CHANNEL|" + Channel.toString()); }
        $("#ChatCh1").attr('class', '');
        $("#ChatCh2").attr('class', '');
        $("#ChatCh3").attr('class', '');
        $("#ChatCh4").attr('class', '');
        $('#ChatLog').html('...');
        if (channelChat == 1) { $("#ChatCh1").attr('class', 'TabSel');}
        if (channelChat == 2) { $("#ChatCh2").attr('class', 'TabSel');}
        if (channelChat == 3) { $("#ChatCh3").attr('class', 'TabSel');}
        if (channelChat == 4) { $("#ChatCh4").attr('class', 'TabSel');}
    }
}
function ChangeLogChannel(Channel)
{
    if (channelLog != Channel)
    {
        channelLog = Channel;
        LastLogCount = 0;
        /*ws.send("LOG|" + Channel.toString());*/
        if (channelLog == 1) { $("#LogCh1").attr('class', 'TabSel'); $("#LogCh2").attr('class', ''); $("#LogCh3").attr('class', ''); $('#InfoIT').hide(); $('#InfoTS').hide(); $('#InfoBA').show(); $('#MultiLog').html('...'); $('#MultiLog').height(230); $('#LogName').html('Battle Log');}
        if (channelLog == 2) { $("#LogCh1").attr('class', ''); $("#LogCh2").attr('class', 'TabSel'); $("#LogCh3").attr('class', ''); $('#InfoBA').hide(); $('#InfoIT').hide(); $('#InfoTS').show(); $('#MultiLog').html('...'); $('#MultiLog').height(106); $('#LogName').html('Tradeskill Log');}
        if (channelLog == 3) { $("#LogCh1").attr('class', ''); $("#LogCh2").attr('class', ''); $("#LogCh3").attr('class', 'TabSel'); $('#InfoTS').hide(); $('#InfoBA').hide(); $('#InfoIT').show(); $('#MultiLog').html('...'); $('#MultiLog').height(165); $('#LogName').html('Item Log');}
    }
}



/*--JS CUSTOM FUNCTIONS--*/
function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b","t"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}
function fullNumDisplay(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function replaceHtml(el, html) {
    var oldEl = typeof el === "string" ? document.getElementById(el) : el;
    var newEl = oldEl.cloneNode(false);
    newEl.innerHTML = html;
    oldEl.parentNode.replaceChild(newEl, oldEl);
    return newEl;
}
function handleTimeout(response) { }
function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g, "");
}



function SetGameInfo(   name, lvl, mincd, maxcd, nexp, naexp, npexp, ngold, ncoords, nbuilding, clvl, cexp, cmexp, nexppct, naexppct, npexppct, abp, mage, actname, pasname, 
                        t1ore, t2ore, t3ore, t4ore, t5ore, t1gather, t2gather, t3gather, t4gather, t5gather, 
                        t1wood, t2wood, t3wood, t4wood, t5wood, t1fish, t2fish, t3fish, t4fish, t5fish, 
                        t1count, t2count, t3count, t4count, t5count, t1odds, t2odds, t3odds, t4odds, t5odds, 
                        skname, sklevel, skexp, skexppct, workstatus, workload, chests, relics, explvl, reslvl, worklvl, chestlvl, tierlvl, 
                        exprel, resrel, workrel, chestrel, tierrel, 
                        bexp, btexp, bchest, bgold, ostate, lchat1, lchat2, lchat3, llog1, llog2, llog3, 
                        engaged, minhp, maxhp, minmp, maxmp, name1, minhp1, maxhp1, name2, minhp2, maxhp2,
                        minac1, maxac1, minac2, maxac2, sk1, sk2, sk3, sk4, sk5, sk6, sk7,
                        evname, evtimer, evtop1, evtop2, evtop3, evtop1p, evtop2p, evtop3p, evtopxp, evtop1r, evtop2r, evtop3r, evtop4r) {

    //Set Coordinate Info
    $("#SideCoords").html(ncoords);
    $("#SideLand").html(nbuilding);
    $("#SideActLvl").html(clvl);
    $("#SideActExp").html(Math.round(cexp/cmexp*100) + " %");
    $("#SideCoords").html(ncoords);
    $("#SideTimer").html(evtimer);
    $("#SideEvent").html(evname);

    //Events
    if (evname == "")
    {
        $('#btnEvent').hide();
    }
    else
    {
        $('#btnEvent').show();
    }
    if ($('#EventName').length)
    {
        
        $("#EventName").html(evname);
        $("#EventTimer").html(evtimer);
        $("#EventTName1").html(evtop1);
        $("#EventTCount1").html(evtop1p);
        $("#EventTName2").html(evtop2);
        $("#EventTCount2").html(evtop2p);
        $("#EventTName3").html(evtop3);
        $("#EventTCount3").html(evtop3p);
        $("#EventPoints").html(evtopxp);
        $("#EventTReward1").html(evtop1r);
        $("#EventTReward2").html(evtop2r);
        $("#EventTReward3").html(evtop3r);
        $("#EventTReward4").html(evtop4r);
    }

    //Set Generic Info
    $("#SideName").html(name); $("#SideLvl").html('Level ' + lvl);
    $("#SideSP").html(abp + ' points left');
    $('#prgCharExp1').animate_progressbar(nexppct);  $("#prgTextExp1").html(nexp);
    $('#prgCharExp2').animate_progressbar(naexppct);  $("#prgTextExp2").html(naexp); $("#prgNameExp2").html(actname);
    $('#prgCharExp3').animate_progressbar(npexppct);  $("#prgTextExp3").html(npexp); $("#prgNameExp3").html(pasname);
    if (skname == '') { $('#prgCharExp4').hide(); } 
    else { $('#prgCharExp4').show(); }
    $('#prgCharExp4').animate_progressbar(skexppct);  $("#prgTextExp4").html(sklevel + '(' + skexp + ')'); $("#prgNameExp4").html(skname);
    $("#SideGold").html(ngold);
    $("#SideME").html(mage);
    $("#SideChest").html(chests);
    $("#SideRelic").html(relics);

    //Cooldown info
    $('#prgActionTimer').animate_progressbar(maxcd);
    if (skname != ''){ $("#prgActionOverlay").html(skname + " " + workload); } else { $("#prgActionOverlay").html(""); }

    
    if (chests != 0) { $("#btnOpen").show(); } else { $("#btnOpen").hide(); }

    if ($('#WorkLvl').length){
        $("#WorkLvl").html(sklevel);
        $("#WorkExp").html(skexp);
        $("#WorkStatus").html(workstatus);
        $("#Workload").html(workload);
        $("#Relics").html(relics);
        $("#Chests").html(chests);
        $("#BonusExp").html(explvl); $("#ExpRel").html(exprel + " relics"); $("#ExpRel2").html(((exprel * 10) + 45) + " relics");
        $("#BonusRes").html(reslvl); $("#ResRel").html(resrel + " relics"); $("#ResRel2").html(((resrel * 10) + 45) + " relics");
        $("#BonusWork").html(worklvl); $("#WorkRel").html(workrel + " relics"); $("#WorkRel2").html(((workrel * 10) + 45) + " relics");
        $("#BonusChest").html(chestlvl); $("#ChestRel").html(chestrel + " relics"); $("#ChestRel2").html(((chestrel * 10) + 45) + " relics");
        $("#BonusTier").html(tierlvl); $("#TierRel").html(tierrel + " relics"); $("#TierRel2").html(((tierrel * 10) + 45) + " relics");

        $("#Tier1Count").html(t1count); 
        $("#Tier2Count").html(t2count); 
        $("#Tier3Count").html(t3count); 
        $("#Tier4Count").html(t4count); 
        $("#Tier5Count").html(t5count); 
        $("#Tier1Odds").html(t1odds); 
        $("#Tier2Odds").html(t2odds); 
        $("#Tier3Odds").html(t3odds); 
        $("#Tier4Odds").html(t4odds); 
        $("#Tier5Odds").html(t5odds); 

    }
    //Bonus display
    if ($('#PrvBonusExp').length){
        $("#PrvBonusExp").html(bexp);
        $("#PrvBonusTExp").html(btexp);
        $("#PrvBonusChest").html(bchest);
        $("#PrvBonusGold").html(bgold);
    }

    //Resources
    $("#T1Ore").html(t1ore); $("#T1Gather").html(t1gather); $("#T1Wood").html(t1wood); $("#T1Fish").html(t1fish);
    $("#T2Ore").html(t2ore); $("#T2Gather").html(t2gather); $("#T2Wood").html(t2wood); $("#T2Fish").html(t2fish);
    $("#T3Ore").html(t3ore); $("#T3Gather").html(t3gather); $("#T3Wood").html(t3wood); $("#T3Fish").html(t3fish); 
    $("#T4Ore").html(t4ore); $("#T4Gather").html(t4gather); $("#T4Wood").html(t4wood); $("#T4Fish").html(t4fish);
    $("#T5Ore").html(t5ore); $("#T5Gather").html(t5gather); $("#T5Wood").html(t5wood); $("#T5Fish").html(t5fish);

    //Chat Update
    if ((channelChat == 1) && (parseInt(LastChatCount) < parseInt(lchat1))){ LastChatCount = parseInt(lchat1); sendRequestChatFill();}
    if ((channelChat == 2) && (parseInt(LastChatCount) < parseInt(lchat2))){ LastChatCount = parseInt(lchat2); sendRequestChatFill();}
    if ((channelChat == 3) && (parseInt(LastChatCount) < parseInt(lchat3))){ LastChatCount = parseInt(lchat3); sendRequestChatFill();}

    //Log Update
    if ((channelLog == 1) && (parseInt(LastLogCount) < parseInt(llog1))){ LastLogCount = parseInt(llog1); sendRequestLogFill();}
    if ((channelLog == 2) && (parseInt(LastLogCount) < parseInt(llog2))){ LastLogCount = parseInt(llog2); sendRequestLogFill();}
    if ((channelLog == 3) && (parseInt(LastLogCount) < parseInt(llog3))){ LastLogCount = parseInt(llog3); sendRequestLogFill();}

    if ($('#prgCharHp1').length){
        $('#NameChar1').html(name);
        $('#prgCharHp1').animate_progressbar(maxhp);
        $('#prgCharMp1').animate_progressbar(maxmp);
        $('#prgCharAc1').animate_progressbar(maxcd);
        if (name1 != ""){
            $('#Rewards').hide();
            $('#FightContain').show(); 
            $('#NameEnn1').html(name1);
            $('#prgEnnHp1').animate_progressbar(maxhp1);
            $('#prgEnnAc1').animate_progressbar(maxac1);
            if (name2 != ""){
                $('#SecEnemy').show();
                $('#SecEnemySk').show();
                $('#NameEnn2').html(name2);
                $('#prgEnnHp2').animate_progressbar(maxhp2);
                $('#prgEnnAc2').animate_progressbar(maxac2);
            }
            else{
                $('#SecEnemy').hide();
                $('#SecEnemySk').hide();
            }
        }
        else{
            $('#FightContain').hide();
            $('#Rewards').show(); 
            sendRequestRewardFill('getRewards.aspx?null=');
        }


        if ((sk1 != 0) || (mincd != 0)) { $("#btnAttack1").button("disable"); $("#btnAttack2").button("disable"); } else { $("#btnAttack1").button("enable"); $("#btnAttack2").button("enable"); }
        if ((sk2 != 0) || (mincd != 0)) { $("#btnVoidLance1").button("disable"); $("#btnVoidLance2").button("disable"); } else { $("#btnVoidLance1").button("enable"); $("#btnVoidLance2").button("enable"); }
        if ((sk3 != 0) || (mincd != 0)) { $("#btnSureShot1").button("disable"); $("#btnSureShot2").button("disable"); } else { $("#btnSureShot1").button("enable"); $("#btnSureShot2").button("enable"); }
        if ((sk4 != 0) || (mincd != 0)) { $("#btnFreeze1").button("disable"); $("#btnFreeze2").button("disable"); } else { $("#btnFreeze1").button("enable"); $("#btnFreeze2").button("enable"); }
        if ((sk5 != 0) || (mincd != 0)) { $("#btnHeal").button("disable"); } else { $("#btnHeal").button("enable"); }
        if ((sk6 != 0) || (mincd != 0)) { $("#btnCleave").button("disable"); } else { $("#btnCleave").button("enable"); }
        if ((sk7 != 0) || (mincd != 0)) { $("#btnFireStorm").button("disable"); } else { $("#btnFireStorm").button("enable"); }

        if (sk1 > 0) { $("#btnAttack1 span").text("Attack (" + sk1 + ")"); $("#btnAttack2 span").text("Attack (" + sk1 + ")");} else { $("#btnAttack1 span").text("Attack"); $("#btnAttack2 span").text("Attack");}
        if (sk2 > 0) { $("#btnVoidLance1 span").text("Void Lance (" + sk2 + ")"); $("#btnVoidLance2 span").text("Void Lance (" + sk2 + ")");} else { $("#btnVoidLance1 span").text("Void Lance"); $("#btnVoidLance2 span").text("Void Lance");}
        if (sk3 > 0) { $("#btnSureShot1 span").text("Sure Shot (" + sk3 + ")"); $("#btnSureShot2 span").text("Sure Shot (" + sk3 + ")");} else { $("#btnSureShot1 span").text("Sure Shot"); $("#btnSureShot2 span").text("Sure Shot");}
        if (sk4 > 0) { $("#btnFreeze1 span").text("Freeze (" + sk4 + ")"); $("#btnFreeze2 span").text("Freeze (" + sk4 + ")");} else { $("#btnFreeze1 span").text("Freeze"); $("#btnFreeze2 span").text("Freeze");}
        if (sk5 > 0) { $("#btnHeal span").text("Heal (" + sk5 + ")"); } else { $("#btnHeal span").text("Heal"); }
        if (sk6 > 0) { $("#btnCleave span").text("Cleave (" + sk6 + ")"); } else { $("#btnCleave span").text("Cleave"); }
        if (sk7 > 0) { $("#btnFireStorm span").text("Firestorm (" + sk7 + ")"); } else { $("#btnFireStorm span").text("Firestorm"); }
    }

    if ((fightengaged == 0) && (engaged == "1"))
    {
        sendRequestContentFill('getBattleScreen.aspx?null=');
        fightengaged = 1;
    }
}

function UpdateInterface(Ex1, Ex2, Ex3, Ex4, Name1, Name2, Name3, Name4, Lvl1, Lvl2, Lvl3, Lvl4, HpP1, HpP2, HpP3, HpP4, Hp1, Hp2, Hp3, Hp4, MpP1,
                                 MpP2, MpP3, MpP4, Mp1, Mp2, Mp3, Mp4, ActP1, ActP2, ActP3, ActP4, Act1, Act2, Act3, Act4, ta1, ta2, ta3, 
                                 fs1, fs2, fs3, fs4, fs5, fs6, fs7, fs8, fs9, fs10, nfs1, nfs2, nfs3, nfs4, nfs5, nfs6, nfs7, nfs8, nfs9, nfs10, 
                                 as1, as2, as3, as4, as5, as6, as7, as8, as9, as10, nas1, nas2, nas3, nas4, nas5, nas6, nas7, nas8, nas9, nas10, 
                                 nexp, naexp, npexp, ngold, ncoords, nbuilding, clvl, cexp, cmexp, abp, mage, actname, pasname,
                                 t1ore, t2ore, t3ore, t4ore, t5ore, t1gather, t2gather, t3gather, t4gather, t5gather,
                                 t1wood, t2wood, t3wood, t4wood, t5wood, t1fish, t2fish, t3fish, t4fish, t5fish,
                                 sklevel, skexp, workstatus, workload, chests, relics, explvl, reslvl, worklvl, chestlvl, tierlvl, bexp, btexp, bchest, bgold, ostate) {

    if (ostate != onstate)
    {
        onstate = ostate;
        clearInterval(InfoRefresh);
        clearInterval(ChatRefresh);
        if (onstate == 1){
            InfoRefresh = setInterval(function () { sendRequestCharInfo('getCharactersShort.aspx?null='); }, 500);
            ChatRefresh = setInterval(function () { sendRequestChatFill(); }, 1500);
        }
        else if (onstate == 2) {
            InfoRefresh = setInterval(function () { sendRequestCharInfo('getCharactersShort.aspx?null='); }, 2000);
            ChatRefresh = setInterval(function () { sendRequestChatFill(); }, 1500);
        }
        else if (onstate == 3) {
            InfoRefresh = setInterval(function () { sendRequestCharInfo('getCharactersShort.aspx?null='); }, 2000);
            ChatRefresh = setInterval(function () { sendRequestChatFill(); }, 2000);
        }
        else if (onstate == 4) {
            InfoRefresh = setInterval(function () { sendRequestCharInfo('getCharactersShort.aspx?null='); }, 5000);
            ChatRefresh = setInterval(function () { sendRequestChatFill(); }, 6000);
        }
    }

    CharExists1 = Ex1; CharExists2 = Ex2; EnnemyExists1 = Ex3; EnnemyExists2 = Ex4;
    var NewFight = false;
    var Ennemy1Died = false;
    if (Ex1 == 1 && Ex2 == 0 && Ex3 == 0 && Ex4 == 0) {
        $("#BoxVersus").hide("slow");
        $("#BoxParty2").hide("slow");
        $("#BoxEnnemy1").hide("slow");
        $("#BoxEnnemy2").hide("slow");
        $("#KingdomInfo").show("slow");

        if (targetedId > 0){targetSelf();}
    }
    else if (Ex1 == 1 && Ex2 == 0 && Ex3 == 1 && Ex4 == 0) {
        if ($("#BoxEnnemy1").is(":visible") == false) {NewFight = true;}
        $("#BoxVersus").css({ position: "absolute", top: "60px", left: "280px" }).show("show");
        $("#BoxParty2").hide("slow"); 
        $("#BoxEnnemy1").css({ position: "absolute", top: "5px", left: "320px" }).show("slow");
        $("#BoxEnnemy2").hide("slow");
        $("#KingdomInfo").hide("slow");
    }
    else if (Ex1 == 1 && Ex2 == 0 && Ex3 == 1 && Ex4 == 1) {
        if ($("#BoxEnnemy1").is(":visible") == false) {NewFight = true;}
        $("#BoxVersus").css({ position: "absolute", top: "60px", left: "280px" }).show("show");
        $("#BoxParty2").hide("slow");
        $("#BoxEnnemy1").css({ position: "absolute", top: "5px", left: "320px" }).show("slow");
        $("#BoxEnnemy2").css({ position: "absolute", top: "5px", left: "579px" }).show("slow");
        $("#KingdomInfo").hide("slow");
    }
    else if (Ex1 == 1 && Ex2 == 1 && Ex3 == 0 && Ex4 == 0) {
        $("#BoxVersus").hide("slow");
        $("#BoxParty2").show("slow");
        $("#BoxEnnemy1").hide("slow");
        $("#BoxEnnemy2").hide("slow");
        $("#KingdomInfo").show("slow");
        if (targetedId > 1){targetSelf();}
    }
    else if (Ex1 == 1 && Ex2 == 1 && Ex3 == 1 && Ex4 == 0) {
        if ($("#BoxEnnemy1").is(":visible") == false) {NewFight = true;}
        $("#BoxVersus").css({ position: "absolute", top: "60px", left: "539px" }).show("slow");
        $("#BoxParty2").show("slow");
        $("#BoxEnnemy1").css({ position: "absolute", top: "5px", left: "584px" }).show("slow");
        $("#BoxEnnemy2").hide("slow");
        $("#KingdomInfo").hide("slow");
    }
    else if (Ex1 == 1 && Ex2 == 1 && Ex3 == 1 && Ex4 == 1) {
        if ($("#BoxEnnemy1").is(":visible") == false) {NewFight = true;}
        $("#BoxVersus").css({ position: "absolute", top: "60px", left: "539px" }).show("slow");
        $("#BoxParty2").show("slow");
        $("#BoxEnnemy1").css({ position: "absolute", top: "5px", left: "518px" }).show("slow");
        $("#BoxEnnemy2").css({ position: "absolute", top: "5px", left: "772px" }).show("slow");
        $("#KingdomInfo").hide("slow");
    }
    if (Ex1 == 1) {
        $("#valCharName1").html(Name1);
        $("#valCharLevel1").html("Lvl " + Lvl1);
        $('#prgCharHp1').animate_progressbar(HpP1);
        $('#prgCharMp1').animate_progressbar(MpP1);
        $('#prgCharAc1').animate_progressbar(ActP1);
        $("#valCharHp1").html(Hp1);
        $("#valCharMp1").html(Mp1);
        $("#valCharAc1").html(Act1);
    }
    if (Ex2 == 1) {
        $("#valCharName2").html(Name2);
        $("#valCharLevel2").html("Lvl " + Lvl2);
        $('#prgCharHp2').animate_progressbar(HpP2);
        $('#prgCharMp2').animate_progressbar(MpP2);
        $('#prgCharAc2').animate_progressbar(ActP2);
        $("#valCharHp2").html(Hp2);
        $("#valCharMp2").html(Mp2);
        $("#valCharAc2").html(Act2);
    }
    if (Ex3 == 1) {
        if ( $("#valEnemHp1").html() != "0" && Hp3 == 0) {Ennemy1Died = true;}
        $("#valEnemName1").html(Name3);
        $("#valEnemLevel1").html("Lvl " + Lvl3);
        $('#prgEnemHp1').animate_progressbar(HpP3);
        $('#prgEnemMp1').animate_progressbar(MpP3);
        $('#prgEnemAc1').animate_progressbar(ActP3);
        $("#valEnemHp1").html(Hp3);
        $("#valEnemMp1").html(Mp3);
        $("#valEnemAc1").html(Act3);
    }
    if (Ex4 == 1) {
        $("#valEnemName2").html(Name4);
        $("#valEnemLevel2").html("Lvl " + Lvl4);
        $('#prgEnemHp2').animate_progressbar(HpP4);
        $('#prgEnemMp2').animate_progressbar(MpP4);
        $('#prgEnemAc2').animate_progressbar(ActP4);
        $("#valEnemHp2").html(Hp4);
        $("#valEnemMp2").html(Mp4);
        $("#valEnemAc2").html(Act4);
        if (Ennemy1Died == true) { targetEnemy2(); }
    }

    //Target ennemy if the fight starts
    if (NewFight == true) {targetEnemy1();}

    //Preview info
    $("#PrvLevel").html(nexp);
    $("#PrvActive").html(naexp);
    $("#PrvPassive").html(npexp);
    $("#PrvGold").html(ngold);
    $("#PrvCoordinates").html(ncoords);
    $("#PrvBuilding").html(nbuilding + ' lvl ' + clvl);
    $("#PrvBonusExp").html(bexp);
    $("#PrvBonusTExp").html(btexp);
    $("#PrvBonusChest").html(bchest);
    $("#PrvBonusGold").html(bgold);
    if (nbuilding == 'city')    { $("#PrvBuilding").css('background-color', 'hsl(43, 26%, 46%)');   $("#PrvBuilding").css('color', 'white'); }
    if (nbuilding == 'rock')    { $("#PrvBuilding").css('background-color', 'hsl(172, 4%, 46%)');   $("#PrvBuilding").css('color', 'white'); }
    if (nbuilding == 'swamp')   { $("#PrvBuilding").css('background-color', 'hsl(72, 8%, 31%)');    $("#PrvBuilding").css('color', 'white'); }
    if (nbuilding == 'forest')  { $("#PrvBuilding").css('background-color', 'hsl(108, 26%, 32%)');  $("#PrvBuilding").css('color', 'white'); }
    if (nbuilding == 'plain')   { $("#PrvBuilding").css('background-color', 'hsl(72, 87%, 71%)');   $("#PrvBuilding").css('color', 'black'); }
    if (nbuilding == 'lake')    { $("#PrvBuilding").css('background-color', 'hsl(231, 91%, 62%)');   $("#PrvBuilding").css('color', 'black'); }

    $("#PrvActiveName").html(actname);
    $("#PrvPassiveName").html(pasname);
    $("#PrvAbilityPoints").html(abp);
    $("#PrvMagicElement").html(mage);

    $("#T1Ore").html(t1ore); $("#T1Gather").html(t1gather); $("#T1Wood").html(t1wood); $("#T1Fish").html(t1fish);
    $("#T2Ore").html(t2ore); $("#T2Gather").html(t2gather); $("#T2Wood").html(t2wood); $("#T2Fish").html(t2fish);
    $("#T3Ore").html(t3ore); $("#T3Gather").html(t3gather); $("#T3Wood").html(t3wood); $("#T3Fish").html(t3fish); 
    $("#T4Ore").html(t4ore); $("#T4Gather").html(t4gather); $("#T4Wood").html(t4wood); $("#T4Fish").html(t4fish);
    $("#T5Ore").html(t5ore); $("#T5Gather").html(t5gather); $("#T5Wood").html(t5wood); $("#T5Fish").html(t5fish);

    $("#PrvActivityLevel").html(clvl);
    $("#PrvActivityExp").html('(' + cexp + ' / ' + cmexp + ')');
    if ($('#ActivityText').length){
        $("#ActivityText").html('Activity Level: ' + clvl + ' (' + cexp + '/' + cmexp + ')');
        $("#ActivityProgress").animate_progressbar((parseInt(cexp) / parseInt(cmexp) * 100));
    }

    if ($('#WorkLvl').length){
        $("#WorkLvl").html(sklevel);
        $("#WorkExp").html(skexp);
        $("#WorkStatus").html(workstatus);
        $("#Workload").html(workload);
        $("#Chests").html(chests);
        $("#Relics").html(relics);
        $("#BonusExp").html(explvl);
        $("#BonusRes").html(reslvl);
        $("#BonusWork").html(worklvl);
        $("#BonusChest").html(chestlvl);
        $("#BonusTier").html(tierlvl);
    }


    //Associate Id's
    vta1 = ta1; //Party 1
    vta2 = ta2; //Enemy 1
    vta3 = ta3; //Enemy 2

    //Compare friendly skills available
    var RequiresReload = 0;
    if (fs1 != vfs1) { vfs1 = fs1; RequiresReload = 1; vnfs1 = nfs1;}
    if (fs2 != vfs2) { vfs2 = fs2; RequiresReload = 1; vnfs2 = nfs2;}
    if (fs3 != vfs3) { vfs3 = fs3; RequiresReload = 1; vnfs3 = nfs3;}
    if (fs4 != vfs4) { vfs4 = fs4; RequiresReload = 1; vnfs4 = nfs4;}
    if (fs5 != vfs5) { vfs5 = fs5; RequiresReload = 1; vnfs5 = nfs5;}
    if (fs6 != vfs6) { vfs6 = fs6; RequiresReload = 1; vnfs6 = nfs6;}
    if (fs7 != vfs7) { vfs7 = fs7; RequiresReload = 1; vnfs7 = nfs7;}
    if (fs8 != vfs8) { vfs8 = fs8; RequiresReload = 1; vnfs8 = nfs8;}
    if (fs9 != vfs9) { vfs9 = fs9; RequiresReload = 1; vnfs9 = nfs9;}
    if (fs10 != vfs10) { vfs10 = fs10; RequiresReload = 1; vnfs10 = nfs10;}
    if ((RequiresReload = 1) && (targetedId < 2)){UpdateSkills();}

    //Compare offensive skills available
    RequiresReload = 0;
    if (as1 != vas1) { vas1 = as1; RequiresReload = 1; vnas1 = nas1;}
    if (as2 != vas2) { vas2 = as2; RequiresReload = 1; vnas2 = nas2;}
    if (as3 != vas3) { vas3 = as3; RequiresReload = 1; vnas3 = nas3;}
    if (as4 != vas4) { vas4 = as4; RequiresReload = 1; vnas4 = nas4;}
    if (as5 != vas5) { vas5 = as5; RequiresReload = 1; vnas5 = nas5;}
    if (as6 != vas6) { vas6 = as6; RequiresReload = 1; vnas6 = nas6;}
    if (as7 != vas7) { vas7 = as7; RequiresReload = 1; vnas7 = nas7;}
    if (as8 != vas8) { vas8 = as8; RequiresReload = 1; vnas8 = nas8;}
    if (as9 != vas9) { vas9 = as9; RequiresReload = 1; vnas9 = nas9;}
    if (as10 != vas10) { vas10 = as10; RequiresReload = 1; vnas10 = nas10;}
    if ((RequiresReload = 1) && (targetedId > 1)){UpdateSkills();}
}

(function ($) {
    $.fn.animate_progressbar = function (value, duration, easing, complete) {
        if (value == null) value = 0;
        if (duration == null) duration = 1000;
        if (easing == null) easing = 'linear';
        if (complete == null) complete = function () { };
        var progress = this.find('.ui-progressbar-value');
        progress.stop(true).animate({
            width: value + '%'
        }, duration, easing, function () {
            if (value >= 99.5) {
                progress.addClass('ui-corner-right');
            } else {
                progress.removeClass('ui-corner-right');
            }
            complete();
        });
    }
})(jQuery);


// AJAX THREAD CALLS
//Required Function


//Character information handling
//function sendRequestCharInfo(url) {
//    url = url + "&sid=" + Math.random();
//    var options = { onSuccess: handleRequestCharInfo,
//        timeout: 5000,
//        userID: 1
//    };
//    AjaxTCR.comm.sendRequest(url, options);
//}
//function handleRequestCharInfo(response) {
//    var Arr = response.responseText.split("|")
//    UpdateInterface(Arr[0], Arr[1], Arr[2], Arr[3], Arr[4], Arr[5], Arr[6], Arr[7], Arr[8], Arr[9], Arr[10],
//                    Arr[11], Arr[12], Arr[13], Arr[14], Arr[15], Arr[16], Arr[17], Arr[18], Arr[19], Arr[20],
//                    Arr[21], Arr[22], Arr[23], Arr[24], Arr[25], Arr[26], Arr[27], Arr[28], Arr[29], Arr[30],
//                    Arr[31], Arr[32], Arr[33], Arr[34], Arr[35], Arr[36], Arr[37], Arr[38], Arr[39], Arr[40],
//                    Arr[41], Arr[42], Arr[43], Arr[44], Arr[45], Arr[46], Arr[47], Arr[48], Arr[49], Arr[50],
//                    Arr[51], Arr[52], Arr[53], Arr[54], Arr[55], Arr[56], Arr[57], Arr[58], Arr[59], Arr[60],
//                    Arr[61], Arr[62], Arr[63], Arr[64], Arr[65], Arr[66], Arr[67], Arr[68], Arr[69], Arr[70],
//                    Arr[71], Arr[72], Arr[73], Arr[74], Arr[75], Arr[76], Arr[77], Arr[78], Arr[79], Arr[80],
//                    Arr[81], Arr[82], Arr[83], Arr[84], Arr[85], Arr[86], Arr[87], Arr[88], Arr[89], Arr[90],
//                    Arr[91], Arr[92], Arr[93], Arr[94], Arr[95], Arr[96], Arr[97], Arr[98], Arr[99], Arr[100],
//                    Arr[101], Arr[102], Arr[103], Arr[104], Arr[105], Arr[106], Arr[107], Arr[108], Arr[109], Arr[110],
//                    Arr[111], Arr[112], Arr[113], Arr[114], Arr[115], Arr[116], Arr[117], Arr[118], Arr[119], Arr[120],
//                    Arr[121], Arr[122], Arr[123], Arr[124], Arr[125], Arr[126], Arr[127]);
//}
function sendRequestGameInfo(url) {
    url = url + "&sid=" + Math.random();
    var options = { onSuccess: handleRequestGameInfo,
        timeout: 5000,
        userID: 1
    };
    AjaxTCR.comm.sendRequest(url, options);
}
function handleRequestGameInfo(response) {
    var Arr = response.responseText.split("|")
        SetGameInfo(Arr[0], Arr[1], Arr[2], Arr[3], Arr[4], Arr[5], Arr[6], Arr[7], Arr[8], Arr[9], Arr[10],
                    Arr[11], Arr[12], Arr[13], Arr[14], Arr[15], Arr[16], Arr[17], Arr[18], Arr[19], Arr[20],
                    Arr[21], Arr[22], Arr[23], Arr[24], Arr[25], Arr[26], Arr[27], Arr[28], Arr[29], Arr[30],
                    Arr[31], Arr[32], Arr[33], Arr[34], Arr[35], Arr[36], Arr[37], Arr[38], Arr[39], Arr[40],
                    Arr[41], Arr[42], Arr[43], Arr[44], Arr[45], Arr[46], Arr[47], Arr[48], Arr[49], Arr[50],
                    Arr[51], Arr[52], Arr[53], Arr[54], Arr[55], Arr[56], Arr[57], Arr[58], Arr[59], Arr[60],
                    Arr[61], Arr[62], Arr[63], Arr[64], Arr[65], Arr[66], Arr[67], Arr[68], Arr[69], Arr[70],
                    Arr[71], Arr[72], Arr[73], Arr[74], Arr[75], Arr[76], Arr[77], Arr[78], Arr[79], Arr[80],
                    Arr[81], Arr[82], Arr[83], Arr[84], Arr[85], Arr[86], Arr[87], Arr[88], Arr[89], Arr[90],
                    Arr[91], Arr[92], Arr[93], Arr[94], Arr[95], Arr[96], Arr[97], Arr[98], Arr[99], Arr[100],
                    Arr[101], Arr[102], Arr[103], Arr[104], Arr[105], Arr[106], Arr[107], Arr[108], Arr[109], Arr[110],
                    Arr[111], Arr[112], Arr[113]);
}

//Fill Up Content


//function sendRequestFightLogFill(url) {
//    url = url + "&sid=" + Math.random();
//    var options = { onSuccess: handleRequestFightLogFill,
//        timeout: 6000,
//        userID: 1,
//        statusDiv: document.getElementById('FightLogContent')
//    };
//    AjaxTCR.comm.sendRequest(url, options);
//}
//function handleRequestFightLogFill(response) { 
//    if (response.responseText.length > 10)
//    {
//        $('#FightLogContent').html(response.responseText);
//    }
//}
//function sendRequestRewardFill(url) {
//    url = url + "&sid=" + Math.random();
//    var options = { onSuccess: handleRequestRewardFill,
//        timeout: 6000,
//        userID: 1,
//        statusDiv: document.getElementById('RewardsContent')
//    };
//    AjaxTCR.comm.sendRequest(url, options);
//}
//function handleRequestRewardFill(response) { 
//    if (response.responseText.length > 10)
//    {
//        $('#RewardsContent').html(response.responseText);
//    }
//}



//Chat And Log Fillers
//var ShortFooter = 1;
//function sendRequestChatFill() {
//    url = 'getChatLog.aspx?ch='+ channelChat +'&null='
//    url = url + "&sid=" + Math.random();
//    var options = { onSuccess: handleRequestChatFill,
//        timeout: 6000,
//        userID: 1,
//    };
//    AjaxTCR.comm.sendRequest(url, options);
//}
//function sendRequestLogFill() {
//    url = 'getLog.aspx?ch='+ channelLog +'&null='
//    url = url + "&sid=" + Math.random();
//    var options = { onSuccess: handleRequestLogFill,
//        timeout: 6000,
//        userID: 1,
//    };
//    AjaxTCR.comm.sendRequest(url, options);
//}
//function handleRequestChatFill(response) {
//    $('#ChatLog').html(response.responseText);
//}
//function handleRequestLogFill(response) {
//    $('#MultiLog').html(response.responseText);
//}



//One way traffic
//function sendRequestOneWay(url) {
//    url = url + "&sid=" + Math.random();
//    var options = {timeout: 5000, userID: 1};
//    AjaxTCR.comm.sendRequest(url, options);
//}

//InterfaceSwitch
//function showRessources()
//{
//    $("#CharProgression").hide(); 
//    $("#CharCurrency").hide(); 
//    $("#CharStock").show(); 
//}
//function showProgression()
//{
//    $("#CharStock").hide(); 
//    $("#CharProgression").show(); 
//    $("#CharCurrency").show(); 
//}

//Targetting events
//function targetSelf() {
//    $("#Sh1").show("slow"); 
//    $("#Sh2").hide("slow"); 
//    $("#Sh3").hide("slow"); 
//    $("#Sh4").hide("slow"); 
//    $("#Sh5").hide("slow"); 
//    $("#Sh6").hide("slow");
//    if (targetedId != 0){
//        targetedId = 0;
//        UpdateSkills();
//    }
//}
//function targetAlly() {
//    $("#Sh1").hide("slow"); 
//    $("#Sh2").show("slow"); 
//    $("#Sh3").hide("slow"); 
//    $("#Sh4").hide("slow"); 
//    $("#Sh5").hide("slow"); 
//    $("#Sh6").hide("slow");
//    if (targetedId != 1){
//        targetedId = 1;
//        UpdateSkills();
//    }
//}
//function targetEnemy1() {
//    $("#Sh1").hide("slow"); 
//    $("#Sh2").hide("slow"); 
//    $("#Sh4").hide("slow"); 
//    $("#Sh6").hide("slow");
//    if (CharExists2 == 1){$("#Sh3").hide("slow"); $("#Sh5").show("slow"); }
//    else {$("#Sh3").show("slow"); $("#Sh5").hide("slow"); }

//    if (targetedId != 2){
//        targetedId = 2;
//        UpdateSkills();
//    }
//}
//function targetEnemy2() {
//    $("#Sh1").hide("slow"); 
//    $("#Sh2").hide("slow"); 
//    $("#Sh3").hide("slow"); 
//    $("#Sh5").hide("slow");
//    if (CharExists2 == 1){$("#Sh4").hide("slow"); $("#Sh6").show("slow"); }
//    else {$("#Sh4").show("slow"); $("#Sh6").hide("slow"); }
//    if (targetedId != 3){
//        targetedId = 3;
//        UpdateSkills();
//    }
//}
//function UpdateSkills() {
//    var targetActualId = 0;
//    if (targetedId == 1) {targetActualId = vta1;}
//    if (targetedId == 2) {targetActualId = vta2;}
//    if (targetedId == 3) {targetActualId = vta3;}

//    if ((targetedId == 0) || (targetedId == 1)){
//        //Friendly skills
//        if (vfs1 > 0){ $('#Sk1').unbind('click'); $("#Sk1").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vfs1 + '&ta=' + targetActualId); }); $('#Sk1').children().html(vnfs1); $("#Sk1").show("fast");} else{$("#Sk1").hide("fast");}
//        if (vfs2 > 0){ $('#Sk2').unbind('click'); $("#Sk2").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vfs2 + '&ta=' + targetActualId); }); $('#Sk2').children().html(vnfs2); $("#Sk2").show("fast");} else{$("#Sk2").hide("fast");}
//        if (vfs3 > 0){ $('#Sk3').unbind('click'); $("#Sk3").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vfs3 + '&ta=' + targetActualId); }); $('#Sk3').children().html(vnfs3); $("#Sk3").show("fast");} else{$("#Sk3").hide("fast");}
//        if (vfs4 > 0){ $('#Sk4').unbind('click'); $("#Sk4").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vfs4 + '&ta=' + targetActualId); }); $('#Sk4').children().html(vnfs4); $("#Sk4").show("fast");} else{$("#Sk4").hide("fast");}
//        if (vfs5 > 0){ $('#Sk5').unbind('click'); $("#Sk5").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vfs5 + '&ta=' + targetActualId); }); $('#Sk5').children().html(vnfs5); $("#Sk5").show("fast");} else{$("#Sk5").hide("fast");}
//        if (vfs6 > 0){ $('#Sk6').unbind('click'); $("#Sk6").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vfs6 + '&ta=' + targetActualId); }); $('#Sk6').children().html(vnfs6); $("#Sk6").show("fast");} else{$("#Sk6").hide("fast");}
//        if (vfs7 > 0){ $('#Sk7').unbind('click'); $("#Sk7").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vfs7 + '&ta=' + targetActualId); }); $('#Sk7').children().html(vnfs7); $("#Sk7").show("fast");} else{$("#Sk7").hide("fast");}
//        if (vfs8 > 0){ $('#Sk8').unbind('click'); $("#Sk8").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vfs8 + '&ta=' + targetActualId); }); $('#Sk8').children().html(vnfs8); $("#Sk8").show("fast");} else{$("#Sk8").hide("fast");}
//        if (vfs9 > 0){ $('#Sk9').unbind('click'); $("#Sk9").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vfs9 + '&ta=' + targetActualId); }); $('#Sk9').children().html(vnfs9); $("#Sk9").show("fast");} else{$("#Sk9").hide("fast");}
//        if (vfs10 > 0){ $('#Sk10').unbind('click'); $("#Sk10").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vfs10 + '&ta=' + targetActualId); }); $('#Sk10').children().html(vnfs10); $("#Sk10").show("fast");} else{$("#Sk10").hide("fast");}
//    }
//    else if ((targetedId == 2) || (targetedId == 3)){
//        //Offensive skills
//        if (vas1 > 0){ $('#Sk1').unbind('click'); $("#Sk1").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vas1 + '&ta=' + targetActualId); }); $('#Sk1').children().html(vnas1); $("#Sk1").show("fast");} else{$("#Sk1").hide("fast");}
//        if (vas2 > 0){ $('#Sk2').unbind('click'); $("#Sk2").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vas2 + '&ta=' + targetActualId); }); $('#Sk2').children().html(vnas2); $("#Sk2").show("fast");} else{$("#Sk2").hide("fast");}
//        if (vas3 > 0){ $('#Sk3').unbind('click'); $("#Sk3").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vas3 + '&ta=' + targetActualId); }); $('#Sk3').children().html(vnas3); $("#Sk3").show("fast");} else{$("#Sk3").hide("fast");}
//        if (vas4 > 0){ $('#Sk4').unbind('click'); $("#Sk4").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vas4 + '&ta=' + targetActualId); }); $('#Sk4').children().html(vnas4); $("#Sk4").show("fast");} else{$("#Sk4").hide("fast");}
//        if (vas5 > 0){ $('#Sk5').unbind('click'); $("#Sk5").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vas5 + '&ta=' + targetActualId); }); $('#Sk5').children().html(vnas5); $("#Sk5").show("fast");} else{$("#Sk5").hide("fast");}
//        if (vas6 > 0){ $('#Sk6').unbind('click'); $("#Sk6").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vas6 + '&ta=' + targetActualId); }); $('#Sk6').children().html(vnas6); $("#Sk6").show("fast");} else{$("#Sk6").hide("fast");}
//        if (vas7 > 0){ $('#Sk7').unbind('click'); $("#Sk7").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vas7 + '&ta=' + targetActualId); }); $('#Sk7').children().html(vnas7); $("#Sk7").show("fast");} else{$("#Sk7").hide("fast");}
//        if (vas8 > 0){ $('#Sk8').unbind('click'); $("#Sk8").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vas8 + '&ta=' + targetActualId); }); $('#Sk8').children().html(vnas8); $("#Sk8").show("fast");} else{$("#Sk8").hide("fast");}
//        if (vas9 > 0){ $('#Sk9').unbind('click'); $("#Sk9").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vas9 + '&ta=' + targetActualId); }); $('#Sk9').children().html(vnas9); $("#Sk9").show("fast");} else{$("#Sk9").hide("fast");}
//        if (vas10 > 0){ $('#Sk10').unbind('click'); $("#Sk10").click(function () { sendRequestOneWay('useSkill.aspx?id=' + vas10 + '&ta=' + targetActualId); }); $('#Sk10').children().html(vnas10); $("#Sk10").show("fast");} else{$("#Sk10").hide("fast");}
//    }
//}

//Keypress events
function Shortcuts(e) {
    var keycode = (e.which) ? e.which : e.keyCode
    var doPrevent = false;
    if (keycode === 8) { //Prevent Back to unload the page
        var d = e.srcElement || e.target;
        if ((d.tagName.toUpperCase() === 'INPUT' && 
             (
                 d.type.toUpperCase() === 'TEXT' ||
                 d.type.toUpperCase() === 'PASSWORD' || 
                 d.type.toUpperCase() === 'FILE' || 
                 d.type.toUpperCase() === 'SEARCH' || 
                 d.type.toUpperCase() === 'EMAIL' || 
                 d.type.toUpperCase() === 'NUMBER' || 
                 d.type.toUpperCase() === 'DATE' )
             ) || 
             d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }
    else if (keycode == 13) {
        $('#ChatSend').trigger('click');
        doPrevent = true;
    }

    if (doPrevent) {
        e.preventDefault();
    }
}