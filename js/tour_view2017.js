var tourViewPerNum = {"lld":{"1":{"1":[1]}},"default":{"1":[1,0],"2":[2,1],"3":[3,2],"4":[4,3]},"adultChild":{"2":[{"1":[1],"2":[0]},{"1":[1],"2":[1]}],"3":{"1":[2],"2":[1],"3":[0]},"4":{"1":[3],"2":[2],"3":[1],"4":[0]}},"childAdult":{"2":[[[2],[1]],[[2],[2]]],"3":[[3],[2],[1]],"4":[[4],[3],[2],[1]]}};
// 行程天数
var tourlen = '14';
// 加载图片
var loading = '<img src="/images/preload_16x16.gif" />';
// 房间Index, 仅仅是为了不重复, 并没有实际意义
var roomIndex = 0;

// 房间数量
var roomNumber = 0;

// 每个房间最多入住人数, 默认为4个人。
var maxPerRoom = 4;

// 成人旅客数量
var adultNumber = 0;

// 儿童旅客数量
var childNumber = 0;

//总人数
var totalNumber = 0;

// 加订酒店Type(a: 行后, b: 行前)
var hotelAddonType;

// 点击取消按钮
var clickedCancelButton = false;

// 正在改变房间数量
var isChangeRoomNumber = false;

// 地区
var area = '';
var addFirstRoom = true;

//旅行团编号
var tourcode = $("#J_tourcode").val();
$(function () {
	if (addFirstRoom) {
        var pricearr = ($('#J_price_arr').val()).split("|");
        tourView.getPersonMaxByPriceZone(pricearr);
		tourView.addRoom();
	}	
})


