<template>
    <div id="map">
        <div id="popup" class="ol-popup" style="">
            <div id="popup-header" style="">详细信息
                <a id="popup-closer" class="ol-popup-closer"></a>
            </div>
            <!-- 缺陷详细信息 -->
            <div id="popup-content" v-if="detailType==0" style="overflow: auto;max-height: 500px;padding-top:5px;">
                <el-form label-width="80px" class="demo-dynamic" style="width:100%;">
                    <el-form-item label="多媒体">
                        <el-select v-model="quexianDetail.MediaType" placeholder="请选择类型">
                            <el-option label="照片" value="1"></el-option>
                            <el-option label="视频" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-carousel height="150px" v-show="quexianDetail.MediaType=='1' && quexianDetail.PHOTOES.length>0">
                    <el-carousel-item v-for="item in quexianDetail.PHOTOES" :key="item">
                        <img :src="item" height="150px" width="370px" @click="lookBigimg(item)" />
                    </el-carousel-item>
                </el-carousel>
                <p v-show="quexianDetail.PHOTOES.length==0">当前无照片</p>
                <el-carousel height="150px" v-show="quexianDetail.MediaType=='2' && quexianDetail.VIDEOS.length>0" :autoplay='false'>
                    <el-carousel-item v-for="item in quexianDetail.VIDEOS" :key="item">
                        <video height="150px" width="100%" autoplay controls :src="item" @click="lookBigvideo(item)"></video>
                    </el-carousel-item>
                </el-carousel>
                <p v-show="quexianDetail.VIDEOS.length==0">当前无视频</p>
                <table class="popupDetailTable">
                    <tr>
                        <td v-show="!isEdit">类型：{{quexianDetail.ISSUE_TP}}</td>
                        <td v-show="isEdit">类型:<select v-model="quexianDetail.ISSUE_TP">
                                                                                                    <option v-for="item in ISSUE_TPOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">缺陷类型:{{quexianDetail.BUG_TYPE}}</td>
                        <td v-show="isEdit">缺陷类型:<select v-model="quexianDetail_type">
                                                                                                    <option v-for="item in bugTypeOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                        <td v-show="!isEdit">高程:{{quexianDetail.HEIGHT}}</td>
                        <td v-show="isEdit">高程:<input v-model="quexianDetail.HEIGHT" style="width:60px;" /></td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">问题类型:{{quexianDetail.ISSUE_TYPE}}</td>
                        <td v-show="isEdit">问题类型:<select v-model="quexianDetail.ISSUE_TYPE">
                                                                                                    <option v-for="item in issueTypeOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                        <td>管段编号:{{quexianDetail.PIPE_SEG_NUM}}</td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">缺陷等级:{{quexianDetail.BUGLEVEL}}</td>
                        <td v-show="isEdit">缺陷等级:
                        <select v-model="quexianDetail.BUGLEVEL">
                            <option v-for="item in qxdjOptions" :key="item" :label="item" :value="item">{{item}}</option>
                        </select>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">缺陷描述:{{quexianDetail.BUG_DESCRIPTION}}</td>
                        <td v-show="isEdit">缺陷描述:<input v-model="quexianDetail.BUG_DESCRIPTION" style="width:60px;" /></td>
                        <td></td>
                    </tr>
                </table>
                <el-row style="text-align:center;">
                    <el-button type="primary" size="small" @click="issueQX" v-if="qx['修改']==1">{{isEdit?'取消编辑':'编辑'}}</el-button>
                    <el-button v-show="isEdit" type="primary" size="small" @click="issueSave">保存</el-button>
                </el-row>
            </div>
            <!-- 管点详细信息 -->
            <div id="popup-content" v-if="detailType==1" style="overflow: auto;max-height: 500px;padding-top:5px;">
                <table class="popupDetailTable">
                    <tr>
                        <td>点号:{{guandianDetail.PID}}</td>
                        <td v-show="!isEdit">特征:{{guandianDetail.FEATURE}}</td>
                        <td v-show="isEdit">特征:<select v-model="guandianDetail.FEATURE">
                                                                                                    <option v-for="item in featureOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">地面高程:{{guandianDetail.GROUND_HEIGHT}}</td>
                        <td v-show="isEdit">地面高程:<input v-model="guandianDetail.GROUND_HEIGHT" style="width:60px;" /></td>
                        <td v-show="!isEdit">附属物:{{guandianDetail.ACCESSORY}}</td>
                        <td v-show="isEdit">附属物:<select v-model="guandianDetail.ACCESSORY">
                                                                                                    <option v-for="item in AccessoryOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">支管埋深:{{guandianDetail.BRANCH_BURY_DEPTH}}</td>
                        <td v-show="isEdit">支管埋深:<input v-model="guandianDetail.BRANCH_BURY_DEPTH" style="width:60px;" /></td>
                        <td v-show="!isEdit">埋深:{{guandianDetail.BURY_DEPTH}}</td>
                        <td v-show="isEdit">埋深:<input v-model="guandianDetail.BURY_DEPTH" style="width:60px;" /></td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">上游埋深:{{guandianDetail.UPSTREAM_BURY_DEPTH}}</td>
                        <td v-show="isEdit">上游埋深:<input v-model="guandianDetail.UPSTREAM_BURY_DEPTH" style="width:60px;" /></td>
                        <td v-show="!isEdit">井深:{{guandianDetail.WELL_DEPTH}}</td>
                        <td v-show="isEdit">井深:<input v-model="guandianDetail.WELL_DEPTH" style="width:60px;" /></td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">下游埋深:{{guandianDetail.DOWNSTREAM_BURY_DEPTH}}</td>
                        <td v-show="isEdit">下游埋深:<input v-model="guandianDetail.DOWNSTREAM_BURY_DEPTH" style="width:60px;" /></td>
                        <td v-show="!isEdit">角度:{{guandianDetail.ANGLE}}</td>
                        <td v-show="isEdit">角度:<input v-model="guandianDetail.ANGLE" style="width:60px;" /></td>
                    </tr>
                    <tr>
                        <td>井底高程:</td>
                        <td v-show="!isEdit">{{guandianDetail.WELL_HEIGHT}}</td>
                        <td v-show="isEdit"><input v-model="guandianDetail.WELL_HEIGHT" style="width:60px;" /></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
                <el-tabs type="card" v-model="guandianDetail.activeName">
                    <el-tab-pane label="外部检查值" name="first">
                        <table id="outtable">
                            <tr>
                                <th class="thone">属性值</th>
                                <th class="thtwo">值</th>
                                <th class="thone">属性值</th>
                                <th class="thtwo">值</th>
                            </tr>
                            <tr>
                                <td class="tdone">井盖埋没</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.IS_WELLCOVER_BURIED}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.IS_WELLCOVER_BURIED" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">井盖破损</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.IS_WELLCOVER_BROKEN}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.IS_WELLCOVER_BROKEN" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                            </tr>
                            <tr>
                                <td class="tdone">盖框间隙</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.COVER_FRAME_ISOLATED}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.COVER_FRAME_ISOLATED" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">盖板高差</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.COVER_FRAME_HEIGHT_H_DIS}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.COVER_FRAME_HEIGHT_H_DIS" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                            </tr>
                            <tr>
                                <td class="tdone">井盖丢失</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.IS_WELLCOVER_LOST}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.IS_WELLCOVER_LOST" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">井框破损</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.IS_WELLFRAME_BROKEN}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.IS_WELLFRAME_BROKEN" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                            </tr>
                            <tr>
                                <td class="tdone">盖框突出或凹陷</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.COVER_FRAME_EXTRUDE_CONCAVE}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.COVER_FRAME_EXTRUDE_CONCAVE" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">跳动和声响</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.POPING_SOUND}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.POPING_SOUND" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                            </tr>
                            <tr>
                                <td class="tdone">周边路面破损或沉降</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.GROUND_BROKEN}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.GROUND_BROKEN" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">井盖标识错误</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.WELLCOVER_WRONG_ID}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.WELLCOVER_WRONG_ID" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                            </tr>
                            <tr>
                                <td class="tdone">是否为重型井盖</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.IS_HEAVY_COVER}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.IS_HEAVY_COVER" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">其它</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.OUT_INSPECT_OTHER}}</td>
                                <td v-show="isEdit"><input v-model="guandianDetail.OUT_INSPECT_OTHER" style="width:60px;" /></td>
                            </tr>
                        </table>
                    </el-tab-pane>
                    <el-tab-pane label="内部检查值" name="second">
                        <table id="outtable">
                            <tr>
                                <th class="thone">属性值</th>
                                <th class="thtwo">值</th>
                                <th class="thone">属性值</th>
                                <th class="thtwo">值</th>
                            </tr>
                            <tr>
                                <td class="tdone">链条或锁具</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.CHAIN_LOCKS}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.CHAIN_LOCKS" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">爬梯松动/锈蚀/缺损</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.LADDER_BROKEN}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.LADDER_BROKEN" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                            </tr>
                            <tr>
                                <td class="tdone">井壁泥垢</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.WELL_WALL_MUD}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.WELL_WALL_MUD" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">井壁裂缝</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.WELL_WALL_SPLIT}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.WELL_WALL_SPLIT" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                            </tr>
                            <tr>
                                <td class="tdone">井壁渗漏</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.WELL_WALL_LEAK}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.WELL_WALL_LEAK" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">抹面脱落</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.SURF_DROP}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.SURF_DROP" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                            </tr>
                            <tr>
                                <td class="tdone">管口孔洞</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.PIPE_MOUTH_HOLE}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.PIPE_MOUTH_HOLE" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">流槽破损</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.LAUNDER_BROKEN}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.LAUNDER_BROKEN" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                            </tr>
                            <tr>
                                <td class="tdone">井底积泥/杂物</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.WELL_BOTTOM_MUD}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.WELL_BOTTOM_MUD" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">水流不畅</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.WATERFLOW_BLOCK}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.WATERFLOW_BLOCK" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                            </tr>
                            <tr>
                                <td class="tdone">浮渣</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.SCRUFF}}</td>
                                <td v-show="isEdit"><select v-model="guandianDetail.SCRUFF" placeholder="请选择">
                                                                                                    <option v-for="item in boolOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                <td class="tdone">其他</td>
                                <td v-show="!isEdit" class="tdtwo">{{guandianDetail.IN_INSPECT_OTHER}}</td>
                                <td v-show="isEdit"><input v-model="guandianDetail.IN_INSPECT_OTHER" style="width:60px;" /></td>
                            </tr>
                        </table>
                    </el-tab-pane>
                </el-tabs>
                <el-row style="text-align:center;">
                    <el-button type="primary" size="small" @click="guandianQX" v-if="qx['修改']==1">{{isEdit?'取消编辑':'编辑'}}</el-button>
                    <el-button v-show="isEdit" type="primary" size="small" @click="guandianSave">保存</el-button>
                </el-row>
            </div>
            <!-- 管段详细信息 -->
            <div id="popup-content" v-if="detailType==2" style="overflow: auto;max-height: 500px;padding-top:5px;">
                <!-- <el-form label-width="80px" class="demo-dynamic" style="width:100%;">
                                                                        <el-form-item label="多媒体">
                                                                            <el-select v-model="guanduanDetail.MediaType" placeholder="请选择类型">
                                                                                <el-option label="照片" value="1"></el-option>
                                                                                <el-option label="视频" value="2"></el-option>
                                                                            </el-select>
                                                                        </el-form-item>
                                                                    </el-form>
                                                                    <el-carousel height="150px" v-show="guanduanDetail.MediaType=='1'">
                                                                        <el-carousel-item v-for="item in guanduanDetail.PHOTOES" :key="item" v-show=" guanduanDetail.PHOTOES.length>0">
                                                                            <img :src="item" height="150px" width="370px" @click="lookBigimg(item)" />
                                                                        </el-carousel-item>
                                                                        <p v-show="guanduanDetail.PHOTOES.length==0">当前无照片</p>
                                                                    </el-carousel>
                                                                    <el-carousel height="150px" v-show="guanduanDetail.MediaType=='2'" :autoplay='false'>
                                                                        <el-carousel-item v-for="item in guanduanDetail.VIDEOS" :key="item" v-show=" guanduanDetail.VIDEOS.length>0">
                                                                            <video height="150px" width="100%" autoplay controls :src="item" @click="lookBigvideo(item)"></video>
                                                                        </el-carousel-item>
                                                                        <p v-show="guanduanDetail.VIDEOS.length==0">当前无视频</p>
                                                                    </el-carousel> -->
                <table class="popupDetailTable">
                    <tr>
                        <td>管段编号:{{guanduanDetail.PIPE_SEG_NUM}}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>起点编号:{{guanduanDetail.BEGIN_P_NUM}}</td>
                        <td>链接方向点号:{{guanduanDetail.END_P_NUM}}</td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">管道材质:{{guanduanDetail.MATERIAL}}</td>
                        <td v-show="isEdit">管道材质:<select v-model="guanduanDetail.MATERIAL">
                                                                                                    <option v-for="item in materialOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                        <td v-show="!isEdit">管径:{{guanduanDetail.RADIUS}}</td>
                        <td v-show="isEdit">管径:<input v-model="guanduanDetail.RADIUS" style="width:60px;" /></td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">埋设类型:{{guanduanDetail.SET_TYPE}}</td>
                        <td v-show="isEdit">埋设类型:<select v-model="guanduanDetail.SET_TYPE">
                                                                                                    <option v-for="item in set_typeOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                        <td v-show="!isEdit">权属单位:{{guanduanDetail.AUTHORITY}}</td>
                        <td v-show="isEdit">权属单位:<select v-model="guanduanDetail.AUTHORITY">
                                                                                                    <option v-for="item in AuthorityOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                        <!-- <td v-show="!isEdit">专业注记角度:{{guanduanDetail.SLOPE}}</td>
                                                                            <td v-show="isEdit">专业注记角度:<input v-model="guanduanDetail.SLOPE" style="width:60px;" /></td> -->
                    </tr>
                    <!-- <tr>
                                                                            <td v-show="!isEdit">权属单位:{{guanduanDetail.AUTHORITY}}</td>
                                                                            <td v-show="isEdit">权属单位:<select v-model="guanduanDetail.AUTHORITY">
                                                                                                    <option v-for="item in AuthorityOptions" :key="item" :label="item" :value="item">{{item}}</option>
                                                                                                </select></td>
                                                                             <td v-show="!isEdit">专业注记内容:{{guanduanDetail.FLOW_DIRECTION}}</td>
                                                                            <td v-show="isEdit">专业注记内容:<input v-model="guanduanDetail.FLOW_DIRECTION" style="width:60px;" /></td>
                                                                        </tr> -->
                    <tr>
                        <td v-show="!isEdit">坡度:{{guanduanDetail.SLOPE?guanduanDetail.SLOPE.toFixed(9):''}}</td>
                        <td v-show="isEdit">坡度:<input v-model="guanduanDetail.SLOPE" style="width:60px;" /></td>
                        <td v-show="!isEdit">流向:{{guanduanDetail.FLOW_DIRECTION}}</td>
                        <td v-show="isEdit">流向:
                            <select v-model="guanduanDetail.FLOW_DIRECTION">
                                <option v-for="item in flowOptions" :key="item" :label="item" :value="item">{{item}}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">管段长度:{{guanduanDetail.CALC_LENGTH.toFixed(2)}}</td>
                        <td v-show="isEdit">管段长度:<input v-model="guanduanDetail.CALC_LENGTH" style="width:60px;" /></td>
                        <td v-show="!isEdit">建设年代:{{guanduanDetail.CONSTRUCT_TIMES}}</td>
                        <td v-show="isEdit">建设年代:<input v-model="guanduanDetail.CONSTRUCT_TIMES" style="width:60px;" /></td>
                    </tr>
                    <tr>
                        <td v-show="!isEdit">备注:{{guanduanDetail.COMMENTS}}</td>
                        <td v-show="isEdit">备注:<input v-model="guanduanDetail.COMMENTS" style="width:60px;" /></td>
                        <td></td>
                    </tr>
                </table>
                <el-row style="text-align:center;">
                    <el-button type="primary" size="small" @click="guanduanQX" v-if="qx['修改']==1">{{isEdit?'取消编辑':'编辑'}}</el-button>
                    <el-button v-show="isEdit" type="primary" size="small" @click="guanduanSave">保存</el-button>
                </el-row>
            </div>
        </div>
        <el-button-group id="mapChange">
            <el-button type="primary" size="small" @click="mapChange('road')"><i class="icon iconfont zh-right zh-icon-iconset0395" style="margin-right:5px;"></i>矢量</el-button>
            <el-button type="primary" icon="el-icon-location-outline" size="small" @click="mapChange('img')">影像</el-button>
        </el-button-group>
        <el-row id="toolBar">
            <el-popover placement="left" width="100">
                <el-card class="box-card">
                    <div class="text item" @click="measureActivate('LineString',false)">距离</div>
                    <div class="text item" @click="measureActivate('Polygon',false)">面积</div>
                </el-card>
                <el-button slot="reference" size="small" circle><i class="icon iconfont zh-icon-celiang"></i></el-button>
            </el-popover>
            <el-button size="small" circle @click="exportMap"><i class="icon iconfont zh-icon-jietu"></i></el-button>
            <el-popover placement="left" width="100">
                <el-card class="box-card">
                    <div class="text item" @click="measureActivate('Circle',true,true)">圆域查询</div>
                    <div class="text item" @click="measureActivate('Box',true,true)">矩形查询</div>
                    <div class="text item" @click="measureActivate('Polygon',true,true)">多边形查询</div>
                </el-card>
                <el-button slot="reference" size="small" circle><i class="el-icon-search"></i></el-button>
            </el-popover>
            <el-popover placement="left" width="100">
                <el-card class="box-card">
                    <div class="text item">缺陷问题</div>
                    <div class="text item">事故点</div>
                </el-card>
                <el-button slot="reference" icon="el-icon-plus" size="small" circle disabled></el-button>
            </el-popover>
            <el-button size="small" circle @click="viewHome"><i class="icon iconfont zh-icon-fanhui"></i></el-button>
            <el-button size="small" circle @click="clearMap()"><i class="el-icon-delete"></i></el-button>
        </el-row>
        <el-card class="box-card" id="legend">
            <div class="legend"><img src="/static/img/管点.png" />
                <div>管点</div>
            </div>
            <div class="legend"><img src="/static/img/管段.png" />
                <div>管段</div>
            </div>
            <div class="legend"><img src="/static/img/缺陷点.png" />
                <div>缺陷点</div>
            </div>
            <div class="legend"><img src="/static/img/缺陷段.png" />
                <div>缺陷段</div>
            </div>
            <div class="legend"><img src="/static/img/水质测站.png" />
                <div>水质测站</div>
            </div>
            <div class="legend"><img src="/static/img/监控探头.png" />
                <div>监控探头</div>
            </div>
        </el-card>
        <el-card class="box-card" id="issueSearch" v-show="issueSearch" :style="issueSearchLeft">
            <div slot="header" class="clearfix">
                <span>地图查询结果</span>
            </div>
            <el-table :data="tableData" height="380" style="width: 100%" @row-click="viewissueFeature">
                <el-table-column prop="ISSUE_TYPE" label="缺陷名称"></el-table-column>
                <el-table-column prop="ROAD_NAME" label="所在道路"> </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" :pager-count="5" layout="prev, pager, next, jumper" :total="data.length">
            </el-pagination>
        </el-card>
        <el-dialog title="详细信息" :visible.sync="bigimg" width="800px">
            <img :src="bigimgsrc" width="760px" />
        </el-dialog>
        <el-dialog title="详细信息" :visible.sync="bigvideo" width="800px">
            <!-- <img :src="bigimgsrc" width="760px"/> -->
            <video width="760px" autoplay controls :src="bigvideosrc"></video>
        </el-dialog> 
    </div>
