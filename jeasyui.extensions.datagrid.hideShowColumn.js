/**
* 调用该方法，通过抽取当前datagrid中的所有表头（Column），将其加载到创建的dialog中进行选取设置，冻结列（frozenColumns）不在其中
* 将设置好的Column存放到localStorage中，以便用于datagrid初始化时隐藏或显示对应的列
* 注意：datagrid中最好不要设置fitColumns:true，自适应列在隐藏显示操作中不刷新页面的情况下可能导致列宽变窄、拥挤
* @method setHideShowDgColumns
* @param {object} $datagrid datagrid对象，通常可用$('#datagridID')，主要用于获取datagrid中的各Column及title属性
* @author 付啟明
* @since 2016-10-18
*/		
function setHideShowDgColumns($datagrid){
 if ($('#checkShowHideColumnDialog').length === 0) {
  $('body').append('<div id="checkShowHideColumnDialog" class="easyui-dialog" ><table id="checkShowHideColumnDg" class="easyui-datagrid"></table></div>');
  $('#checkShowHideColumnDialog').dialog({
    title: '配置隐藏/显示列',
	iconCls:'icon-filter',
    width: 300,
    height: 300,
    closed: true,
    onOpen: function () {
      var columnFields = $datagrid.datagrid('getColumnFields');
      var columnDefineArray = [
      ];
      var checkedRow = [
      ];
      $.each(columnFields, function (i, columnField) {
        var fieldOptions = $datagrid.datagrid('getColumnOption', columnField);
        fieldOptions.text = fieldOptions.title;
        fieldOptions.value = columnField;
        if (!fieldOptions.hidden) {
          checkedRow.push(i);
        }
        columnDefineArray.push(fieldOptions);
      });
      $('#checkShowHideColumnDg').datagrid({
        fit: true,
        border: true,
        width: 200,
        height: 200,
        lines: true,
        selectOnCheck: true,
        singleSelect: false,
        data: columnDefineArray,
        fitColumns: true,
        columns: [
          [
          {
            field: 'check',
            title: '选择',
            checkbox: 'true'
          },
          {
            field: 'title',
            title: '可操作列',
            width: 80,
			halign: 'center'
          },
          ]
        ],
        onLoadSuccess: function () {
          $.each(checkedRow, function (i, rowIndex) {
            $('#checkShowHideColumnDg').datagrid('checkRow', rowIndex);
          });
        },
		onCheck:function(rowIndex,rowData){
			$datagrid.datagrid('showColumn', rowData.field);
		},
		onUncheck:function(rowIndex,rowData){
			$datagrid.datagrid('hideColumn', rowData.field);
		},
		onCheckAll:function(rows){
			$.each(rows, function (i, row) {
              $datagrid.datagrid('showColumn', row.field);
            });
		},
		onUncheckAll:function(rows){
			$.each(rows, function (i, row) {
              $datagrid.datagrid('hideColumn', row.field);
            });
		}
      });
    },
    buttons: [
      {
        text: '全选',
        handler: function () {
          $('#checkShowHideColumnDg').datagrid('checkAll');
        }
      },
      {
        text: '全不选',
        handler: function () {
          $('#checkShowHideColumnDg').datagrid('clearChecked');
        }
      },
      {
        text: '保存设置',
		iconCls:'icon-save',
        handler: function () {
          var checkedDataArray = $('#checkShowHideColumnDg').datagrid('getChecked');
          var showColumns = [
          ];
          $.each(checkedDataArray, function (i, checkedData) {
            showColumns.push(checkedData.value);
          });
          var columnFields = $datagrid.datagrid('getColumnFields');
          var hideColumn = [
          ];
          $.each(columnFields, function (i, columnField) {
            if ($.inArray(columnField, showColumns) != - 1) {
              $datagrid.datagrid('showColumn', columnField);
            } else {
              hideColumn.push(columnField);
              $datagrid.datagrid('hideColumn', columnField);
            }
          });
		  if(showColumns.length===0){
			$.messager.alert('提示','请至少选择显示一列！');
			return false;
		  }else{
			//将隐藏显示列field存储到localStorage中，这里以datagrid的title为唯一标识，实际使用中可能需要调整，确保唯一性
			//在datagrid初始化的onBeforeLoad事件中通过读取localStorage中对应的值来隐藏显示列
			var hideShowColumn = {'hideColumn':'','showColumn':''};
			hideShowColumn.hideColumn = hideColumn;
			hideShowColumn.showColumn = showColumns;
			var storeHideShowDgField = $datagrid.datagrid('options').title+'_hideShowColumn';
			window.localStorage[storeHideShowDgField] = JSON.stringify(hideShowColumn);
			$('#checkShowHideColumnDialog').dialog('close');
		  }
        }
      },
	  
	  /*
      {
        text: '关闭',
        handler: function () {
          $('#checkShowHideColumnDialog').dialog('close');
        }
      }*/
    ],
	toolbar:[
	  {
        text: '恢复默认',
		iconCls:'icon-back',
        handler: function () {
			$.messager.confirm('确认对话框', '确认放弃自定义的表头，恢复当前表格的隐藏/显示项到默认状态吗？', function(r){
				if (r){
					var storeHideShowDgField = $datagrid.datagrid('options').title+'_hideShowColumn';
					window.localStorage.removeItem(storeHideShowDgField);
					$('#checkShowHideColumnDialog').dialog('close');
					$.messager.show({title:'提示',msg:'已恢复默认，手动刷新当前页面后生效！'});
				}
			})
        }
      },
	  {
        text: '全部重置',
		iconCls:'icon-redo',
        handler: function () {
			$.messager.confirm('确认对话框', '确认重置当前系统中所有表格隐藏/显示项的配置吗？', function(r){
				if (r){
					window.localStorage.clear();
					$('#checkShowHideColumnDialog').dialog('close');
					$.messager.show({title:'提示',msg:'已全部重置，重新登录系统后生效！'});
				}
			});	
        }
      },
	],
	onClose:function(){
		//为避免一个页面中有多个datagrid，每次配置的时候都重新创建dialog
		$('#checkShowHideColumnDialog').dialog('destroy');
	}
  });
  $('#checkShowHideColumnDialog').dialog('open');
} else {
  //$('#checkShowHideColumnDialog').dialog('open');
  $.messager.alert('提示','一次只能选择一张表进行配置，如有其他问题，请联系管理员！');
}
}

