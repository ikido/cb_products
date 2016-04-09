'use strict';

import { API, BaseModel } from 'mobx-model';
import models from 'models';

BaseModel.getModel = (modelName) => {
  return models[modelName]
}

BaseModel.addClassAction('loadAll', function() {
  return API.request({
    endpoint: this.urlRoot,
    onSuccess: (response) => {
      response.body.forEach(modelJson => {
      	this.set({ modelJson })
      });      
    }
  });
});

BaseModel.addClassAction('create', function(attributes = {}) {
  return API.request({
    method: 'post',
    data: attributes,
    endpoint: this.urlRoot,
    onSuccess: (response) => {
      this.set({ modelJson: response.body });
    }
  });
});

BaseModel.addAction('update', function(attributes = {}) {
  return API.request({
    method: 'put',
    data: Object.assign({}, this.toJSON(), attributes),
    endpoint: `${this.urlRoot}/${this.id}`,
    onSuccess: (response) => {
      console.log(response.body)
      this.set({ modelJson: response.body });
    }
  });
});

BaseModel.prototype.toJSON = function() {
  let json = {}

  Object.keys(this.constructor.attributes).forEach(attrName => {
    json[attrName] = this[attrName];
  });

  return json
}
