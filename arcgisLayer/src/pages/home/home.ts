import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {loadCss} from 'esri-loader';
import {loadModules} from 'esri-loader';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    map: any;
    mapExtent: any;
    mapTDTLyr: any;
    mapSDRasterLayer: any;
    mapSDRSAnnoLayer: any;
    mapDynamicMapServiceLayer: any;
    mapTiledMapServiceLayer: any;
    mapFeatureLayer: any;
    //加载矢量图
    loadVec: boolean = true;
    //测试图层地址
    layersAddress = ["http://10.10.50.198:6080/arcgis/rest/services/GH/yitang_ydgh_2017/MapServer",
        "http://10.10.50.198:6080/arcgis/rest/services/GH/linyi_ydgh_2011/MapServer",
        "http://10.10.50.198:6080/arcgis/rest/services/GH/shanggu_dlgh_2018/MapServer"];

    constructor(public navCtrl: NavController) {
    }

    ngAfterContentInit() {

        // loadCss("http://10.10.50.198:8080/arcgis_js_api/library/3.24/3.24/esri/css/esri.css");
        loadCss("/assets/css/esri.css");

        const configure = {
            //url: 'http://10.10.50.198:8080/arcgis_js_api/library/3.24/3.24/init.js'
            url: '/assets/js/3.24/init.js'
        };

        loadModules([
            "esri/map",
            "esri/geometry/Extent",
            "esri/layers/TDTLyr",
            "esri/layers/SDRasterLayer",
            "esri/layers/SDRSAnnoLayer",
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/layers/FeatureLayer"
        ], configure).then(([Map, Extent, TDTLyr, SDRasterLayer, SDRSAnnoLayer, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, FeatureLayer]) => {

            let mapx = new Map('th-arcgis-map-div', {
                logo: false,
                slider: false,
                nav: false,
                showLabels: true, //非常重要；显示标注用
                extent: new Extent({
                    xmin: 118.21249923706051,
                    ymin: 35.09446029663086,
                    xmax: 118.32219085693359,
                    ymax: 35.20535354614259,
                    spatialReference: {
                        wkid: 4490
                    }
                })
            });

            //SAVE
            this.map = mapx;
            this.mapExtent = Extent;
            this.mapTDTLyr = TDTLyr;
            this.mapSDRasterLayer = SDRasterLayer;
            this.mapSDRSAnnoLayer = SDRSAnnoLayer;
            this.mapDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer;
            this.mapTiledMapServiceLayer = ArcGISTiledMapServiceLayer;
            this.mapFeatureLayer = FeatureLayer;

            //添加图层
            const layer = new TDTLyr();
            mapx.addLayer(layer);

        }).catch(err => {
            // handle any errors
            console.error(err);
        });
    }

    addLayer(index) {
        if (index < this.layersAddress.length) {
            const addr = this.layersAddress[index];
            const layer = this.mapDynamicMapServiceLayer(addr, {id: "test" + index});
            this.map.addLayer(layer);
        }
    }

    removeLayer(index) {
        console.log(this.map.layerIds);
        this.removeByLayerId("test" + index);
    }

    switchToVec(isVec) {
        //切换到矢量图
        if (isVec) {
            if (!this.loadVec) {
                this.loadVec = true;
                this.removeByLayerId(this.map.layerIds[1]);
                this.removeByLayerId(this.map.layerIds[0]);
                this.map.addLayer(new this.mapTDTLyr, 0);
            }
        } else {
            //切换到影像图
            if (this.loadVec) {
                this.loadVec = false;
                this.removeByLayerId(this.map.layerIds[0]);
                this.map.addLayer(new this.mapSDRSAnnoLayer, 0);
                this.map.addLayer(new this.mapSDRasterLayer, 0);
            }
        }
    }

    private removeByLayerId(id) {
        const layer = this.map.getLayer(id);
        if (layer) {
            this.map.removeLayer(layer);
        }
    }

}











