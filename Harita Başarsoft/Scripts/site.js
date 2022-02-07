const style = 'AerialWithLabelsOnDemand';
const layers = [];
let i, ii;

const fullScreenControl = new ol.control.FullScreen();
var rasterBinglayer = new ol.layer.Tile({
    visible: true,

    source: new ol.source.BingMaps({
        key: 'AurFtlVuM3RKazmGU9AD2eIoioWmuWyA15YQWsZ_rO33xX_2vHdhY1Va7LXMQZrR',
        imagerySet: 'AerialWithLabelsOnDemand' // Road, CanvasDark, CanvasGray
    }),
})
const sourcedoor = new ol.source.Vector({ wrapX: false });
const vectordoor = new ol.layer.Vector({ source: sourcedoor, });
const sourcestreet = new ol.source.Vector({ wrapX: false });
const vectorstreet = new ol.layer.Vector({ source: sourcestreet, });
const sourceinfo = new ol.source.Vector({ wrapX: false });
const vectorinfo = new ol.layer.Vector({ source: sourceinfo, });

const map = new ol.Map({
    layers: [rasterBinglayer],
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([35.0, 39.14]),
        zoom: 6.3,
    }),
    controls: ol.control.defaults().extend([
        fullScreenControl,
    ])
});

document.getElementById("zoom-out").onclick = function zoomout() {
    const view = map.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom - 1);
};

document.getElementById("zoom-in").onclick = function zoomin () {
    const view = map.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom + 1);
};

var kapi;
function addKapiInteraction() {
    kapi = new ol.interaction.Draw({
        source: sourcedoor,
        type: 'Point'
    });
    map.addInteraction(kapi);
    kapi.setActive(false);
}
map.addLayer(vectordoor);
addKapiInteraction();

function ActiveKapi() {
    kapi.setActive(true);
}

kapi.on('drawend', function (e) {
    zoom = map.getView().getZoom();
    if (zoom > 17) {
        var currentFeature = e.feature;
        var _coords = currentFeature.getGeometry().getCoordinates();


        var panel_kapi_ekle = jsPanel.create({
            id: "kapi_ekle_panel",
            theme: 'fail',
            closeOnEscape: true,
            headerTitle: 'Kapı Ekleme Yöneticisi ',
            position: 'center-top 0 58',
            contentSize: '300 250',
            content: ' No: \t<input id="kapi_no" type="text"/><br><br>Mahalle Kodu: <input id="Quarter_Number" type="text" /><br><br><br><br><button style="height:60px;width:250px;color:black;background-color: #008CBA;" id="kapi_kaydet" class="btn btn-fail">Ekle</button>',
            callback: function () {
                this.content.style.padding = '20px';
            }
        });
        document.getElementById('kapi_kaydet').onclick = function () {

            var _no = $('#kapi_no').val();
            var _kod = $("#Quarter_Number").val();

            if (_no.length && _kod.length < 1) {

                alert("boşlukları doldurunuz ");

                return;
            }
            //kapının kordinatlarını x ve y değişkenlerine attım
            var _data = {
                x: _coords[0].toString().replace('.', ','),
                y: _coords[1].toString().replace('.', ','),
                no: _no,
                Street_No: _kod

            };
            $.ajax({
                type: "POST",
                url: "/Door/SavePoint",
                dataType: 'json',
                data: _data,
                success: function (message) {
                    alert("Başarıyla Eklendi");

                    kapi.setActive(false);
                },

                error: function () {
                    alert("Hata Oluştu");
                },
                onbeforeclose: function () {
                    return onbeforeclose();
                },
            });

            panel_kapi_ekle.close();
        }
 
    }
});
function Listdoor() {
    $.ajax({
        type: "GET",
        url: "/Door/Listkapi",
        dataType: 'json',

        success: function (request) {
            var _features = [];

            for (var i = 0; i < request.length; i++) {

                //her bir pointin x,y koordinatlarını aldım.

                var _point = request[i];
                var _id = _point.Door_Id
                var _geo = new ol.geom.Point([_point.X, _point.Y]);

                var featurething = new ol.Feature({
                    name: "Kapı",
                    geometry: _geo,

                });

                featurething.setId(_id)

                //feature oluşutup buna noktaları atadım ve style verdim

                var _style = new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: 'rgba(0,0,0,0.6)',
                            opacity: 1
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#8000ff'
                        }),
                        radius: 5
                    }),
                });

                featurething.setStyle(_style);

                _features.push(featurething);
            }


            var _pointSource = vectordoor.getSource();

            _pointSource.addFeatures(_features);


            kapi.setActive(false);
        },

        error: function () {
            alert("Hata Oluştu");
        },
        onbeforeclose: function () {
            return onbeforeclose();
        },
    });
}
map.addLayer(vectorstreet);
var mahalle;
function addDaireInteraction() {

    mahalle = new ol.interaction.Draw({
        freehand: false,
        source: sourcestreet,
        type: 'Polygon'
    });
    map.addInteraction(mahalle);
    mahalle.setActive(false);


}

