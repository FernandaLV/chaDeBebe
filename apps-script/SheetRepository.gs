var SheetRepository = {
  getSpreadsheet: function() {
    return SpreadsheetApp.openById(Config.SPREADSHEET_ID);
  },

  getSheet: function(name) {
    return SheetRepository.getSpreadsheet().getSheetByName(name);
  },

  getAllRows: function(sheetName) {
    var sheet = SheetRepository.getSheet(sheetName);
    if (!sheet) return [];

    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];

    var headers = data[0].map(function(h) { return String(h).trim(); });
    var rows = [];

    for (var i = 1; i < data.length; i++) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
      }
      rows.push(row);
    }

    return rows;
  },

  findById: function(sheetName, id) {
    var rows = SheetRepository.getAllRows(sheetName);
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i].id) === String(id)) {
        return rows[i];
      }
    }
    return null;
  },

  findIndexById: function(sheetName, id) {
    var sheet = SheetRepository.getSheet(sheetName);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        return i + 1;
      }
    }
    return -1;
  },

  insertRow: function(sheetName, obj) {
    var sheet = SheetRepository.getSheet(sheetName);
    var headers = sheet.getDataRange().getValues()[0].map(function(h) {
      return String(h).trim();
    });
    var row = headers.map(function(h) { return obj[h] || ''; });
    sheet.appendRow(row);
  },

  updateRow: function(sheetName, rowIndex, obj) {
    var sheet = SheetRepository.getSheet(sheetName);
    var headers = sheet.getDataRange().getValues()[0].map(function(h) {
      return String(h).trim();
    });
    for (var key in obj) {
      var col = headers.indexOf(key);
      if (col !== -1) {
        sheet.getRange(rowIndex, col + 1).setValue(obj[key]);
      }
    }
  },

  getRowCount: function(sheetName) {
    var sheet = SheetRepository.getSheet(sheetName);
    return Math.max(0, sheet.getLastRow() - 1);
  },

  getNextId: function(sheetName) {
    var sheet = SheetRepository.getSheet(sheetName);
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return 1;
    var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    var maxId = 0;
    for (var i = 0; i < ids.length; i++) {
      var num = parseInt(ids[i][0], 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
    return maxId + 1;
  }
};
