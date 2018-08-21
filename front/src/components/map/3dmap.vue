<!--项目管理-->
<template>
  <div class="container">
    <div class="app-container cesiumContainer" id="cesiumContainer"></div>
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button-group class="tool_bar">
        <el-button type="primary" class="icon iconfont icon-tuceng" @click="showBar(1)">&nbsp;图层管理</el-button>
        <el-button type="primary" class="icon iconfont icon-cehuixiaoheditumoshi" @click="showBar(2)">&nbsp;地图设置</el-button>
        <el-button type="primary" class="icon iconfont icon-changjingmoren" @click="showBar(3)">&nbsp;场景管理</el-button>
        <el-button type="primary" class="icon iconfont icon-celiang" @click="showBar(4)">&nbsp;空间测量</el-button>
      </el-button-group>
    </div>

    <!-- 图层树结构 -->
    <div class="tuceng_tree">
      <span v-show="bar_num == 1">
          <el-input class = "tuceng_search" placeholder="查找" v-model="filterText"> </el-input>
          <el-tree class="filter-tree" :data="tc_data" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2"></el-tree>
      </span>
    </div>

    <!-- 地图设置 -->
    <span v-show="bar_num == 2">
      <div class="ditu_mag">
        <div class="ditu_title">地图设置</div>
        <div class="ditu_content">
          <el-row :gutter="10" style="width: 455px">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <img class="img_dt" src="../../assets/map_images/Image.png" @click="show_dt(1)"/>
                <div class="img_cls_dt">Image</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <img class="img_dt" src="../../assets/map_images/Bing.png" @click="show_dt(2)"/>
                <div class="img_cls_dt">BingMap</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <img class="img_dt" src="../../assets/map_images/tianditu.png" @click="show_dt(3)"/>
                <div class="img_cls_dt">天地图</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <img class="img_dt" src="../../assets/map_images/OSM.png" @click="show_dt(4)"/>
                <div class="img_cls_dt">Open Street Map</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </span>
    
    <!-- 场景管理 -->
    <span v-show="bar_num == 3">
      <div class="changjing_mag">
        <div class="changjing_title">场景设置</div>
        <div class="changjing_content">
          <el-tabs :tab-position="tabPosition">
            <el-tab-pane label="颜色校正">
              <div class="color_setting">
                <table>
                  <tbody>
                    <tr>
                      <td>亮度</td>
                      <el-slider v-model="viewModel.brightness" :max="3" :step="0.02" @change="updateViewModel()"></el-slider>
                    </tr>
                    <tr>
                      <td>对比度</td>
                      <el-slider v-model="viewModel.contrast" :max="3" :step="0.02" @change="updateViewModel()"></el-slider>
                    </tr>
                    <tr>
                      <td>色调</td>
                      <el-slider v-model="viewModel.hue" :max="3" :step="0.02" @change="updateViewModel()"></el-slider>
                    </tr>
                    <tr>
                      <td>饱和度</td>
                      <el-slider v-model="viewModel.saturation" :max="3" :step="0.02" @change="updateViewModel()"></el-slider>
                    </tr>
                  </tbody>
                </table>
                <el-button class="cz_btn" @click="cz_btn()">重置</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="分屏显示">分屏数目选择
              <el-select class="fenping_sel" v-model="value" style="padding-top:10px;" clearable placeholder="请选择" @change="getFp">
                <el-option v-for="item in fenping_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-tab-pane>
            <el-tab-pane label="位置信息">
              位置信息
              <div style="padding-top:20px;">
                <div>
                  <label style="padding-left:20px;">经度：</label>
                  <el-tag type="info">{{longitude}}</el-tag>
                </div>
                <div style="padding-top: 15px;">
                  <label style="padding-left:20px;">纬度：</label>
                  <el-tag type="info">{{latitude}}</el-tag>
                </div>
                <div style="padding-top: 15px;">
                  <label style="padding-left:20px;">高度：</label>
                  <el-tag type="info">{{height}}</el-tag>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </span>

    <!-- 空间测量 -->
    <span v-show="bar_num == 4">
      <div class="celiang_mag">
        <div class="celiang_title">量算</div>
        <div class="celiang_content">
          <el-select v-model="celiangType" style="padding-top:20px;" clearable placeholder="请选择模式">
                <el-option v-for="item in celiangOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button-group class="celiang_btn" style="padding-top: 20px;padding-left: 20px;">
            <el-button type="primary">测距</el-button>
            <el-button type="primary">测面</el-button>
            <el-button type="primary">测高</el-button>
            <el-button type="primary">清除</el-button>
          </el-button-group>
        </div> 
      </div>
    </span>

    <!-- 属性窗口 -->
    <div class="properties" v-show="isshowproperty">
      <div class="properties_title">
        <label style="font-weight: 500;">对象属性</label>
        <i class="el-icon-close" style="font-size: 20px;padding-left: 190px;" @click="closeProperty"></i>
      </div>
      <div class="properties_content">
        <el-tabs type="card" style="height: 400px;background-color:white;">
          <el-tab-pane label="基本属性">
            <el-table class="properties_bac">
              <el-table-column prop="date" label="属性" width="150px" style="text-align:center;"> </el-table-column>
              <el-table-column prop="name" label="值" width="150px"> </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="附属属性">

          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import store from "@/store";
  export default {
    name: 'authority',
    store,
    data() {
      return {
        Cesium: window.Cesium,
        viewer: {},
        bar_num: null,
        tabPosition: 'left',
        filterText: '',
        viewModel: { brightness: 1, contrast: 1, hue: 0, saturation: 0 },
        longitude: '',
        latitude: '',
        height: '',
        imageryLayers: {},
        isshowproperty: false,
        celiangType:'',
        celiangOptions:[{label:'空间量算',value:'celiang1'},{label:'空间量算',value:'celiang2'}],
        tc_data: [{
          label: '道路',
          children: [{
            label: '城市快速路',
            children: [{
              label: '延安高架',
              children: [{
                label: 'YD-Z1'
              }]
            }, {
              label: '南北高架'
            }]
          },
          {
            label: '高速公路'
          },
          {
            label: '大桥'
          },
          {
            label: '隧道',
            children: [{
              label: '文一路隧道',
              children: [{
                label: '中段'
              }]
            }]
          }]
        }, {
          label: '建筑物',
          children: [{
            label: '居住建筑'
          }, {
            label: '公共建筑'
          },
          {
            label: '工业建筑'
          }, {
            label: '农业建筑'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        fenping_options: [{
          value: 'option1',
          label: '不使用分屏'
        }, {
          value: 'option2',
          label: '水平分屏'
        }, {
          value: 'option3',
          label: '垂直分屏'
        }, {
          value: 'option4',
          label: '三视口'
        }, {
          value: 'option5',
          label: '四视口'
        }],
        value: 'option1'
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },
    methods: {
      showBar(num) {
        if (this.bar_num === num) {
          this.bar_num = null
        } else {
          this.bar_num = num
        }
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      updateViewModel() {
        if (this.imageryLayers.length > 0) {
          var layer = this.imageryLayers.get(0)
          layer.brightness = this.viewModel.brightness
          layer.contrast = this.viewModel.contrast
          layer.hue = this.viewModel.hue
          layer.saturation = this.viewModel.saturation
        }
      },
      cz_btn() {
        this.viewModel.brightness = 1
        this.viewModel.contrast = 1
        this.viewModel.hue = 0
        this.viewModel.saturation = 0
        this.updateViewModel()
      },
      getFp(value) {
        if (value === 'option1') {
          console.log(value)
        }
        if (value === 'option2') {
          console.log(value)
        }
        if (value === 'option3') {
          console.log(value)
        }
        if (value === 'option4') {
          console.log(value)
        }
      },
      showCoords() {
        var scene = this.viewer.scene
        var that = this
        var handler = new that.Cesium.ScreenSpaceEventHandler(scene.canvas)
        handler.setInputAction(function(e) {
          // 获取点击位置笛卡尔坐标
          var position = scene.pickPosition(e.position)
          // 将笛卡尔坐标转化为经纬度坐标
          var cartographic = that.Cesium.Cartographic.fromCartesian(position)
          that.longitude = that.Cesium.Math.toDegrees(cartographic.longitude)
          that.latitude = that.Cesium.Math.toDegrees(cartographic.latitude)
          that.height = cartographic.height
        }, that.Cesium.ScreenSpaceEventType.LEFT_CLICK)
      },
      showProperty() {
        var scene = this.viewer.scene
        var that = this
        var handler = new that.Cesium.ScreenSpaceEventHandler(scene.canvas)
        handler.setInputAction(function(e) {
          that.isshowproperty = true
        }, that.Cesium.ScreenSpaceEventType.LEFT_CLICK)
      },
      closeProperty() {
        this.isshowproperty = false
      },
      showProperties() {
        var scene = this.viewer.scene
        var that = this
        this.viewer.pickEvent.addEventListener(function(feature) {
          debugger;
          that.isshowproperty = true
          var table = document.getElementById("properties_bac")
          for (var i = table.rows.length-1;i > -1;i--){
              table.deleteRow(i);
          }
          for(var key in feature ){
              var newRow = table.insertRow();
              var cell1 = newRow.insertCell();
              var cell2 = newRow.insertCell();
              cell1.innerHTML = key;
              cell2.innerHTML = feature[key];
          }
        })
      }
    },
    created() {
      this.$nextTick(function() {
        var viewer = new this.Cesium.Viewer('cesiumContainer', {
          imageryProvider: new this.Cesium.TiandituImageryProvider({
            credit: this.Cesium.Credit('天地图全球影像服务     数据来源：国家地理信息公共服务平台 & 四川省测绘地理信息局')
          })
        })
        var scene = viewer.scene
        var widget = viewer.cesiumWidget

        // 设置开启地下场景
        viewer.scene.undergroundMode = true
        try {
          var url = 'http://192.168.97.11:8090/iserver/services/3D-wyltj0815/rest/realspace/datas/%E5%A2%99_%E4%B8%AD%E6%98%8E%E6%8C%96%E6%AE%B5_%E5%9C%9F%E5%BB%BA_20160418_1_1@wyltj0815/config'
          var promise = scene.addS3MTilesLayerByScp(url, { name: 'structure_column' })
          //设置相机视角
               scene.camera.setView({
            destination: this.Cesium.Cartesian3.fromDegrees(120.1068, 30.28931, 32),
            orientation: {
              heading: 42.03144044187928, // east, default value is 0.0 (north)
              pitch: -0.5131181562794307, // default value (looking down)
              roll: 0.0
            }
          })

          this.Cesium.when(promise, function (layer) {
                if(!scene.pickPositionSupported){
                    alert('不支持深度拾取,属性查询功能无法使用！');
                }
                // 设置查询参数
            layer.setQueryParameter({
                url: 'http://192.168.97.11:8090/iserver/services/data-wyltj0816/rest/data',
                dataSourceName: 'wyltj0815',
                dataSetName: '墙_中明挖段_土建_20160418_1_1',
                keyWord: 'SmID'
            });
                
            }, function (e) {
                if (widget._showRenderLoopErrors) {
                    var title = '渲染时发生错误，已停止渲染。';
                    widget.showErrorPanel(title, undefined, e);
                }
            });
        } catch (e) {
          if (widget._showRenderLoopErrors) {
            var title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？'
            widget.showErrorPanel(title, undefined, e)
          }
        }
        this.imageryLayers = viewer.imageryLayers
        // 获取经纬度信息
        //this.showCoords()
        // 属性信息
        //this.showProperty()
        //this.showProperties()
        // 注册鼠标点击事件
        viewer.pickEvent.addEventListener(function(feature) {
          console.log(feature);
          that.isshowproperty = true
          var table = document.getElementById("properties_bac")
          for (var i = table.rows.length-1;i > -1;i--){
              table.deleteRow(i);
          }
          for(var key in feature ){
              var newRow = table.insertRow();
              var cell1 = newRow.insertCell();
              var cell2 = newRow.insertCell();
              cell1.innerHTML = key;
              cell2.innerHTML = feature[key];
          }
        })
        this.viewer = viewer
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../../static/Cesium/Widgets/widgets.css";

  html, body, .cesiumContainer {
    width: 100%; height: 100%; margin: 0; padding: 0;
    overflow: hidden;
    background: #000;
    color: rgb(44, 11, 11);
    font-family: sans-serif;
    font-size: 10pt;
    -webkit-overflow-scrolling: touch;
  }
  .toolbar {
    position: absolute;
    top: 130px;
    left: 200px;
    .tool_bar{
      .el-button--primary {
        color: #fff;
        background-color: #56bd91;
        border-color: #50801500;
      }
      .el-button--primary:hover{
        background-color: #6fd2a8;
      }
      .el-button--primary:focus{
        background-color: #56bd91;
      }
      .el-button--primary:active{
        background-color: #56bd91;
      }
    }
  }
  .tuceng_tree {
    position: absolute;
    top: 175px;
    left: 200px;
    .el-tree {
      background: #403f3f;
      color: #fbfcfd;
      width: 240px;
      opacity: 0.9;
    }
    .tuceng_search {
      width: 240px;
      border: 0px;
    }
    .el-tree-node__content:hover{
      background: #616165;
    }
    .el-tree-node:focus>.el-tree-node__content {
        background-color: #616165;
    }
    .el-input__inner {
      background-color: #403f3f;
      color: #a2a4a7;
      width: 240px;
      opacity: 0.9;
      border-color: #616165;
    }
    .el-input__inner:focus {
      background-color: #616165;
      border-color: #6fd2a8;
    }
  }
  .ditu_mag {
    position: absolute;
    top: 180px;
    left: 400px;
    width: 480px;
    height: 180px;
    background-color: #403f3f;
    opacity: 0.9;
    .ditu_title{
      padding-left: 15px;
      padding-top: 15px;
      color:white;
    }
    .ditu_content{
      padding-top:20px;
      padding-left:20px;
    }
    .img_dt{
      width: 100px;
      height: 80px;
      border-style: inset;
    }
    .bg-purple-dark {
      background: #99a9bf;
    }
    .bg-purple {
      background: #d3dce6;
      width: 100px;
      height: 80px;
    }
    .bg-purple-light {
      background: #e5e9f2;
    }
    .grid-content {
      border-radius: 4px;
      min-height: 36px;
    }
    .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
    }
    .grid-content {
      border-radius: 4px;
      min-height: 80px;
    }
    .img_cls_dt{
      padding-top: 5px;
      background-color: #403f3f;
      color: white;
      font-family: -webkit-pictograph;
    }
  }
  .changjing_mag {
    position: absolute;
    top: 180px;
    left: 400px;
    width: 400px;
    background-color: #403f3f;
    opacity: 0.9;
    .changjing_title{
      padding-left: 15px;
      padding-top: 15px;
      color:white;
    }
    .changjing_content{
       padding-left: 10px;
       padding-top: 10px;
       padding-bottom: 15px;
       height: 240px;
    }
    .el-tabs--left .el-tabs__item.is-left {
      text-align: right;
      color: white;
      padding-top: 15px; 
      padding-bottom: 15px;
    }
    .el-tabs{
      .el-tabs__item{
        height: 55px;
      }
    }
    .el-tabs__content {
      color: white;
      height: 250px;
    }
    .el-tabs__active-bar {
      background-color: #56bd91;
      height: 185px;
    }
    .el-tabs__active-bar is-left {
      height: 60px;
    }
    .el-slider__runway {
      width: 200px;
      height: 6px;
      left: 10px;
    }
    .el-slider__bar {
      height: 6px;
      background-color: #59c39b;
    }
    .el-slider__button {
      border: 2px solid #59c39b;
    }
    .el-input__inner {
      background-color: #403f3f;
      color: #a2a4a7;
      width: 240px;
      opacity: 0.9;
      border-color: #616165;
    }
    .el-input__inner:focus {
      background-color: #616165;
      border-color: #6fd2a8;
    }
    .cz_btn{
      width: 80px;
      height: 30px;
    }
    .cz_btn:focus, .cz_btn:hover {
      color: #606266;
      border-color: #40d6b6;
      background-color: #fff;
    }
    .el-dropdown + .el-dropdown {
      margin-left: 15px;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .el-scrollbar__view, .el-select-dropdown__list{
      .el-select-dropdown__item {
        font-size: 12px;
      }
      .el-select-dropdown__item.selected {
        color: #606266;
      }
    }
    .el-select .el-input.is-focus .el-input__inner, .el-select .el-input__inner:focus {
      border-color: #40d6b6;
    }
    .el-tag--info, .el-tag--info .el-tag__close {
      color: #f9fafb;
    }
    .el-tag {
      width: 150px;
    }
  }
  .celiang_mag{
    top: 180px;
    left: 550px;
    position: absolute;
    background-color:#403f3f;
    opacity:0.9;
    width: 315px;
    height: 160px;
    .celiang_title{
      padding-left: 15px;
      padding-top: 15px;
      color:white;
    }
    .celiang_content{
      .el-select-dropdown{
        min-width: 240px !important;
        position: absolute;
        top: 266px;
        left: 570px;
        transform-origin: center top 0px;
        z-index: 2001;
      }
    }
    .el-input__inner {
      background-color: #403f3f;
      color: #a2a4a7;
      width: 240px;
      opacity: 0.9;
      border-color: #616165;
    }
    .el-select .el-input__inner:focus, .el-select .el-input.is-focus {
        border-color: #40d6b6;
    }
    .el-col {
      border-radius: 4px;
    }
    .el-button--primary {
      color: #fff;
      background-color: #56bd91;
      border-color: #50801500;
    }
    .el-button--primary:hover{
      background-color: #6fd2a8;
    }
    .el-button--primary:focus{
      background-color: #56bd91;
    }
    .el-button--primary:active{
      background-color: #56bd91;
    }
  }
  .properties{
    position: absolute;
    top: 180px;
    right: 10px;
    width: 300px;
    height: 500px;
    .properties_title{
      background: aliceblue;
      height: 35px;
      padding-inline-start: 20px;
      padding-top: 12px;
    }
    .properties_content{
      .el-tabs{
        .el-tabs__item{
          height: 40px;
          width: 148px
        }
        .el-tabs__item is-top is-active {
          color: #403f3f;
        }
        .el-tabs__content {
          height: 250px;
        }
      }
      .el-table th{
          text-align: center;
      }
    }
  }
</style>
