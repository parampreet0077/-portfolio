const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

class Query {
  constructor(data) {
    this.data = data;
  }

  sort(sortObj) {
    if (!sortObj) return this;
    this.data.sort((a, b) => {
      for (const key in sortObj) {
        const order = sortObj[key]; // 1 for asc, -1 for desc
        let valA = a[key];
        let valB = b[key];

        // Handle case where field is undefined
        if (valA === undefined) valA = 0;
        if (valB === undefined) valB = 0;

        // Try parsing dates if possible
        const timeA = Date.parse(valA);
        const timeB = Date.parse(valB);
        if (!isNaN(timeA) && !isNaN(timeB) && typeof valA === "string" && typeof valB === "string") {
          valA = timeA;
          valB = timeB;
        }

        if (valA < valB) return order === 1 ? -1 : 1;
        if (valA > valB) return order === 1 ? 1 : -1;
      }
      return 0;
    });
    return this;
  }

  select(selectStr) {
    if (selectStr === "-passwordHash") {
      this.data = this.data.map(item => {
        const copy = { ...item };
        delete copy.passwordHash;
        return copy;
      });
    }
    return this;
  }

  async then(onfulfilled, onrejected) {
    try {
      const res = await Promise.resolve(this.data);
      return onfulfilled ? onfulfilled(res) : res;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }
}

class DocumentQuery {
  constructor(promise) {
    this.promise = promise;
    this.selectStr = null;
  }

  select(selectStr) {
    this.selectStr = selectStr;
    return this;
  }

  async then(onfulfilled, onrejected) {
    try {
      let doc = await this.promise;
      if (doc && this.selectStr) {
        if (typeof doc.select === "function") {
          doc = doc.select(this.selectStr);
        } else if (this.selectStr === "-passwordHash") {
          const copy = { ...doc };
          delete copy.passwordHash;
          doc = copy;
        }
      }
      return onfulfilled ? onfulfilled(doc) : doc;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }
}


class JSONModel {
  constructor(filename, defaults = {}) {
    this.filePath = path.join(DATA_DIR, filename);
    this.defaults = defaults;
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  read() {
    try {
      const content = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(content);
    } catch (e) {
      return [];
    }
  }

  write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  find(query = {}) {
    let items = this.read();
    if (Object.keys(query).length > 0) {
      items = items.filter(item => {
        for (const key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      });
    }
    return new Query(items);
  }

  findOne(query = {}) {
    const promise = (async () => {
      const items = this.read();
      const found = items.find(item => {
        for (const key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      });
      if (!found) return null;
      return this._wrapDoc(found);
    })();
    return new DocumentQuery(promise);
  }

  findById(id) {
    const promise = (async () => {
      const items = this.read();
      if (!id) {
        return items.length > 0 ? this._wrapDoc(items[0]) : null;
      }
      const found = items.find(item => item._id === id || item.id === id);
      if (!found) return null;
      return this._wrapDoc(found);
    })();
    return new DocumentQuery(promise);
  }

  async exists(query = {}) {
    const items = this.read();
    if (Object.keys(query).length === 0) {
      return items.length > 0;
    }
    return items.some(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  async create(data) {
    const items = this.read();
    const newDoc = {
      _id: generateId(),
      createdAt: new Date().toISOString(),
      ...this._cloneDefaults(),
      ...data
    };
    items.push(newDoc);
    this.write(items);
    return this._wrapDoc(newDoc);
  }

  findByIdAndUpdate(id, updateData, options = {}) {
    const promise = (async () => {
      const items = this.read();
      let idx = -1;
      if (!id) {
        idx = items.length > 0 ? 0 : -1;
      } else {
        idx = items.findIndex(item => item._id === id || item.id === id);
      }
      if (idx === -1) {
        if (options.upsert) {
          return this.create({ _id: id || generateId(), ...updateData });
        }
        return null;
      }
      items[idx] = {
        ...items[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.write(items);
      return this._wrapDoc(items[idx]);
    })();
    return new DocumentQuery(promise);
  }

  findOneAndUpdate(query, updateData, options = {}) {
    const promise = (async () => {
      const items = this.read();
      const idx = items.findIndex(item => {
        for (const key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      });
      if (idx === -1) {
        if (options.upsert) {
          return this.create(updateData);
        }
        return null;
      }
      items[idx] = {
        ...items[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.write(items);
      return this._wrapDoc(items[idx]);
    })();
    return new DocumentQuery(promise);
  }

  async findByIdAndDelete(id) {
    const items = this.read();
    let idx = -1;
    if (!id) {
      idx = items.length > 0 ? 0 : -1;
    } else {
      idx = items.findIndex(item => item._id === id || item.id === id);
    }
    if (idx === -1) return null;
    const deleted = items[idx];
    items.splice(idx, 1);
    this.write(items);
    return deleted;
  }

  async deleteOne(query = {}) {
    const items = this.read();
    const idx = items.findIndex(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (idx === -1) return { deletedCount: 0 };
    items.splice(idx, 1);
    this.write(items);
    return { deletedCount: 1 };
  }

  async countDocuments(query = {}) {
    const items = this.read();
    if (Object.keys(query).length === 0) return items.length;
    return items.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    }).length;
  }

  _cloneDefaults() {
    return JSON.parse(JSON.stringify(this.defaults));
  }

  _wrapDoc(doc) {
    const self = this;
    const wrapped = {
      ...doc,
      id: doc._id,
      save: async function() {
        const items = self.read();
        const idx = items.findIndex(item => item._id === this._id);
        if (idx !== -1) {
          const docToSave = { ...this };
          delete docToSave.save;
          delete docToSave.select;
          items[idx] = docToSave;
          self.write(items);
        }
        return this;
      },
      select: function(selectStr) {
        if (selectStr === "-passwordHash") {
          const copy = { ...this };
          delete copy.passwordHash;
          return copy;
        }
        return this;
      }
    };
    return wrapped;
  }
}

module.exports = { JSONModel };
