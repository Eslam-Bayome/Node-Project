export class APIFeatures {
  //query is the mongoose query and queryString is the one come from toute

  constructor(public query: any, private queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let { keyword, durationGte, limit, sort, page, fields, ...rest } =
      this.queryString;

    this.query = this.query.find({
      ...(keyword ? { name: { $regex: keyword, $options: 'i' } } : {}),
      ...(durationGte ? { duration: { $gte: durationGte } } : {}),
      ...rest,
    });

    return this;
  }

  sort() {
    let { sort } = this.queryString;
    if (sort) {
      const sortBy = sort.toString().split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    let { fields } = this.queryString;
    if (fields) {
      const fieldsByComma = fields.toString().split(',').join(' ');
      this.query = this.query.select(fieldsByComma);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    let { page, limit } = this.queryString;
    page = page ? +page : 1;
    limit = limit ? +limit : 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
