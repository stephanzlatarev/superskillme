if (!window.superskill) window.superskill = {};
if (!window.superskill.loader) window.superskill.loader = {};

// TODO: this.loading keeps parent-child references after load completes. Remove them to save memory  

window.superskill.loader = new function() {

  this.base = "things/";

  this.loading = {};      // TODO: Rename to queuedItems
  this.queuedScenes = {};

  // Loads the scene and calls the callback with the loaded model. Returns true if loading is complete, and false if in progress
  this.load = function(scene, callback) {
    if (!this.queuedScenes[scene]) {
      this.queuedScenes[scene] = { item: scene, loading: true };

      console.log("Fetching data for scene", scene);
      $.get(this.base + scene).done(function(data) {
        var model = jsyaml.safeLoad(data);

        let expandedModel = this.expandItem(model, {});

        var tracker = function() {
          var keys = Object.keys(this.loading);
          for (var k in keys) {
            if (this.loading[keys[k]].loading) {
              window.setTimeout(tracker, 1000);
              return;
            }
          }

          this.queuedScenes[scene].item = expandedModel;
          this.queuedScenes[scene].loading = false;

          if (callback) callback(expandedModel);
        }.bind(this);

        tracker();
      }.bind(this));

      return false;
    } else if (!this.queuedScenes[scene].loading) {
      if (callback) callback(this.queuedScenes[scene].item);
      return true;
    } else {
      return false;
    }
  }.bind(this);

  this.expandItem = function(item, parts) {
    let itemParts = { ...item.parts, ...parts };

    let expandedItem = this.placeParts(item, itemParts);

    if (expandedItem.item) {
      this.fetchItem(expandedItem.item, expandedItem, itemParts);
    } else if (expandedItem.items) {
      let expandedItems = [];
      for (var i in expandedItem.items) {
        expandedItems.push(this.expandItem(expandedItem.items[i], itemParts));
      }
      expandedItem.items = expandedItems;
    }

    return expandedItem;
  }.bind(this);

  this.placeParts = function(item, parts) {
    let newItem = {};
    var keys = Object.keys(item);
    for (var k in keys) {
      var key = keys[k];
      var value = item[key];
      if (parts[value]) {
        newItem[key] = parts[value];
      } else {
        newItem[key] = value;
      }
    }
    return newItem;
  };

  this.fetchItem = function(item, parent, parts) {
    if (!this.loading[item]) {
      this.loading[item] = { item: item, loading: true, parents: [ { parent: parent, parts: parts } ] };

      let itemParts = parts;

      console.log("Fetching data for item", item);
      $.get(this.base + item).done(function(data) {
        var model = jsyaml.safeLoad(data);

        var parents = this.loading[item].parents;
        for (var p in parents) {
          parents[p].parent.items = this.expandItem(model, parents[p].parts).items;
        }

        this.loading[item] = model;
      }.bind(this));
    } else if (this.loading[item].loading) {
      this.loading[item].parents.push({ parent: parent, parts: parts });
    } else {
      parent.items = this.expandItem(this.loading[item], parts).items;
    }
  }.bind(this);

  return this;
}();
