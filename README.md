# jeasyui.extensions.datagrid.hideShowColumn
**jQuery EasyUI datagrid隐藏显示列插件扩展**

## Resources

* [jQuery EasyUI](http://www.jeasyui.com/)

## Installing

```html
<script src="jeasyui.extensions.datagrid.hideShowColumn.js"></script>
```

  主要包含两个方法：
  1. setHideShowDgColumns($datagrid)，用于配置隐藏显示列，通过HTML5 localStorage存放；
  2. getHideShowDgColumnFromLocalStorage($datagrid)，用于获取配置好的隐藏显示列。 
  
<p>通常在datagrid初始化的onBeforeLoad事件中获取用户自定义的隐藏显示列。通常可以在表头右键中定义默认的按钮用于打开配置窗口，也可通过单独定义的按钮或其他标签来打开配置窗。
<p>使用方法详见代码注释。其中基础版本（base vision）用于一般需求，定制版本（custom vision）用于更全面完整的项目需要。区别在于定制版本做了很多默认设置，以及更完整的控制操作。
