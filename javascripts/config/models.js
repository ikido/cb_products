import { API, BaseModel } from 'mobx-model';
import models from 'models';

BaseModel.getModel = (modelName) => {
  return models[modelName]
}

BaseModel.addClassAction('loadAll', function() {
  return API.request({
    endpoint: `${this.urlRoot}`,
    onSuccess: (json) => {
      json.forEach(modelJson => {
      	this.set({ modelJson })
      });      
    }
  });
});