addDaireInteraction();
mahalle.on('drawend', function (e) {
    zoom = map.getView().getZoom();
    if (zoom > 13) {
        var wkt = new ol.format.WKT().writeGeometry(e.feature.getGeometry(), {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        });

        var _Kordinatlar = wkt;

        mahalle.setActive(false);

        var panel = jsPanel.create({
            id: "mahalle_ekle_panel",
            theme: 'fail',
            closeOnEscape: true,
            headerTitle: 'Mahalle Ekleme Yöneticisi',
            position: 'center-top 0 58',
            contentSize: '200 200',
            maximizedMargin: 5,
            content: 'Mahalle adı: <input id="MahalleAdı" type="text"/><br><br>Mahalle Kodu: <input id="MahalleKodu" type="text"/><br><br><button style="height:40px;width:60px" id="Mahalle_kaydet" class="btn btn-success">Ekle</button>',
            callback: function () {
                this.content.style.padding = '20px';
            }

        });

        mahalle.setActive(false);
        document.getElementById('Mahalle_kaydet').onclick = function () {
            var _MahalleAdı = $('#MahalleAdı').val();
            var _MahallleKodu = $('#MahalleKodu').val();

            var _data = {
                name: _MahalleAdı,
                coordinates: _Kordinatlar,
                no: _MahallleKodu
            };
            $.ajax({
                type: "POST",
                url: "/Street/SavePolygon",
                dataType: 'json',
                data: _data,
                success: function (message) {
                    alert("Başarıyla Eklendi");
                    panel.close('mahalle_ekle_panel');
                    mahalle.setActive(false);

                },

                error: function (data) {
                    console.log(data)
                },
                onbeforeclose: function () {
                    return onbeforeclose();
                },
            });
        }
    } else {
        alert("zoom degeri 13 den buyuk olmalıdır");
    }
});

function ActiveMahalle() {
    mahalle.setActive(true);
    
    kapi.setActive(false);
}

function Listall() {
    Listdoor();
    ListAllPolygons();
}
var centers = [];
function ListAllPolygons() {
    $.ajax({
        type: "GET",
        url: "/Street/Listmahalle",
        dataType: 'json',
        success: function (response) {

            var _features = [];
            for (var i = 0; i < response.length; i++) {
                let _wkt = response[i].Street_Coordinates;

                var format = new ol.format.WKT();


                feature = format.readFeature(_wkt);


                var _point = response[i];
                var _id = _point.Street_Id;
                feature.setId(_id);

                feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

                _features.push(feature);


            }
            for (var i = 0; i < response.length; i++) {
                var _cmp = _features[i].getGeometry().getExtent();
                var _center = ol.extent.getCenter(_cmp);

                console.log(_center);
                //var _formatCenter = new ol.format.Feature();
                //var _p_center = _formatCenter.readFeature(_center)
                //centers.push(_center);
            }

            vectorstreet.getSource().addFeatures(_features);
        },

        error: function (data) {
            console.log(data);
        },

    });
}
var bilgi;

function addBilgiInteraction() {

    //seçili işleme göre yeni bir geometrik çizi  oluşturuyor.
    //Biz point seçtireceğimiz için type ı ona göre verdik.

    bilgi = new ol.interaction.Draw({
        source: sourceinfo,
        type: 'Point'
    });

    map.addInteraction(bilgi);

    bilgi.setActive(false);
    //point seçildikten hemen sonra mouse ucunda gelen seçim tool u kapattık

}
function ActiveBilgi() {
    bilgi.setActive(true);
}
map.addLayer(vectorinfo);

addBilgiInteraction();

bilgi.on('drawend', function (e) {
    map.on("click", function (event) {

       

        map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
            //feature dan seçilen pointin bilgilerini yakalayıp db ye method üzerinden gönderelim
            //tip ve id ye feature dan gelen bilgiyi atadım
            var tip = feature.get('name')
            var id = feature.getId()
            seciliId = id
            seciliTip = tip
            var seciliId;
            var seciliTip;
            bilgi.setActive(false);

            if (seciliId) {
                $.ajax({
                    url: '/Info/BilgiVer',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        tip: seciliTip,
                        id: seciliId,
                    },
                    success: function (resp) {
                        var content;

                        if (seciliTip == 'Kapı') {
                            content = 'Kapı Numarası: <input id="yeni_no" type="text"  value=" ' + resp.bilgi.Door_No + '"/>';
                            //value kısmına dönen bilgi set edildi.
                        }
                        jsPanel.create({
                            id: "bilgi_ver",
                            theme: 'success',
                            headerTitle: 'Bölge Bilgileri',
                            position: 'center-top 0 58',
                            contentSize: '300 250',
                            content: content,
                            callback: function () {
                                //id ve tip sıfırlansın.
                                //yenisini seçersem diye 
                                seciliTip = "";
                                seciliId = 0;
                                this.content.style.padding = '20px';
                            },
                        });

                    }
                })
            }
        });
    });
})









