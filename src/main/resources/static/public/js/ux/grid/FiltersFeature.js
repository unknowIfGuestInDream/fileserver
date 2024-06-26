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
 * FiltersFeature is a grid {@link Ext.grid.feature.Feature feature} that allows for a slightly more
 * robust representation of filtering than what is provided by the default store.
 *
 * Filtering is adjusted by the user using the grid's column header menu (this menu can be
 * disabled through configuration). Through this menu users can configure, enable, and
 * disable filters for each column.
 *
 * #Features#
 *
 * ##Filtering implementations:##
 *
 * Default filtering for Strings, Numeric Ranges, Date Ranges, Lists (which can be backed by a
 * {@link Ext.data.Store}), and Boolean. Additional custom filter types and menus are easily
 * created by extending {@link Ext.ux.grid.filter.Filter}.
 *
 * ##Graphical Indicators:##
 *
 * Columns that are filtered have {@link #filterCls a configurable css class} applied to the column headers.
 *
 * ##Automatic Reconfiguration:##
 *
 * Filters automatically reconfigure when the grid 'reconfigure' event fires.
 *
 * ##Stateful:##
 *
 * Filter information will be persisted across page loads by specifying a `stateId`
 * in the Grid configuration.
 *
 * The filter collection binds to the {@link Ext.grid.Panel#beforestaterestore beforestaterestore}
 * and {@link Ext.grid.Panel#beforestatesave beforestatesave} events in order to be stateful.
 *
 * ##GridPanel Changes:##
 *
 * - A `filters` property is added to the GridPanel using this feature.
 * - A `filterupdate` event is added to the GridPanel and is fired upon onStateChange completion.
 *
 * ##Server side code examples:##
 *
 * - [PHP](http://www.vinylfox.com/extjs/grid-filter-php-backend-code.php) - (Thanks VinylFox)</li>
 * - [Ruby on Rails](http://extjs.com/forum/showthread.php?p=77326#post77326) - (Thanks Zyclops)</li>
 * - [Ruby on Rails](http://extjs.com/forum/showthread.php?p=176596#post176596) - (Thanks Rotomaul)</li>
 * - [Python](http://www.debatablybeta.com/posts/using-extjss-grid-filtering-with-django/) - (Thanks Matt)</li>
 * - [Grails](http://mcantrell.wordpress.com/2008/08/22/extjs-grids-and-grails/) - (Thanks Mike)</li>
 *
 * #Example usage:#
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         pageSize: 15
 *         ...
 *     });
 *
 *     var filtersCfg = {
 *         ftype: 'filters',
 *         autoReload: false, //don't reload automatically
 *         local: true, //only filter locally
 *         // filters may be configured through the plugin,
 *         // or in the column definition within the headers configuration
 *         filters: [{
 *             type: 'numeric',
 *             dataIndex: 'id'
 *         }, {
 *             type: 'string',
 *             dataIndex: 'name'
 *         }, {
 *             type: 'numeric',
 *             dataIndex: 'price'
 *         }, {
 *             type: 'date',
 *             dataIndex: 'dateAdded'
 *         }, {
 *             type: 'list',
 *             dataIndex: 'size',
 *             options: ['extra small', 'small', 'medium', 'large', 'extra large'],
 *             phpMode: true
 *         }, {
 *             type: 'boolean',
 *             dataIndex: 'visible'
 *         }]
 *     };
 *
 *     var grid = Ext.create('Ext.grid.Panel', {
 *          store: store,
 *          columns: ...,
 *          filters: [filtersCfg],
 *          height: 400,
 *          width: 700,
 *          bbar: Ext.create('Ext.PagingToolbar', {
 *              store: store
 *          })
 *     });
 *
 *     // a filters property is added to the GridPanel
 *     grid.filters
 */
Ext.define('Ext.ux.grid.FiltersFeature', {
  extend: 'Ext.grid.feature.Feature',
  alias: 'feature.filters',
  uses: [
    'Ext.ux.grid.menu.ListMenu',
    'Ext.ux.grid.menu.RangeMenu',
    'Ext.ux.grid.filter.BooleanFilter',
    'Ext.ux.grid.filter.DateFilter',
    'Ext.ux.grid.filter.ListFilter',
    'Ext.ux.grid.filter.NumericFilter',
    'Ext.ux.grid.filter.StringFilter'
  ],

  /**
   * @cfg {Boolean} autoReload
   * Defaults to true, reloading the datasource when a filter change happens.
   * Set this to false to prevent the datastore from being reloaded if there
   * are changes to the filters.  See <code>{@link #updateBuffer}</code>.
   */
  autoReload: true,
  /**
   * @cfg {Boolean} encode
   * Specify true for {@link #buildQuery} to use Ext.util.JSON.encode to
   * encode the filter query parameter sent with a remote request.
   * Defaults to false.
   */
  /**
   * @cfg {Array} filters
   * An Array of filters config objects. Refer to each filter type class for
   * configuration details specific to each filter type. Filters for Strings,
   * Numeric Ranges, Date Ranges, Lists, and Boolean are the standard filters
   * available.
   */
  /**
   * @cfg {String} filterCls
   * The css class to be applied to column headers with active filters.
   * Defaults to <tt>'ux-filterd-column'</tt>.
   */
  filterCls: 'ux-filtered-column',
  /**
   * @cfg {Boolean} local
   * <tt>true</tt> to use Ext.data.Store filter functions (local filtering)
   * instead of the default (<tt>false</tt>) server side filtering.
   */
  local: false,
  /**
   * @cfg {String} menuFilterText
   * defaults to <tt>'Filters'</tt>.
   */
  menuFilterText: 'Filters',
  /**
   * @cfg {String} paramPrefix
   * The url parameter prefix for the filters.
   * Defaults to <tt>'filter'</tt>.
   */
  paramPrefix: 'filter',
  /**
   * @cfg {Boolean} showMenu
   * Defaults to true, including a filter submenu in the default header menu.
   */
  showMenu: true,
  /**
   * @cfg {String} stateId
   * Name of the value to be used to store state information.
   */
  stateId: undefined,
  /**
   * @cfg {Number} updateBuffer
   * Number of milliseconds to defer store updates since the last filter change.
   */
  updateBuffer: 500,

  // doesn't handle grid body events
  hasFeatureEvent: false,


  /** @private */
  constructor: function (config) {
    var me = this;

    config = config || {};
    Ext.apply(me, config);

    me.deferredUpdate = Ext.create('Ext.util.DelayedTask', me.reload, me);

    // Init filters
    me.filters = me.createFiltersCollection();
    me.filterConfigs = config.filters;
  },

  attachEvents: function () {
    var me = this,
      view = me.view,
      headerCt = view.headerCt,
      grid = me.getGridPanel();

    me.bindStore(view.getStore(), true);

    // Listen for header menu being created
    headerCt.on('menucreate', me.onMenuCreate, me);

    view.on('refresh', me.onRefresh, me);
    grid.on({
      scope: me,
      beforestaterestore: me.applyState,
      beforestatesave: me.saveState,
      beforedestroy: me.destroy
    });

    // Add event and filters shortcut on grid panel
    grid.filters = me;
    grid.addEvents('filterupdate');
  },

  createFiltersCollection: function () {
    return Ext.create('Ext.util.MixedCollection', false, function (o) {
      return o ? o.dataIndex : null;
    });
  },

  /**
   * @private Create the Filter objects for the current configuration, destroying any existing ones first.
   */
  createFilters: function () {
    var me = this,
      hadFilters = me.filters.getCount(),
      grid = me.getGridPanel(),
      filters = me.createFiltersCollection(),
      model = grid.store.model,
      fields = model.prototype.fields,
      field,
      filter,
      state;

    if (hadFilters) {
      state = {};
      me.saveState(null, state);
    }

    function add(dataIndex, config, filterable) {
      if (dataIndex && (filterable || config)) {
        field = fields.get(dataIndex);
        filter = {
          dataIndex: dataIndex,
          type: (field && field.type && field.type.type) || 'auto'
        };

        if (Ext.isObject(config)) {
          Ext.apply(filter, config);
        }

        filters.replace(filter);
      }
    }

    // We start with filters from our config
    Ext.Array.each(me.filterConfigs, function (filterConfig) {
      add(filterConfig.dataIndex, filterConfig);
    });

    // Then we merge on filters from the columns in the grid. The columns' filters take precedence.
    Ext.Array.each(grid.columns, function (column) {
      if (column.filterable === false) {
        filters.removeAtKey(column.dataIndex);
      } else {
        add(column.dataIndex, column.filter, column.filterable);
      }
    });


    me.removeAll();
    if (filters.items) {
      me.initializeFilters(filters.items);
    }

    if (hadFilters) {
      me.applyState(null, state);
    }
  },

  /**
   * @private
   */
  initializeFilters: function (filters) {
    var me = this,
      filtersLength = filters.length,
      i, filter, FilterClass;

    for (i = 0; i < filtersLength; i++) {
      filter = filters[i];
      if (filter) {
        FilterClass = me.getFilterClass(filter.type);
        filter = filter.menu ? filter : new FilterClass(filter);
        me.filters.add(filter);
        Ext.util.Observable.capture(filter, this.onStateChange, this);
      }
    }
  },

  /**
   * @private Handle creation of the grid's header menu. Initializes the filters and listens
   * for the menu being shown.
   */
  onMenuCreate: function (headerCt, menu) {
    var me = this;
    me.createFilters();
    menu.on('beforeshow', me.onMenuBeforeShow, me);
  },

  /**
   * @private Handle showing of the grid's header menu. Sets up the filter item and menu
   * appropriate for the target column.
   */
  onMenuBeforeShow: function (menu) {
    var me = this,
      menuItem, filter;

    if (me.showMenu) {
      menuItem = me.menuItem;
      if (!menuItem || menuItem.isDestroyed) {
        me.createMenuItem(menu);
        menuItem = me.menuItem;
      }

      filter = me.getMenuFilter();

      if (filter) {
        menuItem.setMenu(filter.menu, false);
        menuItem.setChecked(filter.active);
        // disable the menu if filter.disabled explicitly set to true
        menuItem.setDisabled(filter.disabled === true);
      }
      menuItem.setVisible(!!filter);
      this.sep.setVisible(!!filter);
    }
  },


  createMenuItem: function (menu) {
    var me = this;
    me.sep = menu.add('-');
    me.menuItem = menu.add({
      checked: false,
      itemId: 'filters',
      text: me.menuFilterText,
      listeners: {
        scope: me,
        checkchange: me.onCheckChange,
        beforecheckchange: me.onBeforeCheck
      }
    });
  },

  getGridPanel: function () {
    return this.view.up('gridpanel');
  },

  /**
   * @private
   * Handler for the grid's beforestaterestore event (fires before the state of the
   * grid is restored).
   * @param {Object} grid The grid object
   * @param {Object} state The hash of state values returned from the StateProvider.
   */
  applyState: function (grid, state) {
    var me = this,
      key, filter;
    me.applyingState = true;
    me.clearFilters();
    if (state.filters) {
      for (key in state.filters) {
        if (state.filters.hasOwnProperty(key)) {
          filter = me.filters.get(key);
          if (filter) {
            filter.setValue(state.filters[key]);
            filter.setActive(true);
          }
        }
      }
    }
    me.deferredUpdate.cancel();
    if (me.local) {
      me.reload();
    }
    delete me.applyingState;
    delete state.filters;
  },

  /**
   * Saves the state of all active filters
   * @param {Object} grid
   * @param {Object} state
   * @return {Boolean}
   */
  saveState: function (grid, state) {
    var filters = {};
    this.filters.each(function (filter) {
      if (filter.active) {
        filters[filter.dataIndex] = filter.getValue();
      }
    });
    return (state.filters = filters);
  },

  /**
   * @private
   * Handler called by the grid 'beforedestroy' event
   */
  destroy: function () {
    var me = this;
    Ext.destroyMembers(me, 'menuItem', 'sep');
    me.removeAll();
    me.clearListeners();
  },

  /**
   * Remove all filters, permanently destroying them.
   */
  removeAll: function () {
    if (this.filters) {
      Ext.destroy.apply(Ext, this.filters.items);
      // remove all items from the collection
      this.filters.clear();
    }
  },


  /**
   * Changes the data store bound to this view and refreshes it.
   * @param {Ext.data.Store} store The store to bind to this view
   */
  bindStore: function (store) {
    var me = this;

    // Unbind from the old Store
    if (me.store && me.storeListeners) {
      me.store.un(me.storeListeners);
    }

    // Set up correct listeners
    if (store) {
      me.storeListeners = {
        scope: me
      };
      if (me.local) {
        me.storeListeners.load = me.onLoad;
      } else {
        me.storeListeners['before' + (store.buffered ? 'prefetch' : 'load')] = me.onBeforeLoad;
      }
      store.on(me.storeListeners);
    } else {
      delete me.storeListeners;
    }
    me.store = store;
  },

  /**
   * @private
   * Get the filter menu from the filters MixedCollection based on the clicked header
   */
  getMenuFilter: function () {
    var header = this.view.headerCt.getMenu().activeHeader;
    return header ? this.filters.get(header.dataIndex) : null;
  },

  /** @private */
  onCheckChange: function (item, value) {
    this.getMenuFilter().setActive(value);
  },

  /** @private */
  onBeforeCheck: function (check, value) {
    return !value || this.getMenuFilter().isActivatable();
  },

  /**
   * @private
   * Handler for all events on filters.
   * @param {String} event Event name
   * @param {Object} filter Standard signature of the event before the event is fired
   */
  onStateChange: function (event, filter) {
    if (event !== 'serialize') {
      var me = this,
        grid = me.getGridPanel();

      if (filter == me.getMenuFilter()) {
        me.menuItem.setChecked(filter.active, false);
      }

      if ((me.autoReload || me.local) && !me.applyingState) {
        me.deferredUpdate.delay(me.updateBuffer);
      }
      me.updateColumnHeadings();

      if (!me.applyingState) {
        grid.saveState();
      }
      grid.fireEvent('filterupdate', me, filter);
    }
  },

  /**
   * @private
   * Handler for store's beforeload event when configured for remote filtering
   * @param {Object} store
   * @param {Object} options
   */
  onBeforeLoad: function (store, options) {
    options.params = options.params || {};
    this.cleanParams(options.params);
    var params = this.buildQuery(this.getFilterData());
    Ext.apply(options.params, params);
  },

  /**
   * @private
   * Handler for store's load event when configured for local filtering
   * @param {Object} store
   */
  onLoad: function (store) {
    store.filterBy(this.getRecordFilter());
  },

  /**
   * @private
   * Handler called when the grid's view is refreshed
   */
  onRefresh: function () {
    this.updateColumnHeadings();
  },

  /**
   * Update the styles for the header row based on the active filters
   */
  updateColumnHeadings: function () {
    var me = this,
      headerCt = me.view.headerCt;
    if (headerCt) {
      headerCt.items.each(function (header) {
        var filter = me.getFilter(header.dataIndex);
        header[filter && filter.active ? 'addCls' : 'removeCls'](me.filterCls);
      });
    }
  },

  /** @private */
  reload: function () {
    var me = this,
      store = me.view.getStore();

    if (me.local) {
      store.clearFilter(true);
      store.filterBy(me.getRecordFilter());
      store.sort();
    } else {
      me.deferredUpdate.cancel();
      if (store.buffered) {
        store.pageMap.clear();
      }
      store.loadPage(1);
    }
  },

  /**
   * Method factory that generates a record validator for the filters active at the time
   * of invokation.
   * @private
   */
  getRecordFilter: function () {
    var f = [], len, i;
    this.filters.each(function (filter) {
      if (filter.active) {
        f.push(filter);
      }
    });

    len = f.length;
    return function (record) {
      for (i = 0; i < len; i++) {
        if (!f[i].validateRecord(record)) {
          return false;
        }
      }
      return true;
    };
  },

  /**
   * Adds a filter to the collection and observes it for state change.
   * @param {Object/Ext.ux.grid.filter.Filter} config A filter configuration or a filter object.
   * @return {Ext.ux.grid.filter.Filter} The existing or newly created filter object.
   */
  addFilter: function (config) {
    var me = this,
      columns = me.getGridPanel().columns,
      i, columnsLength, column, filtersLength, filter;


    for (i = 0, columnsLength = columns.length; i < columnsLength; i++) {
      column = columns[i];
      if (column.dataIndex === config.dataIndex) {
        column.filter = config;
      }
    }

    if (me.view.headerCt.menu) {
      me.createFilters();
    } else {
      // Call getMenu() to ensure the menu is created, and so, also are the filters. We cannot call
      // createFilters() withouth having a menu because it will cause in a recursion to applyState()
      // that ends up to clear all the filter values. This is likely to happen when we reorder a column
      // and then add a new filter before the menu is recreated.
      me.view.headerCt.getMenu();
    }

    for (i = 0, filtersLength = me.filters.items.length; i < filtersLength; i++) {
      filter = me.filters.items[i];
      if (filter.dataIndex === config.dataIndex) {
        return filter;
      }
    }
  },

  /**
   * Adds filters to the collection.
   * @param {Array} filters An Array of filter configuration objects.
   */
  addFilters: function (filters) {
    if (filters) {
      var me = this,
        i, filtersLength;
      for (i = 0, filtersLength = filters.length; i < filtersLength; i++) {
        me.addFilter(filters[i]);
      }
    }
  },

  /**
   * Returns a filter for the given dataIndex, if one exists.
   * @param {String} dataIndex The dataIndex of the desired filter object.
   * @return {Ext.ux.grid.filter.Filter}
   */
  getFilter: function (dataIndex) {
    return this.filters.get(dataIndex);
  },

  /**
   * Turns all filters off. This does not clear the configuration information
   * (see {@link #removeAll}).
   */
  clearFilters: function () {
    this.filters.each(function (filter) {
      filter.setActive(false);
    });
  },

  /**
   * Returns an Array of the currently active filters.
   * @return {Array} filters Array of the currently active filters.
   */
  getFilterData: function () {
    var filters = [], i, len;

    this.filters.each(function (f) {
      if (f.active) {
        var d = [].concat(f.serialize());
        for (i = 0, len = d.length; i < len; i++) {
          filters.push({
            field: f.dataIndex,
            data: d[i]
          });
        }
      }
    });
    return filters;
  },

  /**
   * Function to take the active filters data and build it into a query.
   * The format of the query depends on the <code>{@link #encode}</code>
   * configuration:
   * <div class="mdetail-params"><ul>
   *
   * <li><b><tt>false</tt></b> : <i>Default</i>
   * <div class="sub-desc">
   * Flatten into query string of the form (assuming <code>{@link #paramPrefix}='filters'</code>:
   * <pre><code>
   filters[0][field]="someDataIndex"&
   filters[0][data][comparison]="someValue1"&
   filters[0][data][type]="someValue2"&
   filters[0][data][value]="someValue3"&
   * </code></pre>
   * </div></li>
   * <li><b><tt>true</tt></b> :
   * <div class="sub-desc">
   * JSON encode the filter data
   * <pre><code>
   filters[0][field]="someDataIndex"&
   filters[0][data][comparison]="someValue1"&
   filters[0][data][type]="someValue2"&
   filters[0][data][value]="someValue3"&
   * </code></pre>
   * </div></li>
   * </ul></div>
   * Override this method to customize the format of the filter query for remote requests.
   * @param {Array} filters A collection of objects representing active filters and their configuration.
   *    Each element will take the form of {field: dataIndex, data: filterConf}. dataIndex is not assured
   *    to be unique as any one filter may be a composite of more basic filters for the same dataIndex.
   * @return {Object} Query keys and values
   */
  buildQuery: function (filters) {
    var p = {}, i, f, root, dataPrefix, key, tmp,
      len = filters.length;

    if (!this.encode) {
      for (i = 0; i < len; i++) {
        f = filters[i];
        root = [this.paramPrefix, '[', i, ']'].join('');
        p[root + '[field]'] = f.field;

        dataPrefix = root + '[data]';
        for (key in f.data) {
          p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
        }
      }
    } else {
      tmp = [];
      for (i = 0; i < len; i++) {
        f = filters[i];
        tmp.push(Ext.apply(
          {},
          {field: f.field},
          f.data
        ));
      }
      // only build if there is active filter
      if (tmp.length > 0) {
        p[this.paramPrefix] = Ext.JSON.encode(tmp);
      }
    }
    return p;
  },

  /**
   * Removes filter related query parameters from the provided object.
   * @param {Object} p Query parameters that may contain filter related fields.
   */
  cleanParams: function (p) {
    // if encoding just delete the property
    if (this.encode) {
      delete p[this.paramPrefix];
      // otherwise scrub the object of filter data
    } else {
      var regex, key;
      regex = new RegExp('^' + this.paramPrefix + '\[[0-9]+\]');
      for (key in p) {
        if (regex.test(key)) {
          delete p[key];
        }
      }
    }
  },

  /**
   * Function for locating filter classes, overwrite this with your favorite
   * loader to provide dynamic filter loading.
   * @param {String} type The type of filter to load ('Filter' is automatically
   * appended to the passed type; eg, 'string' becomes 'StringFilter').
   * @return {Function} The Ext.ux.grid.filter.Class
   */
  getFilterClass: function (type) {
    // map the supported Ext.data.Field type values into a supported filter
    switch (type) {
      case 'auto':
        type = 'string';
        break;
      case 'int':
      case 'float':
        type = 'numeric';
        break;
      case 'bool':
        type = 'boolean';
        break;
    }
    return Ext.ClassManager.getByAlias('gridfilter.' + type);
  }
});
