class CommonService {
  constructor(model) {
    this.model = model;
    this.fields = "*";
    this.populateFields = [];
  }

  setFields(fields) {
    this.fields = fields;
  }

  setPopulate(populateFields) {
    this.populateFields = Array.isArray(populateFields)
      ? populateFields
      : [populateFields];
  }

  resetFields() {
    this.fields = "*";
    this.populateFields = [];
  }

  async getById(id) {
    let query =
      this.fields === "*"
        ? this.model.findById(id)
        : this.model.findById(id).select(this.fields);

    // Apply all populate fields if any are set
    this.populateFields.forEach((populateOption) => {
      query = query.populate(populateOption);
    });

    const data = await query.lean();
    this.resetFields();
    return data;
  }

  async findOne(query) {
    let dbQuery =
      this.fields === "*"
        ? this.model.findOne(query)
        : this.model.findOne(query).select(this.fields);

    this.populateFields.forEach((populateOption) => {
      dbQuery = dbQuery.populate(populateOption);
    });

    const data = await dbQuery.lean();
    this.resetFields();
    return data;
  }

  async find(query, options = {}) {
    let dbQuery =
      this.fields === "*"
        ? this.model.find(query)
        : this.model.find(query).select(this.fields);

    this.populateFields.forEach((populateOption) => {
      dbQuery = dbQuery.populate(populateOption);
    });
    if (options.limit) dbQuery = dbQuery.limit(options.limit);
    if (options.skip) dbQuery = dbQuery.skip(options.skip);
    if (options.sort) dbQuery = dbQuery.sort(options.sort);

    const data = await dbQuery.lean();
    this.resetFields();
    return data;
  }

  async create(document) {
    return await this.model.create(document);
  }
}

module.exports = CommonService;
