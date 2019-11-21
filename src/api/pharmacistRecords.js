/**
 * Created by lven on 2018/6/4.
 */
let pharmacistRecords = {
  setList: function (record) {
    let recordsList;
    recordsList = this.getList() || [{}];
    for (let i = 0; i < recordsList.length; i++) {
      if (record.targetid === recordsList[i].targetid) {
        recordsList[i] = record;
        localStorage.setItem('pharmacistRecords', JSON.stringify(recordsList));
        return;
      }
    }
    recordsList.push(record);
    localStorage.setItem('pharmacistRecords', JSON.stringify(recordsList));
  },
  getList: function () {
    let list;
    if (localStorage.getItem('pharmacistRecords')) {
      list = JSON.parse(localStorage.getItem('pharmacistRecords'));
    } else {
      list = [];
    }
    return list;
  }
};
export default pharmacistRecords;
