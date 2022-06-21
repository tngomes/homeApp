import AsyncStorage from '@react-native-community/async-storage';

const helpers = {
  pushArrayStorage: async (name, feed) => {
    let cars = await JSON.parse(await AsyncStorage.getItem(name));
    cars = cars ? cars : [];
    cars = await Array.from(cars);
    await cars.push(feed);

    await AsyncStorage.setItem(name, JSON.stringify(cars));
    var result = JSON.parse(await AsyncStorage.getItem(name));
    return result;
  },

  storageArrayStorage: async (name, feed) => {
    feed = feed ? feed : [];
    feed = await Array.from(feed);
    await AsyncStorage.setItem(name, JSON.stringify(feed));
    var result = JSON.parse(await AsyncStorage.getItem(name));
    return result;
  },


  storageSetItem: async (name, value) => {
    await AsyncStorage.setItem(name, value);
    var storage = await AsyncStorage.getItem(name);
    return storage;
  },

  storageGetItem: async (name) => {
    var getItem = await AsyncStorage.getItem(name);
    return getItem;
  },

  getArrayStorage: async (name) => {

    cars = JSON.parse(await AsyncStorage.getItem(name));
    cars = cars ? cars : [];
    cars = Array.from(cars);
    return cars;
  },

  removeItemArrayStorage: async (name, key) => {

    cars = JSON.parse(await AsyncStorage.getItem(name));
    cars = cars ? cars : [];
    cars = Array.from(cars);
    cars.splice(key, 1);
    await AsyncStorage.setItem(name, JSON.stringify(cars));
    cars = JSON.parse(await AsyncStorage.getItem(name));
    return cars;
  },

  clearAllStorage: async () => {
    await AsyncStorage.clear();
  },

  infoBoardId: async (id) => {

    var boards = await helpers.getArrayStorage('boards');
    var info = null;
    boards.map((item, i) => {
      if (item.id == id) {
        info = item;
      }
    });
    return info;
  },

  infoRoomBoardId: async (id) => {
    var rooms = await helpers.getArrayStorage('rooms');
    var info = [];
    rooms.map((item, i) => {
      if (item.id_board == id) {
        info.push(item)
        // info = item;
      }
    });
    return info;
  },


  validStatus: async (status, error) => {
    let response = {
      success: false,
      status: status,
      message: "tratamento de erro",
      error: error
    }

    switch (status) {
      case 0:
        response.message = 'Falha ao tentar se comunicar com a placa'
        break;

      default:
        response.message = 'Falha na conexão!'
    }
    return response;
  },

  convertJsonToArray: async (json) => {
    var json = Array.from(json);
    return json;
  },

  get: async (url, params) => {

    var response = await fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          return helpers.validStatus(response.status);
        }
        return response.json();
      })
      .then(async (data) => {
        return data;
      })
      .catch(async (error) => {
        return helpers.validStatus(0, error);
      });
    return response;
  },

  registerRoom: async (values) => {
    const obj2 = {
      id: new Date().getTime()
    }

    var values = { ...values, ...obj2 };
    var result = await helpers.pushArrayStorage('rooms', values);

    return result;
  },
}

export default helpers;