/*
 * Copyright (c) 2024 unknowIfGuestInDream.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *     * Neither the name of unknowIfGuestInDream, any associated website, nor the
 * names of its contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL UNKNOWIFGUESTINDREAM BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Copyright (c) 2024 unknowIfGuestInDream.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *     * Neither the name of unknowIfGuestInDream, any associated website, nor the
 * names of its contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL UNKNOWIFGUESTINDREAM BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * 数据源信息
 * @type {Ext.data.Store}
 */
var dataBaseStore = Ext.create('Ext.data.Store', {
  storeId: 'dataBaseStore',
  autoLoad: false,//true为自动加载
  loading: false,//自动加载时必须为true
  pageSize: -1,
  fields: ['ID', 'NAME', 'URL', 'DRIVER', 'USERNAME', 'PASSWORD', 'UPDATE_TIME', 'CREATE_TIME'],
  proxy: {
    url: '/gen/selectDataBaseInfo',
    type: 'ajax',
    async: false,
    actionMethods: {
      read: 'GET'
    },
    extraParams: {},
    reader: {
      type: 'json',
      root: 'result'
    }
  }
});

Ext.data.StoreManager.register(dataBaseStore);

/**
 * 数据源信息加载
 * @private
 */
function _selectDataBaseInfo() {
  dataBaseStore.proxy.extraParams = {};
  dataBaseStore.load();
}

//添加监听
function _addDataSourceLoad() {
  dataBaseStore.addListener('load', function () {
    Ext.getCmp('dataSource').select(dataBaseStore.first());
  })
}

//获取数据库空间名称
function _getSchema() {
  var jdbcUrl = Ext.getCmp('dataSource').valueModels[0].data.URL;
  var schema = "";
  if (jdbcUrl.startsWith("jdbc:mysql") || jdbcUrl.startsWith("jdbc:mariadb")) {
    var endIndex = jdbcUrl.indexOf('?');
    var startIndex = jdbcUrl.substring(0, endIndex).lastIndexOf('/');
    schema = jdbcUrl.substring(startIndex + 1, endIndex);
  }
  return schema;
}

//获取数据库类型
//根据驱动判断
function _getDatabaseType() {
  var driver = Ext.getCmp('dataSource').valueModels[0].data.DRIVER;
  if (driver.indexOf('oracle') >= 0) {
    return 'oracle';
  }
  if (driver.indexOf('mysql') >= 0) {
    return 'mysql';
  }
  if (driver.indexOf('mariadb') >= 0) {
    return 'mariadb';
  }
  if (driver.indexOf('microsoft') >= 0) {
    return 'microsoft';
  }
  return 'unknow';
}
