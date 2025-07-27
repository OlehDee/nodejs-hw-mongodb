export function handleSaveError(error, data, next) {
  const { code, name } = error;
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  next();
}

export function setUpdateSettings(next) {
  this.getOptions.runValidators = true;
  this.options.new = true;
  next();
}