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
 * @class Ext.ux.grid.filter.ListFilter
 * @extends Ext.ux.grid.filter.Filter
 * <p>List filters are able to be preloaded/backed by an Ext.data.Store to load
 * their options the first time they are shown. ListFilter utilizes the
 * {@link Ext.ux.grid.menu.ListMenu} component.</p>
 * <p>Although not shown here, this class accepts all configuration options
 * for {@link Ext.ux.grid.menu.ListMenu}.</p>
 *
 * <p><b><u>Example Usage:</u></b></p>
 * <pre><code>
 var filters = Ext.create('Ext.ux.grid.GridFilters', {
 ...
 filters: [{
 type: 'list',
 dataIndex: 'size',
 phpMode: true,
 // options will be used as data to implicitly creates an ArrayStore
 options: ['extra small', 'small', 'medium', 'large', 'extra large']
 }]
 });
 * </code></pre>
 *
 */
Ext.define('Ext.ux.grid.filter.ListFilter', {
  extend: 'Ext.ux.grid.filter.Filter',
  alias: 'gridfilter.list',

  /**
   * @cfg {Array} options
   * <p><code>data</code> to be used to implicitly create a data store
   * to back this list when the data source is <b>local</b>. If the
   * data for the list is remote, use the <code>{@link #store}</code>
   * config instead.</p>
   * <br><p>Each item within the provided array may be in one of the
   * following formats:</p>
   * <div class="mdetail-params"><ul>
   * <li><b>Array</b> :
   * <pre><code>
   options: [
   [11, 'extra small'],
   [18, 'small'],
   [22, 'medium'],
   [35, 'large'],
   [44, 'extra large']
   ]
   * </code></pre>
   * </li>
   * <li><b>Object</b> :
   * <pre><code>
   labelField: 'name', // override default of 'text'
   options: [
   {id: 11, name:'extra small'},
   {id: 18, name:'small'},
   {id: 22, name:'medium'},
   {id: 35, name:'large'},
   {id: 44, name:'extra large'}
   ]
   * </code></pre>
   * </li>
   * <li><b>String</b> :
   * <pre><code>
   * options: ['extra small', 'small', 'medium', 'large', 'extra large']
   * </code></pre>
   * </li>
   */
  /**
   * @cfg {Boolean} phpMode
   * <p>Adjust the format of this filter. Defaults to false.</p>
   * <br><p>When GridFilters <code>@cfg encode = false</code> (default):</p>
   * <pre><code>
   // phpMode == false (default):
   filter[0][data][type] list
   filter[0][data][value] value1
   filter[0][data][value] value2
   filter[0][field] prod

   // phpMode == true:
   filter[0][data][type] list
   filter[0][data][value] value1, value2
   filter[0][field] prod
   * </code></pre>
   * When GridFilters <code>@cfg encode = true</code>:
   * <pre><code>
   // phpMode == false (default):
   filter : [{"type":"list","value":["small","medium"],"field":"size"}]

   // phpMode == true:
   filter : [{"type":"list","value":"small,medium","field":"size"}]
   * </code></pre>
   */
  phpMode: false,
  /**
   * @cfg {Ext.data.Store} store
   * The {@link Ext.data.Store} this list should use as its data source
   * when the data source is <b>remote</b>. If the data for the list
   * is local, use the <code>{@link #options}</code> config instead.
   */

  /**
   * @private
   * Template method that is to initialize the filter.
   * @param {Object} config
   */
  init: function (config) {
    this.dt = Ext.create('Ext.util.DelayedTask', this.fireUpdate, this);
  },

  /**
   * @private @override
   * Creates the Menu for this filter.
   * @param {Object} config Filter configuration
   * @return {Ext.menu.Menu}
   */
  createMenu: function (config) {
    var menu = Ext.create('Ext.ux.grid.menu.ListMenu', config);
    menu.on('checkchange', this.onCheckChange, this);
    return menu;
  },

  /**
   * @private
   * Template method that is to get and return the value of the filter.
   * @return {String} The value of this filter
   */
  getValue: function () {
    return this.menu.getSelected();
  },
  /**
   * @private
   * Template method that is to set the value of the filter.
   * @param {Object} value The value to set the filter
   */
  setValue: function (value) {
    this.menu.setSelected(value);
    this.fireEvent('update', this);
  },

  /**
   * @private
   * Template method that is to return <tt>true</tt> if the filter
   * has enough configuration information to be activated.
   * @return {Boolean}
   */
  isActivatable: function () {
    return this.getValue().length > 0;
  },

  /**
   * @private
   * Template method that is to get and return serialized filter data for
   * transmission to the server.
   * @return {Object/Array} An object or collection of objects containing
   * key value pairs representing the current configuration of the filter.
   */
  getSerialArgs: function () {
    return {type: 'list', value: this.phpMode ? this.getValue().join(',') : this.getValue()};
  },

  /** @private */
  onCheckChange: function () {
    this.dt.delay(this.updateBuffer);
  },


  /**
   * Template method that is to validate the provided Ext.data.Record
   * against the filters configuration.
   * @param {Ext.data.Record} record The record to validate
   * @return {Boolean} true if the record is valid within the bounds
   * of the filter, false otherwise.
   */
  validateRecord: function (record) {
    var valuesArray = this.getValue();
    return Ext.Array.indexOf(valuesArray, record.get(this.dataIndex)) > -1;
  }
});
