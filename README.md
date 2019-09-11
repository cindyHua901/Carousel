# Carousel
## A Carousel plugin based on jQuery

## 在你的项目中使用这个插件的方法
首先下载Carousel.js和Carousel.css 在html文件中引用它们，并且引用jQuery（因为这个插件是基于jQuery开发的）  
然后在文件中按照index.html的示例写dom结构  
（1）可以在包裹Carousel的容器里使用 data-Carousel来使用Carousel,只是这样不方便配置参数  
（2）或者在html中使用以下代码来配置Carousel 在Carousel方法里面配置Carousel的参数  
```javaScript
$("#carouselContainer").Carsouel({
// Carsouel setting
width:500,
height:300,
posterWidth:400,
posterHeight:300,
verticalAlign:bottom
})
```
## 参数说明
在Carousel中可以找到Carousel的默认配置参数
```javascript
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
```
