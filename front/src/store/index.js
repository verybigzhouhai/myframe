import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    isCollapse: false,
    qx: {},
    url: "http://localhost:3001/",
    filePath: "http://localhost:3001/",
    username: '',
    guid: [], //定位的唯一标识，id等
    GJsearch: {
        radiusStart: 0,
        radiusEnd: 4000
    },
    mapissuesearchLeft: 'left:415px',
    issueSearch: false,
    CZsearch: {
        checkedmaterial: ['PVC管', '玻璃钢管', '塑料管', '砼', '钢管', '水泥管', '波纹管', '钢筋混凝土管', 'PP管'],
    },
    QSsearch: {
        checkedAuthority: ['扬州市给排水管理处'],
    },
    FSsearch: {
        checkedAccessory: ['雨水井', '污水井', '雨篦', '污篦', '溢流井', '闸门井', '窨井']
    },
    TZsearch: {
        checkedFeature: ['预查', '普查', '详查', '污水检测']
    },
    HCfenxi: {
        distance: "",
        select: false,
        selectData: []
    },
    DJfenxi: {
        coordinates: [],
        distance: "",
        select: false,
        importCoordinates: {},
        selectData: []
    },
    mapEditGuanduanModel: { //地图编辑管段

    },
    fhselect: "0"
}

export default new Vuex.Store({
    state,
    mutations: {
        updateqx(state, message) {
            state.qx = message
        },
        updatemapissuesearchLeft(state, message) {
            state.mapissuesearchLeft = message
        },
        updateissueSearch(state, message) {
            state.issueSearch = message
        },
        updateGJsearchradiusStart(state, message) {
            state.GJsearch.radiusStart = message
        },
        updateGJsearchradiusEnd(state, message) {
            state.GJsearch.radiusEnd = message
        },
        updateguid(state, message) {
            state.guid = message
        },
        updateHCfenxidistance(state, message) {
            state.HCfenxi.distance = message
        },
        updateDJfenxidistance(state, message) {
            state.DJfenxi.distance = message
        },
        updateDJfenxiCoordinates(state, message) {
            state.DJfenxi.coordinates = message
        },
        updateHCfenxiSelectData(state, message) {
            state.HCfenxi.selectData = message
        },
        updateHCfenxiSelect(state, message) {
            state.HCfenxi.select = message
        },
        updateDJfenxiSelectData(state, message) {
            state.DJfenxi.selectData = message
        },
        updateCZsearchcheckedmaterial(state, message) {
            state.CZsearch.checkedmaterial = message
        },
        updateQSsearchcheckedAuthority(state, message) {
            state.QSsearch.checkedAuthority = message
        },
        updateFSsearchcheckedAccessory(state, message) {
            state.FSsearch.checkedAccessory = message
        },
        updateTZsearchcheckedFeature(state, message) {
            state.TZsearch.checkedFeature = message
        },
        updatemapEditGuanduanModel(state, message) {
            state.mapEditGuanduanModel = message
        },
        updatemapfhselect(state, message) {
            state.fhselect = message
        }
    }
});


// WEBPACK FOOTER //
// ./src/store/index.js