/**
* 一般用于初始化datagrid的时候在onBeforeLoad事件中调用该方法，读取localStorage中的隐藏/显示列数据，隐藏显示相关列
* @method getHideShowDgColumnFromLocalStorage
* @param {object} $datagrid datagrid对象，通常可用$('#datagridID')，主要用于获取datagrid中的各Column及title属性
* @author 付啟明
* @since 2016-10-18
*/
function getHideShowDgColumnFromLocalStorage($datagrid){
  var storeHideShowDgField = $datagrid.datagrid('options').title+'_hideShowColumn';
	for(var key in window.localStorage){
	  if(key===storeHideShowDgField){
		  //localStorage以字符串形式存储
		  var hideShowColumnFields = JSON.parse(window.localStorage.getItem(key));
		  var hideColumnFields = hideShowColumnFields.hideColumn;
		  var showColumnFields = hideShowColumnFields.showColumn;
		  if(hideColumnFields!=""){
			$.each(hideColumnFields, function (i, columnField) {
              $datagrid.datagrid('hideColumn', columnField);
			});
		  }
		  if(showColumnFields!=""){
			$.each(showColumnFields, function (i, columnField) {
              $datagrid.datagrid('showColumn', columnField);
			});
		  }
		  break;
	  }
    }
}


/**
* 默认在每个datagrid的表头右键菜单中应用setHideShowDgColumns
*/
var defaultSetHideShowDgColumns = function(e, field) {
	e.preventDefault();
	var grid = $(this);/* grid本身 */
	var gridTitle = grid.datagrid('options').title;
	var headerContextMenu = this.headerContextMenu;/* grid上的列头菜单对象 */
	if (!headerContextMenu && ((gridTitle!="" && gridTitle!=null)?(gridTitle.indexOf("style")!=-1?false:true):false)===true) {
		var tmenu = $('<div style="width:150px;"></div>').appendTo('body');
		$('<div iconCls="icon-filter" name="userDefined"/>').html('隐藏/显示列配置').appendTo(tmenu);
		headerContextMenu = this.headerContextMenu = tmenu.menu({
			onClick : function(item) {
				$(this).menu({
					onClick : setHideShowDgColumns(grid)
				});
			}
		});
	}
	if(headerContextMenu){
		headerContextMenu.menu('show', {
			left : e.pageX,
			top : e.pageY
		});
	}
};
$.fn.datagrid.defaults.onHeaderContextMenu  = defaultSetHideShowDgColumns;

/**
* 默认在每个datagrid的onBeforeLoad中应用getHideShowDgColumnFromLocalStorage
*/
var defaultGetHideShowDgColumnFromLocalStorage = function(){
	getHideShowDgColumnFromLocalStorage($(this));
}
$.fn.datagrid.defaults.onBeforeLoad  = defaultGetHideShowDgColumnFromLocalStorage;


/**以下示例仅供使用参考
①对于采用HTML初始化的datagrid：
//加载隐藏显示列
data-options = "toolbar:'#tb', onBeforeLoad:function(){getHideShowDgColumnFromLocalStorage($('#dgID'))"
//采用toolbar配置隐藏显示列
<div id="tb" style="padding:5px;height:auto">
	<div style="margin-bottom:5px">
		<a href="#" class="easyui-linkbutton" iconCls="icon-filter" plain="true" onclick="setHideShowDgColumns($('#dgID'))">隐藏/显示列</a>
	</div>
</div>

②对于采用JavaScript初始化的datagrid：
//加载隐藏显示列
onBeforeLoad:function(){
					getHideShowDgColumnFromLocalStorage($('#dgID'));
				}
//采用toolbar配置隐藏显示列
toolbar:[{
		'id':'tb1',
		'text':'增加',
		iconCls: 'icon-ok',
		handler: function () {alert('增加')}
		}, "-", 
		{
		text: '隐藏/显示列',
		iconCls: 'icon-filter',
		handler: function () {
			setHideShowDgColumns($('#dgID'));
		}
		}]
*/