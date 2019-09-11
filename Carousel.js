(function($){

    var Carousel = (function(){
         //定义函数的形式封装一个插件
    var Carousel= function(element,options){
        this.setting = $.extend(true,$.fn.Carousel.defaults, options||{});
        //保存单个对象
        this.element = element;
        //初始化Carousel
        this.init();
    };

        Carousel.prototype={
            /*说明：初始化插件*/
			/*实现：初始化dom结构，布局，分页及绑定事件*/
            init:function(){
                //保存自己，方便在匿名函数或者闭包函数里使用
                var _this = this;
                _this.selectors = _this.setting.selectors;
                _this.poster = _this.element.find(_this.selectors.posterMain);
                _this.posterItemMain = _this.poster.find("ul"+_this.selectors.posterList);
                _this.nextBtn = _this.poster.find("div"+_this.selectors.posterNextBtn);
                _this.prevBtn = _this.poster.find("div"+_this.selectors.posterPrevBtn);
                 //保存幻灯片的所有li
                 _this.posterItems = _this.posterItemMain.find("li"+_this.selectors.posterItem);
                 //使用这个Carousel插件 里面放的li一般为奇数 
                 //如果使用偶数，需要复制一个li插入li中，使其为奇数
                 if(_this.posterItems%2 == 0){
                    _this.posterItemMain.append(_this.posterFirstItem.clone());
                    _this.posterItems = _this.posterItemMain.children();
                }
        
                //保存第一帧 和最后一帧
                _this.posterFirstItem = _this.posterItems.first();
                _this.posterLastItem = _this.posterItems.last();

                // console.log("nextBtn",_this.posterItems)


                _this.setSettingValue();
                _this.setPosterPos();

                //解决多次连续点击的bug
                _this.rotateFlag = true;
                _this.nextBtn.click(function(){
                    if(_this.rotateFlag){
                        _this.rotateFlag=!_this.rotateFlag;
                        _this.carouseRotate("left");
                    }
                    
                });
                _this.prevBtn.click(function(){
                    if(_this.rotateFlag){
                        _this.rotateFlag=!_this.rotateFlag;
                    _this.carouseRotate("right");
                }
                });

                //是否开启自动播放
                if(_this.setting.autoPlay){
                    _this.autoPlay();
                    //当鼠标移到this.poster上停止播放
                    _this.poster.hover(function(){
                        window.clearInterval( _this.timer);
                    },function(){
                        _this.autoPlay();
                    });
                }
            }, //自动播放的函数
            autoPlay:function () { 
                var _this = this;
                _this.timer =  window.setInterval(function(){
                    //自动执行
                    _this.nextBtn.click();
                },this.setting.delay)
             },//旋转函数实现幻灯片左右移动的动画
            carouseRotate:function (dir) { 
                var _this = this;
                var zIndexArr = [];
                if(dir==="left"){
                    this.posterItems.each(function(){
                       var self =$(this); //转为jQuery对象
                       var prev = self.prev().get(0)?self.prev():_this.posterLastItem;
                        var width = prev.width();
                        var height = prev.height();
                        var zIndex = prev.css("zIndex");
                        var opacity = prev.css("opacity");
                        var left = prev.css("left");
                        var top = prev.css("top");
                        zIndexArr.push(zIndex);
                        self.animate({
                            width:width,
                            height:height,
                            left,
                            top,
                            opacity
                        },_this.setting.speed,function () { _this.rotateFlag=!_this.rotateFlag; });
                    });
                    this.posterItems.each(function(i){
                        $(this).css('zIndex',zIndexArr[i]);
                    })
    
                }else if(dir ==="right"){
                    this.posterItems.each(function(){
                        var self =$(this); //转为jQuery对象
                        var prev = self.next().get(0)?self.next():_this.posterFirstItem;
                         var width = prev.width();
                         var height = prev.height();
                         var zIndex = prev.css("zIndex");
                         var opacity = prev.css("opacity");
                         var left = prev.css("left");
                         var top = prev.css("top");
                         zIndexArr.push(zIndex);
    
                         self.animate({
                             width:width,
                             height:height,
                             left,
                             top,
                             opacity
                         },_this.setting.speed,function () {
                              _this.rotateFlag=!_this.rotateFlag; 
                              //每一帧动画结束后调用设置的回调函数
                              if(_this.setting.callback){
                                  _this.setting.callback();
                              }
                            }) 
                    });
                    this.posterItems.each(function(i){
                        $(this).css('zIndex',zIndexArr[i]);
                    });
                }
                
             },
            //设置剩余帧的关系
            setPosterPos:function(){
                var _this = this;
                var sliceItems = this.posterItems.slice(1);
                var sliceSize = sliceItems.size()/2;
                var rightSlice = sliceItems.slice(0,sliceSize);
                var leftSlice = sliceItems.slice(sliceSize);
                //设置层级关系
                var level = Math.floor(this.posterItems.size()/2);
                //设置每一帧的位置关系宽度和高度
                var rw = this.setting.posterWidth,
                    rh = this.setting.posterHeight;
                //计算间隙
                var gap =((this.setting.width-rw)/2)/level;
    
                // 设置第一帧的右边的值
                var firstLeft = (this.setting.width-this.setting.posterWidth)/2;
                //固定的变化值
                var offSetLeft = firstLeft+rw;
    
                
                //设置右边位置帧的位置，宽度，透明度等css样式
                 rightSlice.each(function(i){
                    level--;
                    rw = rw *_this.setting.scale;
                    rh = rh *_this.setting.scale;
                    var  j=i;
                    //优化过  原来 left = offSetLeft+(i++)*gap-rw
                    var left=_this.setting.width-(level*gap)-rw;
                     $(this).css({
                         zIndex:level,
                         width:rw,
                         height:rh,
                         opacity:1/(++j),
                         left,
                         top:_this.setVerticalAlign(rh)
                     });
                    //  console.log(offSetLeft+(i++)*gap-rw);
                    //这里计算left值可以优化
                 });
    
                 var lw = rightSlice.last().width();
                 var lh = rightSlice.last().height();
                 var oloop = Math.floor(this.posterItems.size()/2);
                 //设置左边帧的位置
                 leftSlice.each(function(i){
                    var left = i*gap;
                     $(this).css({
                         zIndex:i,
                         width:lw,
                         height:lh,
                         opacity:1/oloop,
                         left,
                         top:_this.setVerticalAlign(lh)
                     });
                     console.log(lw)
                     lw = lw/_this.setting.scale;
                     lh = lh/_this.setting.scale;
                     oloop--;
    
                 })
            },
            //设置垂直对齐关系
            setVerticalAlign:function(height){
                var verticalType = this.setting.verticalAlign;
                var top = 0;
                
                if(verticalType ==="middle"){
                    top = (this.setting.height-height)/2;
                }else if(verticalType ==="top"){
                    top = 0;
                }else if(verticalType === "bottom"){
                    top = this.setting.height-height;
                }
                return top;
            },
            //获取用户配置参数
            getSetting:function(){
                var setting = this.poster.attr("data-setting");
                //转为json对象
                if(setting && setting !=''){
                    return $.parseJSON(setting);
                }
                return {};
            },
    
            //设置配置参数值去控制基本的宽度和高度。。
            setSettingValue:function(){
                //幻灯片的css
                    this.poster.css({
                        width:this.setting.width,
                        height:this.setting.height
                    });
                //ul的css
                    this.posterItemMain.css({
                        width:this.setting.width,
                        height:this.setting.height
                    });
                    //计算按钮的宽度
                    var btnWidth = (this.setting.width-this.setting.posterWidth)/2;
                    this.nextBtn.css({
                        width:btnWidth,
                        height:this.setting.height,
                        zIndex:Math.ceil(this.posterItems.size()/2)
                    })
                    this.prevBtn.css({
                        width:btnWidth,
                        height:this.setting.height,
                        zIndex:Math.ceil(this.posterItems.size()/2)
                    })
                //设置幻灯片第一帧的css
                    this.posterFirstItem.css({
                        width:this.setting.posterWidth,
                        height:this.setting.posterHeight,
                        left:btnWidth,
                        zIndex:Math.floor(this.posterItems.size()/2)
                    });
                
    
            },

        }
    
        return Carousel;
    })();

    $.fn.Carousel = function(options){
        //单例模式
        return this.each(function(){
            var _this = $(this),
             instance =_this.data("Carousel");
             if(!instance){
                 _this.data("Carousel",(instance=new Carousel(_this,options)));
             }
        })
    }

    $.fn.Carousel.defaults = {
        "selectors":{ //选择器集合
            "posterMain":".poster-main",//carousel的容器  
            "posterList":".poster-list",//carousel里posterItem的容器
            "posterNextBtn":".poster-next-btn",//下一帧按钮
            "posterPrevBtn":".poster-prev-btn",//上一帧按钮
            "posterItem":".poster-item"//posterItem 表示每一帧图
        },
        "width":1000,  //幻灯片容器的宽度
        "height":270,  //幻灯片容器的高度
        "posterWidth":640,//第一帧幻灯片的宽度
        "posterHeight":270,//第一帧幻灯片的高度
        "verticalAlign":"middle",//幻灯片的垂直对齐方式 middle中间对齐 top顶部对齐 bottom底部对齐
        "scale":0.9,  //记录显示比例关系
        "speed":500,//幻灯片播放一帧动画需要的时间
        "autoPlay":false,//幻灯片是否自动播放
        "delay":5000,//自动播放的间隔时间
        "callback":""// 每一帧动画结束后，要执行的回调函数
    }

    $(function(){
		$('[data-Carousel]').Carousel();
	});
})(jQuery)