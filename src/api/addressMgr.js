import citys from '@/components/addressPicker/citys-data.js';
import BMap from 'BMap';

function searchCity(name) {
  let rs = [];
  if (name === '') {
    return [];
  }
  for (let i = 0; i < citys.citys.length; i++) {
    let ls = citys.citys[i].list;
    for (let j = 0; j < ls.length; j++) {
      if (ls[j].name.indexOf(name) > -1) {
        rs.push(ls[j].name);
      }
    }
  }
  return rs;
}

function locate() {
  let geolocation = new BMap.Geolocation();
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(function(r) {
      if (this.getStatus() === 0) {
        resolve({ lng: r.point.lng, lat: r.point.lat });
      } else {
        console.log('failed:' + this.getStatus());
        reject(new Error('定位失败：' + this.getStatus()));
      }
    }, { enableHighAccuracy: true });
  });
}

function getAddress(pt) {
  let point = new BMap.Point(pt.lng, pt.lat);
  let geoc = new BMap.Geocoder();
  return new Promise((resolve, reject) => {
    geoc.getLocation(point, function(rs) {
      let addComp = rs.addressComponents;
      if (addComp) {
        resolve({
          province: addComp.province,
          city: addComp.city,
          district: addComp.district,
          street: addComp.street,
          streetNumber: addComp.streetNumber
        });
      } else {
        reject(new Error('获取地址失败'));
      }
    });
  });
}

function searchPoints(map, keyword, callback) {
  let options = {
    onSearchComplete: function(results) {
      let s = [];
      if (local.getStatus() === 0) {
        for (let i = 0; i < results.getCurrentNumPois(); i++) {
          let p = results.getPoi(i);
          s.push({ title: p.title, province: p.province, city: p.city, address: p.address, point: p.point });
        }
        callback && callback(s);
      } else {
        callback && callback(s);
      }
    }
  };
  let local = new BMap.LocalSearch(map, options);
  local.search(keyword);
}

export {
  searchCity,
  locate,
  getAddress,
  searchPoints
};
