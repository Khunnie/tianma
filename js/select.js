// 正在改变房间数量
var isChangeRoomNumber = false;
function checkRoomPassenger(idx) {
	var $roomtype = $("#i_room_type_" + idx);
	var $bedtype = $("#i_bed_type_" + idx);
	var $adultNumber = $("#i_adult_nums_" + idx);
	var $childNumber = $("#i_child_nums_" + idx);
	
	var roomtype = $roomtype.val();
	var bedtype = $bedtype.val();
	var adultNumber = parseInt($adultNumber.val());
	var childNumber = parseInt($childNumber.val());
	
	$("#d_room_type_"+idx).html(roomtype);
	$("#d_bed_type_"+idx).html(bedtype);
	$("#d_adult_nums_"+idx).html(adultNumber+" 成人");
	$("#d_child_nums_"+idx).html(childNumber+" 儿童");
}
var number=1;
var addnumber=0;
var html="";
function addRoom(){
	html="";
	html+="<div class='room_nums_d room-list clearfix' id='room_no_"+number+"'>";
    html+="            	<div class='roomname fl'>房间<b>"+number+"</b></div>";
    html+="            	<div class='select_box'>";
    html+="                 <div class='selected_nums room_sel_type' id='d_room_type_"+number+"'>双人标准间</div><i></i>";
    html+="                 <select name='room["+number+"][roomtype]' class='room_type' id='i_room_type_"+number+"' onchange='checkRoomPassenger("+number+");'>";
    html+="                     <option value='双人标准间'>双人标准间</option>";
    html+="                     <option value='豪华间'>豪华间</option>";
    html+="                 </select>";
    html+="             </div>";
    html+="             <div class='select_box'>";
    html+="                 <div class='selected_nums bed_sel_type' id='d_bed_type_"+number+"'>queen</div><i></i>";
    html+="                 <select name='room["+number+"][bedtype]' class='bed_type' id='i_bed_type_"+number+"' onchange='checkRoomPassenger("+number+");'>";
    html+="                     <option value='queen'>queen</option>";
    html+="                     <option value='2 double beds'>2 double beds</option>";
    html+="                     <option value='king'>king</option>";
    html+="                 </select>";
    html+="             </div>";
    html+="             <div class='select_box'>";
    html+="                 <div class='selected_nums adult_sel_nums' id='d_adult_nums_"+number+"'>1 成人</div><i></i>";
    html+="                 <select name='room["+number+"][adult]' class='adult_nums' id='i_adult_nums_"+number+"' onchange='checkRoomPassenger("+number+");'>";
    html+="                     <option value='1'>1</option>";
    html+="                     <option value='2'>2</option>";
    html+="                     <option value='3'>3</option>";
    html+="                     <option value='4'>4</option>";
    html+="                 </select>";
    html+="             </div>";
    html+="             <div class='select_box'>";
    html+="                 <div class='selected_nums child_sel_nums' id='d_child_nums_"+number+"'>0 儿童</div><i></i>";
    html+="                 <select name='room["+number+"][child]' class='child_nums' id='i_child_nums_"+number+"' onchange='checkRoomPassenger("+number+");'>";
    html+="                     <option value='0'>0</option>";
    html+="                     <option value='1'>1</option>";
    html+="                 </select>";
    html+="             </div>";
	if (number > 1) {
		html+="             <a onclick='removeRoom("+number+");' class='room_remove'>[移除]</a>";
	}
    html+="</div>";
	$(".room-lists .other-room-list").append(html);
}
// 清空房间
function removeLastRoom() {
	$(".room-lists .other-room-list").empty();
}
// 移除房间
function removeRoom(index) {
	$("#room_no_" + index).remove();
}
function showPtList(){
	number=$("#i_room_nums").val();
	$("#d_room_nums").html(number+" 间房");
	removeLastRoom();
	for (i = 2; i <= number; i++) {
		addRoom(i);
	}
}
$(".add-room-txt").click(function(){
	number++;
	addnumber=number;
	if(addnumber>$(".room_nums option").length+1)
	{}
	else
	{
	addRoom(addnumber);
	}
})