</template>

<script>
    import store from "@/store";
    import ol from 'openlayers'
    //import turf from 'turf'
    import 'openlayers/css/ol.css';
    const url = "http://localhost:3000/data/"
    const materialOptions = ['PVC管', '玻璃钢管', '塑料管', '砼', '钢管', '水泥管', '波纹管', '钢筋混凝土管', 'PP管'];
    const set_typeOptions = ['管埋'];
    const AuthorityOptions = ['扬州市给排水管理处'];
    const boolOptions = ['是', '否'];
    const bugTypeOptions = ['功能性缺陷', '结构性缺陷']; //缺陷类型
    const issueTypeOptions = ['破裂', '变形', '腐蚀', '脱节', '错口', '起伏', '接口材料脱落', '支管暗接', '异物穿入', '渗漏', '沉积', '结垢', '障碍物', '残墙坝根', '树根', '浮渣']; //问题类型
    const AccessoryOptions = ['雨水井', '污水井', '雨篦', '污篦', '溢流井', '闸门井', '窨井']; //附属物
    const featureOptions = ['预查', '普查', '详查', '污水检测']; //特征查询
    const ISSUE_TPOptions = ['问题点', '问题段'];
    const flowOptions = ['顺流', '逆流']; //特征查询
    const qxdjOptions =['一级', '二级', '三级', '四级'];//缺陷等级
    let map; //地图对象
    let roadLayer;
    let imageLayer;
    let overlay;
    let issueLayer; //问题点段图层
    let pipesLayer; //管段图层
    let pipesPointLayer; //管点图层
    let selectLayer; //选中要素图层
    var hcLayer; //缓冲结果图层
    var plotDraw, plotEdit, measureOverlay, measureSource, myMeasure, helpTooltipElement, sketch, helpTooltip, measureTooltipElement, measureTooltip, continuePolygonMsg = '点击继续画面',
        measureListener,
        continueLineMsg = '点击继续画线';
    export default {
        name: "HelloWorld",
        data() {
            return {
                qx: {},
                //ol:window.ol
                isMeasureing: false,
                //issueSearch: false,
                isEdit: false,
                test: 1,
                bigimg: false, //大图查看
                bigimgsrc: '',
                bigvideo: false, //大图查看
                bigvideosrc: '',
                materialOptions: materialOptions,
                set_typeOptions: set_typeOptions,
                AuthorityOptions: AuthorityOptions,
                boolOptions: boolOptions,
                bugTypeOptions: bugTypeOptions,
                issueTypeOptions: issueTypeOptions,
                AccessoryOptions: AccessoryOptions,
                featureOptions: featureOptions,
                ISSUE_TPOptions: ISSUE_TPOptions,
                flowOptions: flowOptions,
                qxdjOptions: qxdjOptions,
                isClick: false,
                drawpoly: {},
                tableData: [{
                    date: '运河东路',
                    PIPE_SEG_NUM: '26'
                }, {
                    date: '运河东路',
                    PIPE_SEG_NUM: '32'
                }],
                data: [{
                    date: '运河东路',
                    PIPE_SEG_NUM: '26'
                }, {
                    date: '运河东路',
                    PIPE_SEG_NUM: '32'
                }],
                currentPage: 1,
                selectFeature: {},
                detailType: 0, //0q缺陷  1管点  2管段
                quexianDetail_type: '',
                quexianDetail: {
                    ID: "",
                    ISSUE_TP: "", //类型
                    BUG_TYPE: "", //缺陷类型
                    HEIGHT: "", //高程
                    ISSUE_TYPE: "", //问题类型
                    PIPE_SEG_NUM: "", //管段编号
                    BUGLEVEL: "", //专业注记内容
                    BUG_DESCRIPTION: "", //缺陷描述
                    PHOTOES: [], //图片链接
                    VIDEOS: [],
                    ROAD_NAME: '',
                    videlUrl: "", //视频链接
                    MediaType: "1" //多媒体类型
                },
                guandianDetail: {
                    ROAD_NAME: '',
                    activeName: "first", //内外部检查类型
                    PID: "", //点号
                    FEATURE: "", //特征
                    GROUND_HEIGHT: "", //地面高程
                    ACCESSORY: "", //附属物
                    BRANCH_BURY_DEPTH: "", //支管埋深
                    BURY_DEPTH: "", //埋深
                    UPSTREAM_BURY_DEPTH: "", //上游埋深
                    WELL_DEPTH: "", //井深
                    DOWNSTREAM_BURY_DEPTH: "", //下游埋深
                    ANGLE: "", //角度
                    WELL_HEIGHT: "", //综合图点号X坐标
                    GENERAL_Y_COORD: "", //综合图点号X坐标
                    IS_WELLCOVER_BURIED: "", //井盖埋mo
                    IS_WELLCOVER_BROKEN: "", //井盖破损
                    COVER_FRAME_ISOLATED: "", //盖框间隙
                    COVER_FRAME_HEIGHT_H_DIS: "", //盖框高差
                    IS_WELLCOVER_LOST: "", //井盖丢失
                    IS_WELLFRAME_BROKEN: "", //井框破损
                    COVER_FRAME_EXTRUDE_CONCAVE: "", //盖框突出或凹陷
                    POPING_SOUND: "", //跳动和声响
                    GROUND_BROKEN: "", //周边路面破损或沉降
                    WELLCOVER_WRONG_ID: "", //井盖标识错误
                    IS_HEAVY_COVER: "", //是否为重型井盖
                    OUT_INSPECT_OTHER: "", //其它 //外部检查值
                    CHAIN_LOCKS: "", //链条或锁具
                    LADDER_BROKEN: "", //爬梯松动/锈蚀/缺损
                    WELL_WALL_MUD: "", //井壁泥垢
                    WELL_WALL_SPLIT: "", //井壁裂缝
                    WELL_WALL_LEAK: "", //井壁渗漏
                    SURF_DROP: "", //抹面脱落
                    PIPE_MOUTH_HOLE: "", //管口孔洞
                    LAUNDER_BROKEN: "", //流槽破损
                    WELL_BOTTOM_MUD: "", //井底积泥/杂物
                    WATERFLOW_BLOCK: "", //水流不畅
                    SCRUFF: "", //浮渣
                    IN_INSPECT_OTHER: "", //其他 //内部检查值
                },
                guanduanDetail: {
                    ROAD_NAME: '',
                    PIPES_SEG_GUID: '',
                    PIPE_SEG_NUM: "", //管段编号
                    BEGIN_P_NUM: "", //起点点号
                    END_P_NUM: "", //链接方向点号
                    MATERIAL: "", //管道材质
                    RADIUS: "", //管径
                    SET_TYPE: "", //埋设类型
                    SLOPE: "", //专业注记角度
                    AUTHORITY: "", //权属单位
                    FLOW_DIRECTION: "", //专业注记内容
                    CALC_LENGTH: "", //管段长度
                    CONSTRUCT_TIMES: "", //建设年代
                    COMMENTS: "", //备注
                    PHOTOES: [], //图片链接
                    VIDEOS: [], //视频链接
                    MediaType: "1" //多媒体类型
                }
            };
        },
        store,
        watch: {
            quexianDetail_type(newval, oldval) {
                if (oldval != "") {
                    if (newval == "结构性缺陷") {
                        this.issueTypeOptions = ['破裂', '变形', '腐蚀', '脱节', '错口', '起伏', '接口材料脱落', '支管暗接', '异物穿入', '渗漏'];
                        this.quexianDetail.ISSUE_TYPE = '破裂';
                    }
                    if (newval == "功能性缺陷") {
                        this.issueTypeOptions = ['沉积', '结垢', '障碍物', '残墙坝根', '树根', '浮渣'];
                        this.quexianDetail.ISSUE_TYPE = '沉积';
                    }
                }
            },
            $route(newval) {
                this.$store.commit('updateissueSearch', false);
            }
        },
        computed: {
            issueSearchLeft() {
                console.log(this.$store.state.mapissuesearchLeft);
                return this.$store.state.mapissuesearchLeft;
            },
            issueSearch() {
                console.log(this.$store.state.issueSearch);
                return this.$store.state.issueSearch;
            }
        },
        methods: {
            checkres(res) {
                if (res.code == 1010) {
                    this.$router.push("/Login");
                }
            },
            guanduanQX() {
                this.isEdit = !this.isEdit;
                if (!this.isEdit) {
                    this.getGuanduanByNum(this.guanduanDetail.PIPE_SEG_NUM, this.guanduanDetail.ROAD_NAME);
                }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                var page = parseInt(val);
                this.currentPage = page;
                var data = this.data;
                var index = 0;
                if (page == 1) {
                    this.tableData = data.slice(0, 10);
                } else {
                    page = (page - 1) * 10;
                    this.tableData = data.slice(page, page + 10);
                }
            },
            guandianQX() {
                this.isEdit = !this.isEdit;
                if (!this.isEdit) {
                    this.getPointByPipeNo(this.guandianDetail.PID, this.guandianDetail.ROAD_NAME);
                }
            },
            issueQX() {
                this.isEdit = !this.isEdit;
                if (!this.isEdit) {
                    this.getIssuePoint(this.quexianDetail.ID,this.quexianDetail.ROAD_NAME);
                }
            },
            oneChange(val) {
                if (val[0] == "结构性缺陷") {
                    this.issueTypeOptions = ['破裂', '变形', '腐蚀', '脱节', '错口', '起伏', '接口材料脱落', '支管暗接', '异物穿入', '渗漏'];
                }
                if (val[0] == "功能性缺陷") {
                    this.issueTypeOptions = ['沉积', '结垢', '障碍物', '残墙坝根', '树根', '浮渣'];
                }
            },
            lookBigimg(src) {
                this.bigimg = true;
                this.bigimgsrc = src;
            },
            lookBigvideo(src) {
                this.bigvideo = true;
                this.bigvideosrc = src;
            },
            refreshMap() {
                issueLayer.getSource().clear();
                pipesPointLayer.getSource().clear();
                pipesLayer.getSource().clear();
                this.getIssueData();
                this.getPipesData();
                this.getPipesPointData();
            },
            mapEditGuanduan() {
                this.$store.commit('updatemapEditGuanduanModel', this.guanduanDetail);
                this.$emit('mapEditGuanduan');
            },
            guanduanSave() {
                var that = this;
                for (var key in that.guanduanDetail) {
                    if (that.guanduanDetail[key] == null) {
                        that.guanduanDetail[key] = "";
                    }
                    console.log(that.guanduanDetail[key], key);
                }
                fetch(this.$store.state.url + 'editGuanduan', {
                    method: 'POST',
                    body: JSON.stringify({
                        "guanduanForm": that.guanduanDetail
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        that.isEdit = false;
                    }
                })
            },
            guandianSave() {
                var that = this;
                fetch(this.$store.state.url + 'pointSave', {
                    method: 'POST',
                    body: JSON.stringify({
                        "guandianForm": that.guandianDetail
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        that.isEdit = false;
                    }
                })
            },
            issueSave() {
                var that = this;
                that.quexianDetail.BUG_TYPE = that.quexianDetail_type;
                fetch(this.$store.state.url + 'issueSave', {
                    method: 'POST',
                    body: JSON.stringify({
                        "issuePointForm": that.quexianDetail
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        that.isEdit = false;
                    }
                })
            },
            mapChange(type) {
                if (type == 'road') {
                    roadLayer.setVisible(true);
                    imageLayer.setVisible(false);
                } else if (type == 'img') {
                    roadLayer.setVisible(false);
                    imageLayer.setVisible(true);
                }
            },
            viewHome() {
                map.getView().setCenter([119.49396619695601, 32.38828950870424]);
                map.getView().setZoom(16);
            },
            viewissueFeature(row, type) {
                var guid = row.ID;
                var _road = row.ROAD_NAME;
                selectLayer.getSource().clear();
                //console.log(guid);
                var source = issueLayer.getSource().getFeatures();
                var arry = [];
                for (var i = 0; i < source.length; i++) {
                    var id = source[i].get("ID");
                    var road = source[i].get("ROAD_NAME");
                    if (id == guid && road == _road) {
                        var feature = source[i].clone();
                        var _source = selectLayer.getSource();
                        _source.addFeature(feature);
                        map.getView().setCenter(feature.getGeometry().getCoordinates()[0]);
                        if (feature.getGeometry().getType() == "Point") {
                            map.getView().setCenter(feature.getGeometry().getCoordinates());
                        }
                        map.getView().setZoom(19);
                        return false;
                    }
                }
            },
            viewFeature(guid, type) { //type 1 附属物和特征查询的时候传递
                //管段定位
                selectLayer.getSource().clear();
                //console.log(guid);
                var source = pipesLayer.getSource().getFeatures();
                if (guid[0].id.length < 5) {
                    source = pipesPointLayer.getSource().getFeatures();
                }
                var arry = [];
                for (var i = 0; i < source.length; i++) {
                    var PIPE_SEG_NUM = source[i].get("PIPE_SEG_NUM");
                    var road = source[i].get("ROAD_NAME");
                    if (guid[0].id.length < 5) {
                        PIPE_SEG_NUM = source[i].get("PID");
                    }
                    for (var h = 0; h < guid.length; h++) {
                        if (PIPE_SEG_NUM == guid[h].id && road == guid[h].road) {
                            var feature = source[i].clone();
                            var _source = selectLayer.getSource();
                            _source.addFeature(feature);
                            map.getView().setCenter(feature.getGeometry().getCoordinates()[0]);
                            if (guid[0].id.length < 5) {
                                map.getView().setCenter(feature.getGeometry().getCoordinates());
                            }
                            map.getView().setZoom(19);
                        }
                    }
                }
                if (guid.length > 1) {
                    //this.viewHome();
                    map.getView().setZoom(16);
                }
            },
            exportMap() {
                map.once('postcompose', function(event) {
                    var canvas = event.context.canvas;
                    if (navigator.msSaveBlob) {
                        navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
                    } else {
                        canvas.toBlob(function(blob) {
                            saveAs(blob, 'map.png');
                        });
                    }
                });
                map.renderSync();
            },
            clearMap() {
                this.clearMeasureOverlay();
                //清除缓冲图层
                hcLayer.getSource().clear();
                overlay.setPosition(undefined);
                selectLayer.getSource().clear();
                this.$store.commit('updateissueSearch', false);
            },
            getIssueData() {
                fetch(this.$store.state.url + 'issue_point', {
                    credentials: 'include',
                }).then(res => {
                    return res.json();
                }).then(res => {
                    this.checkres(res);
                    console.log(res);
                    for (var i = 0; i < res.length; i++) {
                        var obj = res[i];
                        //通过终点坐标是否有值，判断是点还是面
                        if (obj.END_P_X_GCJ_COORD == null) {
                            //点
                            var x = obj.START_P_X_GCJ_COORD;
                            var y = obj.START_P_Y_GCJ_COORD;
                            var feature = new ol.Feature(new ol.geom.Point([x, y]));
                            feature.setProperties(obj);
                            var source = issueLayer.getSource();
                            source.addFeature(feature);
                        } else {
                            //面
                            var x1 = obj.START_P_X_GCJ_COORD;
                            var y1 = obj.START_P_Y_GCJ_COORD;
                            var x2 = obj.END_P_X_GCJ_COORD;
                            var y2 = obj.END_P_Y_GCJ_COORD;
                            var feature = new ol.Feature(new ol.geom.LineString([
                                [x1, y1],
                                [x2, y2]
                            ]));
                            feature.setProperties(obj);
                            var source = issueLayer.getSource();
                            source.addFeature(feature);
                        }
                    }
                })
            },
            getGuanduanByNum(PIPE_SEG_NUM, ROAD_NAME) {
                var that = this;
                fetch(that.$store.state.url + 'getGuanduanByNum', {
                    method: 'POST',
                    body: JSON.stringify({
                        "num": PIPE_SEG_NUM,
                        "ROAD_NAME": ROAD_NAME
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        that.isEdit = false;
                        that.guanduanDetail.ROAD_NAME = res[0].ROAD_NAME; //起点点号
                        that.guanduanDetail.PIPES_SEG_GUID = res[0].PIPES_SEG_GUID; //起点点号
                        that.guanduanDetail.PIPE_SEG_NUM = res[0].PIPE_SEG_NUM; //管段编号
                        that.guanduanDetail.BEGIN_P_NUM = res[0].BEGIN_P_NUM; //起点点号
                        that.guanduanDetail.END_P_NUM = res[0].END_P_NUM; //链接方向点号
                        that.guanduanDetail.MATERIAL = res[0].MATERIAL; //管道材质
                        that.guanduanDetail.RADIUS = res[0].RADIUS; //管径
                        that.guanduanDetail.SET_TYPE = res[0].SET_TYPE; //埋设类型
                        that.guanduanDetail.SLOPE = res[0].SLOPE; //专业注记角度
                        that.guanduanDetail.AUTHORITY = res[0].AUTHORITY; //权属单位
                        that.guanduanDetail.FLOW_DIRECTION = res[0].FLOW_DIRECTION; //专业注记内容
                        that.guanduanDetail.CALC_LENGTH = res[0].CALC_LENGTH; //管段长度
                        that.guanduanDetail.CONSTRUCT_TIMES = res[0].CONSTRUCT_TIMES; //建设年代
                        that.guanduanDetail.COMMENTS = res[0].COMMENTS; //备注
                        var img = res[0].PHOTOES; //备注
                        if (img != 'undefined' && img != 'null' && img != null) {
                            var imgArry = img.split(",");
                            that.guanduanDetail.PHOTOES = imgArry; //图片链接
                        }
                        var viedo = res[0].VIDEOS; //备注
                        if (viedo != 'undefined' && viedo != 'null' && viedo != null) {
                            var videoArry = viedo.split(",");
                            that.guanduanDetail.VIDEOS = videoArry; //视频链接
                        }
                        that.guanduanDetail.MediaType = "1"; //多媒体类型
                    }
                })
            },
            getPointByPipeNo(PID, ROAD_NAME) {
                var that = this;
                fetch(that.$store.state.url + 'getPointByPipeNo', {
                    method: 'POST',
                    body: JSON.stringify({
                        "BEGIN_P_NUM": PID,
                        "ROAD_NAME": ROAD_NAME
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        that.isEdit = false;
                        that.guandianDetail.ROAD_NAME = res[0].ROAD_NAME; //起点点号
                        that.guandianDetail.PID = res[0].PID; //点号
                        that.guandianDetail.FEATURE = res[0].FEATURE; //特征
                        that.guandianDetail.GROUND_HEIGHT = res[0].GROUND_HEIGHT; //地面高程
                        that.guandianDetail.ACCESSORY = res[0].ACCESSORY; //附属物
                        that.guandianDetail.BRANCH_BURY_DEPTH = res[0].BRANCH_BURY_DEPTH; //支管埋深
                        that.guandianDetail.BURY_DEPTH = res[0].BURY_DEPTH; //埋深
                        that.guandianDetail.UPSTREAM_BURY_DEPTH = res[0].UPSTREAM_BURY_DEPTH; //上游埋深
                        that.guandianDetail.WELL_DEPTH = res[0].WELL_DEPTH; //井深
                        that.guandianDetail.DOWNSTREAM_BURY_DEPTH = res[0].DOWNSTREAM_BURY_DEPTH; //下游埋深
                        that.guandianDetail.ANGLE = res[0].ANGLE; //角度
                        that.guandianDetail.WELL_HEIGHT = res[0].WELL_HEIGHT; //综合图点号X坐标
                        that.guandianDetail.GENERAL_Y_COORD = res[0].GENERAL_Y_COORD; //综合图点号X坐标
                        //外部检查值
                        that.guandianDetail.IS_WELLCOVER_BURIED = res[0].IS_WELLCOVER_BURIED; //井盖埋mo
                        that.guandianDetail.IS_WELLCOVER_BROKEN = res[0].IS_WELLCOVER_BROKEN; //井盖破损
                        that.guandianDetail.COVER_FRAME_ISOLATED = res[0].COVER_FRAME_ISOLATED; //盖框间隙
                        that.guandianDetail.COVER_FRAME_HEIGHT_H_DIS = res[0].COVER_FRAME_HEIGHT_H_DIS; //盖框高差
                        that.guandianDetail.IS_WELLCOVER_LOST = res[0].IS_WELLCOVER_LOST; //井盖丢失
                        that.guandianDetail.IS_WELLFRAME_BROKEN = res[0].IS_WELLFRAME_BROKEN; //井框破损
                        that.guandianDetail.COVER_FRAME_EXTRUDE_CONCAVE = res[0].COVER_FRAME_EXTRUDE_CONCAVE; //盖框突出或凹陷
                        that.guandianDetail.POPING_SOUND = res[0].POPING_SOUND; //跳动和声响
                        that.guandianDetail.GROUND_BROKEN = res[0].GROUND_BROKEN; //周边路面破损或沉���
                        that.guandianDetail.WELLCOVER_WRONG_ID = res[0].WELLCOVER_WRONG_ID; //井盖标识错误
                        that.guandianDetail.IS_HEAVY_COVER = res[0].IS_HEAVY_COVER; //是否为重型井盖
                        that.guandianDetail.OUT_INSPECT_OTHER = res[0].OUT_INSPECT_OTHER; //其它
                        //内部检查值
                        that.guandianDetail.CHAIN_LOCKS = res[0].CHAIN_LOCKS; //链条或锁具
                        that.guandianDetail.LADDER_BROKEN = res[0].LADDER_BROKEN; //爬梯松动/锈蚀/缺损
                        that.guandianDetail.WELL_WALL_MUD = res[0].WELL_WALL_MUD; //井壁泥垢
                        that.guandianDetail.WELL_WALL_SPLIT = res[0].WELL_WALL_SPLIT; //井壁裂缝
                        that.guandianDetail.WELL_WALL_LEAK = res[0].WELL_WALL_LEAK; //井壁渗漏
                        that.guandianDetail.SURF_DROP = res[0].SURF_DROP; //抹面脱落
                        that.guandianDetail.PIPE_MOUTH_HOLE = res[0].PIPE_MOUTH_HOLE; //管口孔洞
                        that.guandianDetail.LAUNDER_BROKEN = res[0].LAUNDER_BROKEN; //流槽破损
                        that.guandianDetail.WELL_BOTTOM_MUD = res[0].WELL_BOTTOM_MUD; //井底积泥/杂物
                        that.guandianDetail.WATERFLOW_BLOCK = res[0].WATERFLOW_BLOCK; //水流不畅
                        that.guandianDetail.SCRUFF = res[0].SCRUFF; //浮渣
                        that.guandianDetail.IN_INSPECT_OTHER = res[0].IN_INSPECT_OTHER; //其他
                        for (var key in that.guandianDetail) {
                            if (that.guandianDetail[key] == 'null') {
                                that.guandianDetail[key] = null;
                            }
                        }
                    }
                })
            },
            getPipesData() {
                fetch(this.$store.state.url + 'pipes_segInfo', {
                    credentials: 'include',
                }).then(res => {
                    return res.json();
                }).then(res => {
                    this.checkres(res);
                    console.log(res);
                    for (var i = 0; i < res.length; i++) {
                        var obj = res[i];
                        var x1 = obj.X_GCJ_COORD;
                        var y1 = obj.Y_GCJ_COORD;
                        var x2 = obj.END_X_GCJ_COORD;
                        var y2 = obj.END_Y_GCJ_COORD;
                        var feature = new ol.Feature(new ol.geom.LineString([
                            [x1, y1],
                            [x2, y2]
                        ]));
                        feature.setProperties(obj);
                        var source = pipesLayer.getSource();
                        source.addFeature(feature);
                    }
                })
            },
            getIssuePoint(ID,ROAD_NAME) {
                var that = this;
                fetch(that.$store.state.url + 'getIssuePoint', {
                    method: 'POST',
                    body: JSON.stringify({
                        "ID": ID,
                        "ROAD_NAME":ROAD_NAME
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        that.isEdit = false;
                        that.quexianDetail.ROAD_NAME = res[0].ROAD_NAME; //起点点号
                        that.quexianDetail.ID = res[0].ID; //类型
                        that.quexianDetail.ISSUE_TP = res[0].ISSUE_TP; //类型
                        that.quexianDetail.BUG_TYPE = res[0].BUG_TYPE; //缺陷类型
                        that.quexianDetail.HEIGHT = res[0].HEIGHT; //高程
                        that.quexianDetail.ISSUE_TYPE = res[0].ISSUE_TYPE; //问题类型
                        that.quexianDetail_type = res[0].BUG_TYPE;
                        that.quexianDetail.PIPE_SEG_NUM = res[0].PIPE_SEG_NUM; //管段编号
                        that.quexianDetail.BUGLEVEL = res[0].BUGLEVEL; //专业注记内容
                        that.quexianDetail.BUG_DESCRIPTION = res[0].BUG_DESCRIPTION; //缺陷描述
                        var img = res[0].ISSUE_PHOTO; //备注
                        if (img != 'undefined' && img != 'null' && img != null) {
                            var imgArry = img.split(",");
                            that.quexianDetail.PHOTOES = imgArry; //图片链接
                        }
                        var video = res[0].ISSUE_VIDEO; //备注
                        if (video != 'undefined' && video != 'null' && video != null) {
                            var videoArry = video.split(",");
                            that.quexianDetail.VIDEOS = videoArry; //视频链接
                        }
                        that.quexianDetail.MediaType = "1" //多媒体类型
                    }
                })
            },
            getPipesPointData() {
                fetch(this.$store.state.url + 'pipes_point', {
                    credentials: 'include',
                }).then(res => {
                    return res.json();
                }).then(res => {
                    this.checkres(res);
                    console.log(res);
                    for (var i = 0; i < res.length; i++) {
                        var obj = res[i];
                        //点
                        var x = obj.X_GCJ_COORD;
                        var y = obj.Y_GCJ_COORD;
                        var feature = new ol.Feature(new ol.geom.Point([x, y]));
                        feature.setProperties(obj);
                        var source = pipesPointLayer.getSource();
                        source.addFeature(feature);
                    }
                })
            },
            //缓冲分析
            huanchongFX() {
                var that = this;
                var distance = parseInt(this.$store.state.HCfenxi.distance);
                var type = that.selectFeature.getGeometry().getType();
                var feature = that.selectFeature;
                var coordinates;
                if (type == "Point") {
                    var coordinate = feature.getGeometry().getCoordinates();
                    var point = turf.point(coordinate);
                    var buffered = turf.buffer(point, distance / 1000, {
                        units: 'kilometers'
                    });
                    coordinates = buffered.geometry.coordinates;
                }
                if (type == "LineString") {
                    var coordinate = feature.getGeometry().getCoordinates();
                    var linestring = turf.lineString(coordinate, {
                        name: 'line'
                    });
                    var buffered = turf.buffer(linestring, distance / 1000, {
                        units: 'kilometers'
                    });
                    coordinates = buffered.geometry.coordinates;
                }
                hcLayer.getSource().clear();
                var polygon = new ol.geom.Polygon(coordinates);
                var feature = new ol.Feature(polygon);
                var source = hcLayer.getSource();
                source.addFeature(feature);
                that.$store.state.HCfenxi.select = false;
                //计算有哪些管段在缓冲区内
                //that.spatialAnalysis(coordinates,2);
                var poly = turf.polygon(coordinates);
                var source = pipesLayer.getSource().getFeatures();
                var arry = [];
                var router = this.$route.path;
                for (var i = 0; i < source.length; i++) {
                    var geometry = source[i].getGeometry().getCoordinates();
                    var line = turf.lineString(geometry);
                    var bool = turf.lineIntersect(line, poly);
                    var bool1 = turf.booleanContains(poly, line);
                    if (bool.features.length > 0 || bool1) {
                        arry.push(source[i]);
                    }
                }
                console.log(arry);
                var _arry = [];
                selectLayer.getSource().clear();
                for (var i = 0; i < arry.length; i++) {
                    var feature = arry[i].clone();
                    if (feature.getGeometry().getType() == "point") {} else {
                        var source = selectLayer.getSource();
                        source.addFeature(feature);
                        var obj = {};
                        obj.PIPE_SEG_NUM = feature.get("PIPE_SEG_NUM");
                        obj.RADIUS = feature.get("RADIUS");
                        obj.ROAD_NAME = feature.get("ROAD_NAME");
                        _arry.push(obj);
                    }
                }
                that.$store.state.HCfenxi.selectData = _arry;
            },
            //叠加分析
            diejiaFX() {
                var that = this;
                var distance = parseInt(this.$store.state.DJfenxi.distance);
                var coordinates = this.$store.state.DJfenxi.coordinates;
                hcLayer.getSource().clear();
                var polygon = new ol.geom.Polygon(coordinates);
                var feature = new ol.Feature(polygon);
                var source = hcLayer.getSource();
                source.addFeature(feature);
                var importCoordinates = that.$store.state.DJfenxi.importCoordinates;
                var feature = (new ol.format.GeoJSON()).readFeatures(importCoordinates);
                source.addFeature(feature[0]);
                //计算有哪些管段在缓冲区内
                //that.spatialAnalysis(coordinates,2);
                var poly = turf.polygon(coordinates);
                var source = pipesLayer.getSource().getFeatures();
                var arry = [];
                var router = this.$route.path;
                for (var i = 0; i < source.length; i++) {
                    var geometry = source[i].getGeometry().getCoordinates();
                    var line = turf.lineString(geometry);
                    var bool = turf.lineIntersect(line, poly);
                    var bool1 = turf.booleanContains(poly, line);
                    if (bool.features.length > 0 || bool1) {
                        arry.push(source[i]);
                    }
                }
                console.log(arry);
                var _arry = [];
                selectLayer.getSource().clear();
                for (var i = 0; i < arry.length; i++) {
                    var feature = arry[i].clone();
                    if (feature.getGeometry().getType() == "point") {} else {
                        var source = selectLayer.getSource();
                        source.addFeature(feature);
                        var obj = {};
                        obj.PIPE_SEG_NUM = feature.get("PIPE_SEG_NUM");
                        obj.RADIUS = feature.get("RADIUS");
                        obj.ROAD_NAME = feature.get("ROAD_NAME");
                        _arry.push(obj);
                    }
                }
                that.$store.state.DJfenxi.selectData = _arry;
            },
            //空间查询
            spatialAnalysis(_geometry) { //
                var type = _geometry.getType();
                var poly;
                if (type == "Polygon") {
                    var coordinates = _geometry.getCoordinates();
                    poly = turf.polygon(coordinates);
                } else if (type == "Circle") {
                    var center = _geometry.getCenter(); //119.4952874173304310   32.3878034475243870
                    var radius = _geometry.getRadius();
                    // var center = [119.4952874173304310, 32.3878034475243870];
                    // var radius = 50;
                    var options = {
                        steps: 64,
                        units: 'kilometers',
                        properties: {
                            foo: 'bar'
                        }
                    };
                    poly = turf.circle(center, radius * 100, options);
                }
                
                this.drawpoly = poly;
                var source = pipesLayer.getSource().getFeatures();
                var arry = [];
                var router = this.$route.path;
                var fhselect = this.$store.state.fhselect;
                if (router == "/FSsearch" || router == "/TZsearch") {
                    debugger;
                    source = pipesPointLayer.getSource().getFeatures();
                    for (var i = 0; i < source.length; i++) {
                        var geometry = source[i].getGeometry().getCoordinates();
                        var point = turf.point(geometry);
                        var bool = turf.booleanPointInPolygon(point, poly);
                        var bool1 = turf.booleanContains(poly, point);
                        if (router == "/FSsearch") {
                            var ACCESSORY = source[i].get("ACCESSORY");
                            var checkedAccessory = this.$store.state.FSsearch.checkedAccessory;
                            for (var k = 0; k < checkedAccessory.length; k++) {
                                if ((bool || bool1) && (checkedAccessory[k] == ACCESSORY)) {
                                    arry.push(source[i]);
                                }
                            }
                        }
                        if (router == "/TZsearch") {
                            var FEATURE = source[i].get("FEATURE");
                            var checkedFeature = this.$store.state.TZsearch.checkedFeature;
                            for (var k = 0; k < checkedFeature.length; k++) {
                                if ((bool || bool1) && (checkedFeature[k] == FEATURE)) {
                                    arry.push(source[i]);
                                }
                            }
                        }
                    }
                } else if (router == "/FHsearch") {
                    this.$emit('fhsearch');
                } else {
                    for (var i = 0; i < source.length; i++) {
                        var geometry = source[i].getGeometry().getCoordinates();
                        var line = turf.lineString(geometry);
                        if (router == "/FSsearch") {
                            line = turf.Point(geometry);
                        }
                        var bool = turf.lineIntersect(line, poly);
                        var bool1 = turf.booleanContains(poly, line);
                        if (router == "/GJsearch") {
                            var radius = parseFloat(source[i].get("RADIUS"));
                            var radiusStart = parseFloat(this.$store.state.GJsearch.radiusStart);
                            var radiusEnd = parseFloat(this.$store.state.GJsearch.radiusEnd);
                            if ((bool.features.length > 0 || bool1) && (radiusStart <= radius && radius <= radiusEnd)) {
                                arry.push(source[i]);
                            }
                        }
                        if (router == "/CZsearch") {
                            var MATERIAL = source[i].get("MATERIAL");
                            var checkedmaterial = this.$store.state.CZsearch.checkedmaterial;
                            for (var k = 0; k < checkedmaterial.length; k++) {
                                if ((bool.features.length > 0 || bool1) && (checkedmaterial[k] == MATERIAL)) {
                                    arry.push(source[i]);
                                }
                            }
                        }
                        if (router == "/QSsearch") {
                            var AUTHORITY = source[i].get("AUTHORITY");
                            var checkedAuthority = this.$store.state.QSsearch.checkedAuthority;
                            for (var k = 0; k < checkedAuthority.length; k++) {
                                if ((bool.features.length > 0 || bool1) && (checkedAuthority[k] == AUTHORITY)) {
                                    arry.push(source[i]);
                                }
                            }
                        }
                        if (router == "/HCfenxi") {
                            if (bool.features.length > 0 || bool1) {
                                arry.push(source[i]);
                            }
                        }
                    }
                }
                console.log(arry);
                selectLayer.getSource().clear();
                var arryrow = [];
                for (var i = 0; i < arry.length; i++) {
                    var feature = arry[i].clone();
                    if (feature.getGeometry().getType() == "point") {
                        arryrow.push(feature.getProperties());
                    } else {
                        var source = selectLayer.getSource();
                        source.addFeature(feature);
                        arryrow.push(feature.getProperties());
                    }
                }
                this.$store.commit('updateguid', arryrow);
                this.$emit('updateList');
            },
            restorevueObject(vueObject) {
                var result = null;
                var type = Object.prototype.toString.call(vueObject);
                switch (type) {
                    case '[object Array]':
                        var array = [];
                        for (var index in vueObject) {
                            var item = this.restorevueObject(vueObject[index]);
                            array.push(item);
                        }
                        result = array;
                        break;
                    case '[object Object]':
                        var obj = new Object();
                        for (var index in vueObject) {
                            var item = this.restorevueObject(vueObject[index]);
                            obj[index] = item;
                        }
                        result = obj;
                        break;
                    default:
                        result = vueObject;
                        break;
                }
                
                return result;
            },
            fhsearch() {
                var arry = this.$store.state.guid;
                var fhselect = this.$store.state.fhselect;
                var _arry = [];
                var source = selectLayer.getSource();
                for (var i = 0; i < arry.length; i++) {
                    //
                    if (fhselect == "0") { //管点
                        var point = turf.point([arry[i]["X_GCJ_COORD"], arry[i]["Y_GCJ_COORD"]]);
                        var bool = turf.booleanPointInPolygon(point, this.restorevueObject(this.drawpoly));
                        var bool1 = turf.booleanContains(this.restorevueObject(this.drawpoly), point);
                        if (bool || bool1) {
                            _arry.push(arry[i]);
                            var obj = arry[i];
                            //点
                            var x = obj.X_GCJ_COORD;
                            var y = obj.Y_GCJ_COORD;
                            var feature = new ol.Feature(new ol.geom.Point([x, y]));
                            feature.setProperties(obj);
                            source.addFeature(feature);
                        }
                    }
                    if (fhselect == "1") { //管duan
                        var line = turf.lineString([
                            [arry[i]["X_GCJ_COORD"], arry[i]["Y_GCJ_COORD"]],
                            [arry[i]["END_X_GCJ_COORD"], arry[i]["END_Y_GCJ_COORD"]]
                        ]);
                        var bool = turf.lineIntersect(line, this.restorevueObject(this.drawpoly));
                        var bool1 = turf.booleanContains(this.restorevueObject(this.drawpoly), line);
                        if (bool.features.length > 0 || bool1) {
                            _arry.push(arry[i]);
                            var obj = arry[i];
                            var x1 = obj.X_GCJ_COORD;
                            var y1 = obj.Y_GCJ_COORD;
                            var x2 = obj.END_X_GCJ_COORD;
                            var y2 = obj.END_Y_GCJ_COORD;
                            var feature = new ol.Feature(new ol.geom.LineString([
                                [x1, y1],
                                [x2, y2]
                            ]));
                            feature.setProperties(obj);
                            source.addFeature(feature);
                        }
                    }
                    if (fhselect == "2") { //wentidian
                        if (arry[i]["END_P_X_GCJ_COORD"]) {
                            var line = turf.lineString([
                                [arry[i]["START_P_X_GCJ_COORD"], arry[i]["START_P_Y_GCJ_COORD"]],
                                [arry[i]["END_P_X_GCJ_COORD"], arry[i]["END_P_Y_GCJ_COORD"]]
                            ]);
                            var bool = turf.lineIntersect(line, this.restorevueObject(this.drawpoly));
                            var bool1 = turf.booleanContains(this.restorevueObject(this.drawpoly), line);
                            if (bool.features.length > 0 || bool1) {
                                _arry.push(arry[i]);
                                var x1 = arry[i].START_P_X_GCJ_COORD;
                                var y1 = arry[i].START_P_Y_GCJ_COORD;
                                var x2 = arry[i].END_P_X_GCJ_COORD;
                                var y2 = arry[i].END_P_Y_GCJ_COORD;
                                var feature = new ol.Feature(new ol.geom.LineString([
                                    [x1, y1],
                                    [x2, y2]
                                ]));
                                feature.setProperties(arry[i]);
                                source.addFeature(feature);
                            }
                        } else {
                            var point = turf.point([arry[i]["START_P_X_GCJ_COORD"], arry[i]["START_P_Y_GCJ_COORD"]]);
                            var bool = turf.booleanPointInPolygon(point, this.drawpoly);
                            var bool1 = turf.booleanContains(this.drawpoly, point);
                            if (bool || bool1) {
                                _arry.push(arry[i]);
                                var x = arry[i].START_P_X_GCJ_COORD;
                                var y = arry[i].START_P_Y_GCJ_COORD;
                                var feature = new ol.Feature(new ol.geom.Point([x, y]));
                                feature.setProperties(arry[i]);
                                source.addFeature(feature);
                            }
                        }
                    }
                }
                this.$store.commit('updateguid', _arry);
                this.$emit('updateList');
            },
            //空间查询
            mapSpatialAnalysis(_geometry) { //
                var type = _geometry.getType();
                var poly;
                if (type == "Polygon") {
                    var coordinates = _geometry.getCoordinates();
                    poly = turf.polygon(coordinates);
                } else if (type == "Circle") {
                    var center = _geometry.getCenter(); //119.4952874173304310   32.3878034475243870
                    var radius = _geometry.getRadius();
                    // var center = [119.4952874173304310, 32.3878034475243870];
                    // var radius = 50;
                    var options = {
                        steps: 64,
                        units: 'kilometers',
                        properties: {
                            foo: 'bar'
                        }
                    };
                    poly = turf.circle(center, radius * 100, options);
                }
                var source = issueLayer.getSource().getFeatures();
                var arry = [];
                for (var i = 0; i < source.length; i++) {
                    var geometry = source[i].getGeometry().getCoordinates();
                    var bool, bool1;
                    if (source[i].getGeometry().getType() == "Point") {
                        var geometry = source[i].getGeometry().getCoordinates();
                        var point = turf.point(geometry);
                        bool = turf.booleanPointInPolygon(point, poly);
                        bool1 = turf.booleanContains(poly, point);
                        if (bool || bool1) {
                            arry.push(source[i]);
                        }
                    } else if (source[i].getGeometry().getType() == "LineString") {
                        var line = turf.lineString(geometry);
                        bool = turf.lineIntersect(line, poly);
                        bool1 = turf.booleanContains(poly, line);
                        if (bool.features.length > 0 || bool1) {
                            arry.push(source[i]);
                        }
                    }
                }
                console.log(arry);
                selectLayer.getSource().clear();
                var arryrow = [];
                for (var i = 0; i < arry.length; i++) {
                    var feature = arry[i].clone();
                    var source = selectLayer.getSource();
                    source.addFeature(feature);
                    arryrow.push(feature.getProperties());
                }
                this.data = arryrow;
                this.handleCurrentChange(1);
            },
            // 指定测量类型，开始测量。
            measureActivate: function(type, isSpatialAnalysis, isMapSpatialAnalysis) {
                var that = this;
                ol.Observable.unByKey(measureListener);
                map.removeInteraction(myMeasure);
                this.isMeasureing = true;
                var geometryFunction;
                //矩形
                if (type == "Box") {
                    type = "Circle";
                    geometryFunction = ol.interaction.Draw.createBox();
                } else {
                    geometryFunction = undefined;
                }
                var drawStyle = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#000000',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                });
                if (measureOverlay) {
                    measureSource = measureOverlay.getSource();
                    that.clearMeasureOverlay();
                } else {
                    measureSource = new ol.source.Vector();
                    measureOverlay = new ol.layer.Vector({
                        source: measureSource,
                        style: drawStyle
                    });
                    measureOverlay.setZIndex(1);
                    map.addLayer(measureOverlay);
                }
                myMeasure = new ol.interaction.Draw({
                    source: measureSource,
                    type: type,
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.5)',
                            lineDash: [10, 10],
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 5,
                            stroke: new ol.style.Stroke({
                                color: 'rgba(0, 0, 0, 0.7)'
                            }),
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.2)'
                            })
                        })
                    }),
                    geometryFunction: geometryFunction
                });
                if (!isSpatialAnalysis) {
                    that.createMeasureHelpTooltip();
                    that.createMeasureTooltip();
                }
                map.addInteraction(myMeasure);
                myMeasure.on('drawstart', function(evt) {
                    // set sketch
                    sketch = evt.feature;
                    if (!isSpatialAnalysis) { //空间分析则不计算
                        /** @type {ol.Coordinate|undefined} */
                        var tooltipCoord = evt.coordinate;
                        measureListener = sketch.getGeometry().on('change', function(evt) {
                            var geom = evt.target;
                            var output;
                            if (geom instanceof ol.geom.Polygon) {
                                output = that.formatArea(geom);
                                tooltipCoord = geom.getInteriorPoint().getCoordinates();
                            } else if (geom instanceof ol.geom.LineString) {
                                output = that.formatLength(geom);
                                tooltipCoord = geom.getLastCoordinate();
                            } else if (geom instanceof ol.geom.Box) {
                                output = that.formatArea(geom);
                                tooltipCoord = geom.getInteriorPoint().getCoordinates();
                            }
                            measureTooltipElement.innerHTML = output;
                            measureTooltip.setPosition(tooltipCoord);
                        });
                    }
                }, this);
                myMeasure.on('drawend', function(evt) {
                    if (!isSpatialAnalysis) { //空间分析则不计算
                        measureTooltipElement.className = 'tooltip tooltip-static';
                        //helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                        measureTooltip.setOffset([0, -7]);
                        // unset sketch
                        sketch = null;
                        // unset tooltip so that a new one can be created
                        measureTooltipElement = null;
                        //helpTooltipElement = null;
                        that.createMeasureTooltip();
                    }
                    //ol.Observable.unByKey(listener);
                    //map.removeInteraction(myMeasure);
                    that.measureRemove();
                    if (isSpatialAnalysis) {
                        setTimeout(function() {
                            if (isMapSpatialAnalysis) {
                                that.mapSpatialAnalysis(evt.feature.getGeometry());
                                that.$store.commit('updateissueSearch', true);
                            } else {
                                that.spatialAnalysis(evt.feature.getGeometry());
                            }
                        });
                    }
                }, this);
            },
            //移除测量
            measureRemove: function() {
                var that = this;
                ol.Observable.unByKey(measureListener);
                map.removeInteraction(myMeasure);
                setTimeout(function() {
                    that.isMeasureing = false;
                }, 100);
            },
            /**
             * Handle pointer move.
             * @param {ol.MapBrowserEvent} evt The event.
             */
            pointerMoveHandler: function(evt) {
                if (evt.dragging) {
                    return false;
                }
                if (!this.isMeasureing) {
                    return false;
                }
                /** @type {string} */
                var helpMsg = '点击开始绘制';
                if (sketch) {
                    var geom = (sketch.getGeometry());
                    if (geom instanceof ol.geom.Polygon) {
                        helpMsg = continuePolygonMsg;
                    } else if (geom instanceof ol.geom.LineString) {
                        helpMsg = continueLineMsg;
                    }
                }
                try {
                    helpTooltipElement.innerHTML = helpMsg;
                } catch (e) {
                    console.log(e);
                }
                helpTooltip.setPosition(evt.coordinate);
                helpTooltipElement.classList.remove('hidden');
            },
            /**
             * Format length output.
             * @param {ol.geom.LineString} line The line.
             * @return {string} The formatted length.
             */
            formatLength: function(line) {
                var length = line.getLength();
                length = length * 100000;
                var output;
                if (length > 1000) {
                    output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
                } else {
                    output = (Math.round(length * 100) / 100) + ' ' + 'm';
                }
                return output;
            },
            /**
             * Format area output.
             * @param {ol.geom.Polygon} polygon The polygon.
             * @return {string} Formatted area.
             */
            formatArea: function(polygon) {
                var area = polygon.getArea();
                area = area * 1000000;
                var output;
                console.log(area);
                if (area > 10000) {
                    output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
                } else {
                    output = (Math.round(area * 100)) * 1000 + ' ' + 'm<sup>2</sup>';
                }
                return output;
            },
            // 测量结束后
            onMeasureEnd: function(event) {
                setTimeout(function() {
                    map.removeInteraction(myMeasure);
                }, 300);
                //var source = drawOverlay.getSource();
                //source.addFeature(event.feature);
            },
            /**
             * Creates a new help tooltip
             */
            createMeasureHelpTooltip: function() {
                if (helpTooltipElement) {
                    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                }
                helpTooltipElement = document.createElement('div');
                helpTooltipElement.className = 'tooltip hidden';
                helpTooltip = new ol.Overlay({
                    element: helpTooltipElement,
                    offset: [15, 0],
                    positioning: 'center-left'
                });
                map.addOverlay(helpTooltip);
            },
            /**
             * Creates a new measure tooltip
             */
            createMeasureTooltip: function() {
                if (measureTooltipElement) {
                    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
                }
                measureTooltipElement = document.createElement('div');
                measureTooltipElement.className = 'tooltip tooltip-measure';
                measureTooltip = new ol.Overlay({
                    element: measureTooltipElement,
                    offset: [0, -15],
                    positioning: 'bottom-center'
                });
                map.addOverlay(measureTooltip);
            },
            //清理测量图层
            clearMeasureOverlay: function() {
                if (measureOverlay) {
                    measureOverlay.getSource().clear();
                    //helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                    var arry = document.getElementsByClassName('tooltip tooltip-static');
                    for (var i = 0; i < arry.length; i++) {
                        arry[i].parentNode.removeChild(arry[i]);
                        i = i - 1;
                    }
                }
            }
        },
        created: function() {
            var that = this;
            // 初始化显示视图
            this.$nextTick(function() {
                var projectionExtent = null;
                var resolutions;
                var projection = ol.proj.get("EPSG:3857");
                var projectionExtent = [-180, -90, 180, 90];
                var maxResolution = (ol.extent.getWidth(projectionExtent) / (256 * 2));
                var resolutions = new Array(22);
                var z;
                for (z = 0; z < 22; ++z) {
                    resolutions[z] = maxResolution / Math.pow(2, z);
                }
                // 初始化显示视图
                var view = new ol.View({
                    center: [119.49396619695601, 32.38828950870424],
                    projection: ol.proj.get('EPSG:4326'),
                    zoom: 16,
                    minZoom: 12
                });
                //创建图层
                // imageLayer = new ol.layer.Tile({
                //     source: new ol.source.XYZ({
                //         minZoom: 12,
                //         maxZoom: 18,
                //         projection: ol.proj.get('EPSG:4326'),
                //         url: 'http://t3.tianditu.com/DataServer?T=img_c&x={x}&y={y}&l={z}'
                //     })
                // });
                // imageLayer.setVisible(false);
                imageLayer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        minZoom: 12,
                        maxZoom: 18,
                        //projection: ol.proj.get('EPSG:4326'),
                        url: 'http://www.google.cn/maps/vt?lyrs=s@802&gl=cn&x={x}&y={y}&z={z}'
                    })
                });
                imageLayer.setVisible(false);
                // roadLayer = new ol.layer.Tile({
                //     source: new ol.source.XYZ({
                //         minZoom: 12,
                //         maxZoom: 18,
                //         projection: ol.proj.get('EPSG:4326'),
                //         url: 'http://t3.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}'
                //     })
                // });
                //http://www.google.cn/maps/vt?lyrs=s@802&gl=cn&x=48&y=28&z=6
                roadLayer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        minZoom: 12,
                        maxZoom: 18,
                        //projection: ol.proj.get('EPSG:4326'),
                        url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0',
                        //url: this.$store.state.url + 'roadlayer?'+'z={z}&x={x}&y={y}'   
                    })
                });
                // let labelLayer = new ol.layer.Tile({
                //     source: new ol.source.XYZ({
                //         minZoom: 12,
                //         maxZoom: 18,
                //         projection: ol.proj.get('EPSG:4326'),
                //         url: 'http://t3.tianditu.com/DataServer?T=cva_c&x={x}&y={y}&l={z}'
                //     })
                // });
                //信息框
                overlay = new ol.Overlay(({
                    element: document.getElementById('popup'),
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                }));
                //比例尺
                var scaleLineControl = new ol.control.ScaleLine();
                scaleLineControl.setUnits("metric");
                //鹰眼图
                var overviewMapControl = new ol.control.OverviewMap({
                    layer: [],
                    view: new ol.View({
                        center: [119.41795349121094, 32.38941192626953],
                        projection: ol.proj.get('EPSG:4326'),
                        zoom: 11,
                        maxZoom: 12,
                        minZoom: 6
                    }),
                    collapseLabel: "\u00BB", //鹰眼展开时功能按钮上的标识
                    label: "\u00AB", //鹰眼折叠时功能按钮上的标识
                    collapsed: false //初始为展开显示方式
                });
                map = new ol.Map({
                    controls: ol.control.defaults({
                        attributionOptions: {
                            collapsible: false
                        }
                    }).extend([
                        scaleLineControl, overviewMapControl
                    ]),
                    interactions: ol.interaction.defaults({
                        doubleClickZoom: false
                    }),
                    layers: [imageLayer, roadLayer], // [imageLayer, roadLayer, labelLayer],
                    overlays: [overlay],
                    loadTilesWhileAnimating: true,
                    target: document.getElementById('map'),
                    view: view
                });
                //管段图层
                pipesLayer = new ol.layer.Vector({
                    title: "管段图层",
                    name: "pipesLayer",
                    source: new ol.source.Vector({}),
                    maxResolution: resolutions[14],
                    style: function() {
                        return new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: '#d600b0',
                                width: 2
                            })
                        })
                    }
                });
                pipesLayer.setZIndex(2);
                map.addLayer(pipesLayer);
                //管点图层
                pipesPointLayer = new ol.layer.Vector({
                    title: "管点图层",
                    name: "pipesPointLayer",
                    source: new ol.source.Vector({}),
                    maxResolution: resolutions[14],
                    style: function() {
                        return new ol.style.Style({
                            image: new ol.style.Icon(({
                                anchor: [0.5, 0.5],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'fraction',
                                src: '/static/img/管点.png'
                            })),
                        })
                    }
                });
                pipesPointLayer.setZIndex(2);
                map.addLayer(pipesPointLayer);
                //问题点图层
                issueLayer = new ol.layer.Vector({
                    title: "问题点图层",
                    name: "issueLayer",
                    source: new ol.source.Vector({}),
                    maxResolution: resolutions[14],
                    style: function() {
                        return new ol.style.Style({
                            image: new ol.style.Icon(({
                                anchor: [0.5, 0.5],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'fraction',
                                src: '/static/img/缺陷点.png'
                            })),
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.6)'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#9002ed',
                                width: 4
                            })
                        })
                    }
                });
                issueLayer.setZIndex(2);
                map.addLayer(issueLayer);
                //问题点图层
                selectLayer = new ol.layer.Vector({
                    title: "问题点图层",
                    name: "selectLayer",
                    source: new ol.source.Vector({}),
                    maxResolution: resolutions[14],
                    style: function(feature) {
                        return new ol.style.Style({
                            image: new ol.style.Icon(({
                                anchor: [0.5, 0.5],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'fraction',
                                src: '/static/img/管点_s.png'
                            })),
                            fill: new ol.style.Fill({
                                color: '#00eeff6b'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#0500d7',
                                width: 4
                            })
                        })
                    }
                });
                selectLayer.setZIndex(2);
                map.addLayer(selectLayer);
                //缓冲结果
                hcLayer = new ol.layer.Vector({
                    title: "缓冲结果图层",
                    name: "hcLayer",
                    source: new ol.source.Vector({}),
                    maxResolution: resolutions[14],
                    style: function() {
                        return new ol.style.Style({
                            image: new ol.style.Icon(({
                                anchor: [0.5, 0.5],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'fraction',
                                src: '/static/img/缺陷点.png'
                            })),
                            fill: new ol.style.Fill({
                                color: '#1a9aff10'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#00eeff',
                                width: 2
                            })
                        })
                    }
                });
                map.addLayer(hcLayer);
                // var fullScreen=new ol.control.FullScreen();//openlayer 3 仅支持IE最新版本（IE 11+）
                // map.addControl(fullScreen);
                map.on("click", function(evt) {
                    //console.log(evt);
                    that.isClick = true;
                    var feature = map.forEachFeatureAtPixel(evt.pixel,
                        function(feature) {
                            return feature;
                        });
                    var style = new ol.style.Style({
                        image: new ol.style.Icon(({
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: '/static/img/缺陷点.png'
                        })),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.6)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#00f3ff',
                            width: 7
                        })
                    });
                    if (feature && that.$store.state.HCfenxi.select) {
                        that.selectFeature = feature.clone();
                        var cfeature = feature.clone();
                        cfeature.setStyle(style);
                        hcLayer.getSource().clear();
                        hcLayer.getSource().addFeature(cfeature);
                    }
                    if (feature && !that.isDrawing && !that.isMeasureing && !that.$store.state.HCfenxi.select) {
                        that.isSelectedFeature = true;
                        var cfeature = feature.clone();
                        cfeature.setStyle(style);
                        // selectedVectorLayer.getSource().clear();
                        // selectedVectorLayer.getSource().addFeature(cfeature);
                        function getLayer(feature, map) {
                            var layers = map.getLayers().getArray();
                            for (var i = 0; i < layers.length; i++) {
                                var source = layers[i].getSource();
                                if (source instanceof ol.source.Vector) {
                                    var features = source.getFeatures();
                                    if (features.length > 0) {
                                        for (var j = 0; j < features.length; j++) {
                                            if (features[j] === feature) {
                                                return layers[i];
                                            }
                                        }
                                    }
                                }
                            }
                            return null;
                        }
                        var _layer = getLayer(feature, map);
                        var layerName = _layer.getProperties().name;
                        if (true) {
                            if (layerName == "issueLayer") { //问题点图层
                                that.detailType = 0;
                                that.getIssuePoint(feature.get('ID'),feature.get('ROAD_NAME'));
                                //header.innerText("缺陷信息");
                                if (feature.getGeometry().getType() == "LineString") {
                                    overlay.setPosition(evt.coordinate);
                                } else {
                                    overlay.setPosition(feature.getGeometry().getCoordinates());
                                }
                            }
                            if (layerName == "pipesPointLayer") { //管点图层
                                that.detailType = 1;
                                that.getPointByPipeNo(feature.get('PID'), feature.get("ROAD_NAME"));
                                overlay.setPosition(feature.getGeometry().getCoordinates());
                            }
                            if (layerName == "pipesLayer") { //管线图层
                                that.detailType = 2;
                                that.getGuanduanByNum(feature.get('PIPE_SEG_NUM'), feature.get('ROAD_NAME'));
                                overlay.setPosition(evt.coordinate);
                            }
                            document.getElementById("popup-closer").addEventListener("click", function() {
                                overlay.setPosition(undefined);
                            });
                        }
                    } else {
                        overlay.setPosition(undefined);
                        selectLayer.getSource().clear();
                        that.isClick = false;
                    }
                })
                map.on("pointermove", function(evt) {
                    //console.log(evt);
                    var feature = map.forEachFeatureAtPixel(evt.pixel,
                        function(feature) {
                            return feature;
                        });
                    var style = new ol.style.Style({
                        image: new ol.style.Icon(({
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: '/static/img/缺陷点.png'
                        })),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.6)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#00f3ff',
                            width: 7
                        })
                    });
                    if (!that.isClick) {
                        if (feature && !that.isDrawing && !that.isMeasureing && !that.$store.state.HCfenxi.select) {
                            that.isSelectedFeature = true;
                            var cfeature = feature.clone();
                            cfeature.setStyle(style);
                            // selectedVectorLayer.getSource().clear();
                            // selectedVectorLayer.getSource().addFeature(cfeature);
                            function getLayer(feature, map) {
                                var layers = map.getLayers().getArray();
                                for (var i = 0; i < layers.length; i++) {
                                    var source = layers[i].getSource();
                                    if (source instanceof ol.source.Vector) {
                                        var features = source.getFeatures();
                                        if (features.length > 0) {
                                            for (var j = 0; j < features.length; j++) {
                                                if (features[j] === feature) {
                                                    return layers[i];
                                                }
                                            }
                                        }
                                    }
                                }
                                return null;
                            }
                            var _layer = getLayer(feature, map);
                            var layerName = _layer.getProperties().name;
                            if (true) {
                                if (layerName == "issueLayer") { //问题点图层
                                    that.detailType = 0;
                                    that.getIssuePoint(feature.get('ID'),feature.get('ROAD_NAME'));
                                    //header.innerText("缺陷信息");
                                    if (feature.getGeometry().getType() == "LineString") {
                                        overlay.setPosition(evt.coordinate);
                                    } else {
                                        overlay.setPosition(feature.getGeometry().getCoordinates());
                                    }
                                }
                                if (layerName == "pipesPointLayer") { //管点图层
                                    that.detailType = 1;
                                    that.getPointByPipeNo(feature.get('PID'), feature.get("ROAD_NAME"));
                                    overlay.setPosition(feature.getGeometry().getCoordinates());
                                }
                                if (layerName == "pipesLayer") { //管线图层
                                    that.detailType = 2;
                                    that.getGuanduanByNum(feature.get('PIPE_SEG_NUM'), feature.get('ROAD_NAME'));
                                    overlay.setPosition(evt.coordinate);
                                }
                                document.getElementById("popup-closer").addEventListener("click", function() {
                                    overlay.setPosition(undefined);
                                });
                            }
                        } else {
                            overlay.setPosition(undefined);
                            //selectLayer.getSource().clear();
                        }
                    }
                })
                this.getIssueData();
                this.getPipesData();
                this.getPipesPointData();
                setTimeout(function() {
                    var arry = that.$store.state.qx;
                    var path = that.$route.path;
                    var obj = {};
                    for (var key in arry) {
                        if (key == path) {
                            var arry1 = arry[key];
                            for (var key1 in arry1) {
                                obj[arry1[key1].MENU_NAME] = arry1[key1].TYPE_S;
                            }
                        }
                    }
                    that.qx = obj;
                }, 300);
            })
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .ol-popup {
        position: absolute;
        background-color: white;
        -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
        filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        min-width: 380px;
        max-height: 550px;
        padding: 5px 5px 3px 10px !important;
    }
    .ol-popup:after,
    .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    .ol-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
    }
    .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
    }
    .ol-popup-closer {
        text-decoration: none;
        float: right;
        top: 2px;
        right: 8px;
    }
    #popup-header {
        height: 20px;
    }
    #popup-content {
        max-height: 500px;
    }
    .ol-popup-closer:hover {
        cursor: pointer;
        color: #0078d7;
    }
    .ol-popup-closer:after {
        content: "✖";
    }
    .ol-overviewmap {
        right: 0.5em;
        bottom: 0.5em;
        left: unset !important;
    }
    .popupDetailTable {
        width: 100%;
    }
    .popupDetailTable td {
        font-size: 14px;
        color: #606266;
    }
    /* 测量 */
    .tooltip {
        position: relative;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        color: white;
        padding: 4px 8px;
        opacity: 0.7;
        white-space: nowrap;
    }
    .tooltip-measure {
        opacity: 1;
        font-weight: bold;
    }
    .tooltip-static {
        background-color: #ffcc33;
        color: black;
        border: 1px solid white;
    }
    .tooltip-measure:before,
    .tooltip-static:before {
        border-top: 6px solid rgba(0, 0, 0, 0.5);
        border-right: 6px solid transparent;
        border-left: 6px solid transparent;
        content: "";
        position: absolute;
        bottom: -6px;
        margin-left: -7px;
        left: 50%;
    }
    .tooltip-static:before {
        border-top-color: #ffcc33;
    }
    /* 测量end */
    .el-popover {
        min-width: 100px !important;
        padding: 0px !important;
    }
    .el-card__body {
        padding: 7px !important;
    }
    .ol-zoom-out {
        border-radius: 0 0 2px 2px !important;
        background-color: white !important;
        color: #787a7d !important;
    }
    .ol-zoom-in {
        border-radius: 2px 2px 0 0 !important;
        background-color: white !important;
        color: #787a7d !important;
    }
    .ol-zoom-out:hover {
        color: #186dee !important;
        cursor: pointer !important;
    }
    .ol-zoom-in:hover {
        color: #186dee !important;
        cursor: pointer !important;
    }
    .ol-zoom {
        display: none !important;
        top: 205px !important;
        left: unset !important;
        right: 0.5rem !important;
        padding: 0px !important;
        background-color: white !important;
        border-radius: 0px !important;
    }
    .el-tabs__item {
        padding: 0 10px !important;
    }
    .item:hover {
        cursor: pointer;
        background-color: rgb(235, 235, 235);
        color: rgb(0, 162, 255);
    }
    #outtable {
        width: 100%;
        font-size: 14px;
        color: #606266;
    }
    #outtable .thone {
        width: 40%;
        box-sizing: content-box;
        padding-right: 15px;
        text-align: right;
    }
    #outtable .thtwo {
        width: 10%;
        text-align: center;
    }
    #outtable .tdone {
        width: 40%;
        text-align: right;
        border-right: 1px solid #e7e7e7;
        box-sizing: content-box;
        padding-right: 5px;
    }
    #outtable .tdtwo {
        width: 10%;
        text-align: left;
        box-sizing: content-box;
        padding-left: 10px;
    }
    .ol-overviewmap .ol-overviewmap-map {
        width: 250px !important;
    }
    #map .popupDetailTable input {
        border-radius: 3px;
        border: 1px solid #cccccc;
        box-sizing: border-box;
        padding: 1px 3px;
    }
    #map .popupDetailTable select {
        border: 1px solid #cccccc;
        border-radius: 3px;
    }
</style>

<style lang="scss">
    #map {
        width: 100%;
        height: 100%;
        #mapChange {
            position: absolute;
            right: 0.5rem;
            top: 65px;
            z-index: 999;
        }
        #toolBar {
            position: absolute;
            top: 110px;
            z-index: 999;
            right: 5px;
            width: 40px;
            button {
                margin-left: 10px;
                margin-top: 5px;
                border-radius: 0px;
                padding: 6px;
            }
        }
        #legend {
            position: absolute;
            width: 140px;
            right: 8px;
            bottom: 177px;
            z-index: 999;
            top: unset;
            left: unset;
            background-color: #ffffff59;
            .legend {
                img {
                    height: 20px;
                    width: 20px;
                    float: left;
                }
                div {
                    font-size: 15px;
                    float: right;
                    width: 90px;
                    margin-left: 10px;
                }
            }
        }
        #issueSearch {
            position: absolute;
            height: 500px; //left: 415px;
            bottom: 5px;
            z-index: 999;
            width: 400px;
            th {
                text-align: center;
            }
            td {
                text-align: center;
            }
        }
    }
</style>




// WEBPACK FOOTER //
// src/components/HelloWorld.vue