var tourView = {
    eqRow: null,                  //判断是否是相同的行数
    selectElm: null,              //被选中的
    oldElm: null,
    tourCode: 0,                  //旅行团Code
	// 选择房间数量
	
	changeRoomNumber: function(number) {
		isChangeRoomNumber = true;

		$('.sel_listPt').hide();
		if (number > roomNumber) {
			for (i = roomNumber + 1; i <= number; i++) {
				this.addRoom();
			}
		} else {
			for (i = roomNumber; i > number; i--) {
				this.removeLastRoom();
			}
		}
		roomNumber = number;
		this.showRoomNumber();

		isChangeRoomNumber = false;

	},
	//根据现价的pricezone来获取成人和儿童的最大数 by serenaliu 2017-05-12
    getPersonMaxByPriceZone: function (pricearr) {
        var maxPerRoomNew = {'adults':1, 'lld':0, 'child':0} ;
        //四人房有价格
        if (pricearr['5'] > 0) {
            maxPerRoomNew['adults'] = 4;
        //三人房有价格
        } else if (pricearr['4'] > 0) {
            maxPerRoomNew['adults'] = 3;
        //二人房有价格
        } else if (pricearr['3'] > 0) {
            maxPerRoomNew['adults'] = 2;
        //一人房有价格
        } else if (pricearr['2'] > 0) {
            maxPerRoomNew['adults'] = 1;
        }
        //路路配房有价格
        if (pricearr['7'] > 0) {
            maxPerRoomNew['lld'] = 1;
        }
        //儿童房有价格
        if (pricearr['6'] > 0) {
            maxPerRoomNew['child'] = 1;
        }
        this.maxPerRoomNew = maxPerRoomNew;
    },
	//初始化房间最大人数
    initMaxPerRoom: function(roomIndex){
        var adultChild = tourViewPerNum['default'][this.maxPerRoomNew.adults];
        //设置成人最大数
        $('#count_rooms select#i_adult_nums_' + roomIndex + ' option:gt(' + (adultChild[0] - 1) + ')').remove();
        //设置儿童最大数
        var rule_name   = $("#J_rule_name").val();
        if(rule_name == 'rule3'){
            //悬崖团，不能有儿童
            $('#count_rooms select#i_child_nums_' + roomIndex + ' option:gt(0)').remove();
        }else{
            $('#count_rooms select#i_child_nums_' + roomIndex + ' option:gt(' + adultChild[1] + ')').remove();
        }
        if(adultChild[0] == 1){
            //只有单人房价格时, 默认1成人
            $('#count_rooms #d_adult_nums_' + roomIndex).html('1成人');
            //路路配房复选 显示
            $('#count_rooms #d_lldouble_' + roomIndex).show();
        }else{
            //默认成人数为2，获取儿童最大数
            this.adultChildSelected(2, roomIndex);
        }
    },

	// 显示房间数量
	showRoomNumber: function() {
		$('.label').html(roomNumber + '间房');
	},

	// 添加房间
	addRoom: function () {
        tourcode = $('#J_tourcode').val();
		roomIndex++;
		roomNumber++;
		var html = template('addRoomTemplate', {roomIndex: roomIndex, roomNumber: roomNumber});
		if (roomIndex > 1) {
			html += '<a href="javascript:tourView.removeRoom(\'' + roomIndex + '\');" class="check_more7 fs2">[移除]</a></div></div>';
		} else {
			html += '</div>';
		}
		$('#count_rooms').append(html);

		if (isChangeRoomNumber == false) {
			this.showRoomNumber();
		}
        this.initMaxPerRoom(roomIndex);
	},

	// 移除房间
	removeRoom: function (index) {
		roomNumber--;
		$("#room_no_" + index).remove();
		var len = $(".room_nums_d").length;
		for(i = 1; i < len; i++){
			$(".room-list:eq("+i+") b").html(i+1);
		}

		this.showRoomNumber();
	},

	// 移除最后一间房
	removeLastRoom: function () {
		$('.room-list').last().remove();
	},

	// 安排房间人数
	checkRoomPassenger: function (idx, isadult) {
        //移出房型选择
        $(".J_click").removeClass("bgi_color J_click");
		$roomtype = $("#i_room_type_" + idx);
		$bedtype = $("#i_bed_type_" + idx)
		$adultNumber = $("#i_adult_nums_" + idx);
		$childNumber = $("#i_child_nums_" + idx);
		var roomtype = $roomtype.val();
		var bedtype = $bedtype.val();
		var adultNumber = parseInt($adultNumber.val());
		var childNumber = parseInt($childNumber.val());

        // var tourcode    = $("#J_tourcode").val();
        // var rule_name   = $("#J_rule_name").val();
        if(tourlen > 1){
            if(isadult == 1){
                //选择成人数，获取儿童最大数
                //最多只有双人房时，需要考虑是否有儿童价
                this.adultChildSelected(adultNumber, idx);
            }else{
                //选择儿童数，获取成人最大数
                //最多只有双人房时，需要考虑是否有儿童价
                if(this.maxPerRoomNew.adults == 2){
                    var adultMax = tourViewPerNum['childAdult'][this.maxPerRoomNew.adults][this.maxPerRoomNew.child][childNumber];
                }else if(this.maxPerRoomNew.adults > 2)
                {
                    var adultMax = tourViewPerNum['childAdult'][this.maxPerRoomNew.adults][childNumber];
                }
                adultMax = parseInt(adultMax);
                $('#i_adult_nums_' + idx + ' option:gt(' + (adultMax - 1) + ')').hide();
                $('#i_adult_nums_' + idx + ' option:lt(' + adultMax + ')').show();
            }
        }
        $("#d_room_type_"+idx).html(roomtype);
		$("#d_bed_type_"+idx).html(bedtype);
		$("#d_adult_nums_"+idx).html(adultNumber+" 成人");
		$("#d_child_nums_"+idx).html(childNumber+" 儿童");
	},
	//成人，儿童联动选择, 选择成人数时，儿童最大数
    adultChildSelected: function (adultNumber, idx) {
        //当有双人房，三人房，四人房, 成人默认是2成人，计算儿童最大数
        //最多只有双人房时，需要考虑是否有儿童价
        if(this.maxPerRoomNew.adults == 2){
            var childMax = tourViewPerNum['adultChild'][this.maxPerRoomNew.adults][this.maxPerRoomNew.child][adultNumber];
        }else if(this.maxPerRoomNew.adults > 2)
        {
            var childMax = tourViewPerNum['adultChild'][this.maxPerRoomNew.adults][adultNumber];
        }
        childMax = parseInt(childMax);
        $('#i_child_nums_' + idx + ' option:gt(' + childMax + ')').hide();
        $('#i_child_nums_' + idx + ' option:lt(' + (childMax + 1) + ')').show();
    }
};


function showPtList(num){
	var $selList = $("#sel_list"+num);
	if($selList.css("display")=="none"){
		$selList.slideDown("fast");
	} else{
		$selList.slideUp("fast");
	}
};
